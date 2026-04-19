import { policyGrader } from './agents/policyGrader.js';
import { coverageBuilder } from './agents/coverageBuilder.js';
import { billAudit } from './agents/billAudit.js';
import { coverageMapper } from './agents/coverageMapper.js';
import { disputeLetter } from './agents/disputeLetter.js';
import { preAdmission } from './agents/preAdmission.js';
import { cashlessFlow } from './agents/cashlessFlow.js';
import policy from '../data/mock_policy.json' assert { type: 'json' };
import bill from '../data/mock_bill.json' assert { type: 'json' };
import procedures from '../data/cghs_procedures.json' assert { type: 'json' };

export async function runAgents(journey) {
  const steps = [];
  const result = {};

  const addStep = (agent, status, summary) => {
    steps.push({ agent, status, timestamp: new Date().toISOString(), summary });
  };

  try {
    // ALL journeys run Policy Grader first
    addStep('Policy Grader', 'running', 'Reading your policy...');
    result.grade = await policyGrader(policy);
    addStep('Policy Grader', 'done', `Grade: ${result.grade?.grade} — ${result.grade?.gradeReason}`);

    if (journey === 'report') {
      addStep('Coverage Builder', 'running', 'Building 3 procedure cost scenarios...');
      result.coverage = await coverageBuilder(policy, procedures.procedures);
      addStep('Coverage Builder', 'done', '3 procedure scenarios calculated');
    }

    if (journey === 'preAdmission') {
      addStep('Coverage Builder', 'running', 'Calculating your out-of-pocket costs...');
      result.coverage = await coverageBuilder(policy, procedures.procedures);
      addStep('Coverage Builder', 'done', 'Cost scenarios ready');

      addStep('Pre-Admission Checklist', 'running', 'Checking hospital network and room rent trap...');
      result.preAdmission = await preAdmission(policy, 'Manipal Hospital Whitefield', 'Total Knee Replacement');
      addStep('Pre-Admission Checklist', 'done', 'Checklist ready');

      addStep('Cashless Flow', 'running', 'Preparing your IRDAI rights advisory...');
      result.cashless = await cashlessFlow(policy);
      addStep('Cashless Flow', 'done', 'Rights advisory ready');
    }

    if (journey === 'dispute' || journey === 'billAudit') {
      addStep('Bill Audit', 'running', 'Checking bill against NPPA, CGHS, CDSCO benchmarks...');
      result.audit = await billAudit(bill);
      addStep('Bill Audit', 'done', result.audit.summary);

      addStep('Coverage Mapper', 'running', 'Mapping what your policy covers...');
      result.coverageMap = await coverageMapper(policy, bill, result.audit);
      addStep('Coverage Mapper', 'done', result.coverageMap.summary);

      if (journey === 'dispute') {
        addStep('Dispute Letter', 'running', 'Writing your dispute letter...');
        result.letter = await disputeLetter(policy, result.audit, result.coverageMap);
        addStep('Dispute Letter', 'done', 'Dispute letter ready');
      }
    }

  } catch (error) {
    addStep('Error', 'failed', error.message);
    result.error = error.message;
  }

  return { steps, result, policy, bill, journey };
}
