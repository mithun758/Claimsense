import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const MODEL_FALLBACK_ORDER = [
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-2.5-flash',
];

function extractJSON(text) {
  if (!text) return null;

  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('=== JSON PARSE FAILED ===');
    console.error('Response length:', text.length, 'chars');
    console.error('Last 100 chars of response:', text.substring(Math.max(0, text.length - 100)));
    console.error('Full raw response:', text);
    return null;
  }
}

async function tryModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== 'STOP') {
    console.warn(`⚠ Response finished with reason: ${finishReason} — may be truncated`);
  }

  return text;
}

export async function callGemini(prompt) {
  await sleep(1500);

  let lastError = null;
  for (const modelName of MODEL_FALLBACK_ORDER) {
    try {
      const text = await tryModel(modelName, prompt);
      const parsed = extractJSON(text);
      if (parsed) return parsed;

      console.error(`${modelName} returned unparseable text of length ${text.length}`);
      return { raw: text, parseError: true };
    } catch (error) {
      lastError = error;

      if (error.message.includes('429') || error.message.includes('quota')) {
        console.log(`Rate limit hit, waiting 8 seconds...`);
        await sleep(8000);
        try {
          const text = await tryModel(modelName, prompt);
          const parsed = extractJSON(text);
          if (parsed) return parsed;
        } catch (e) {
          lastError = e;
        }
      }

      if (error.message.includes('404') || error.message.includes('not found')) {
        console.log(`Model ${modelName} not available, trying next...`);
        continue;
      }

      if (error.message.includes('responseMimeType') || error.message.includes('thinking')) {
        console.log(`Model ${modelName} config issue, retrying without JSON mode...`);
        try {
          const basicModel = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { maxOutputTokens: 2000, temperature: 0.3 },
          });
          const result = await basicModel.generateContent(prompt);
          const text = result.response.text();
          const parsed = extractJSON(text);
          if (parsed) return parsed;
        } catch (e) {
          lastError = e;
        }
      }

      throw error;
    }
  }
  throw lastError || new Error('All Gemini models failed');
}
