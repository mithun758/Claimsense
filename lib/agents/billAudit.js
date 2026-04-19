import nppa from '../../data/nppa_drugs.json' assert { type: 'json' };
import cghs from '../../data/cghs_procedures.json' assert { type: 'json' };

export async function billAudit(bill) {
  const flagged = [];
  let totalOvercharge = 0;

  for (const item of bill.lineItems) {
    if (item.category === 'drug' && item.nppaCode) {
      const drug = nppa.drugs.find(d => d.code === item.nppaCode);
      if (drug) {
        const nppaCost = drug.nppaCeiling * item.units;
        const overcharge = item.billed - nppaCost;
        if (overcharge > 0) {
          flagged.push({
            id: item.id,
            description: item.description,
            billed: item.billed,
            benchmark: nppaCost,
            benchmarkSource: 'NPPA',
            overcharge: Math.round(overcharge),
            note: `NPPA ceiling ₹${drug.nppaCeiling}/unit x ${item.units} units = ₹${nppaCost}`
          });
          totalOvercharge += overcharge;
        }
      }
    }

    if (item.category === 'room') {
      const roomRentCap = 3000;
      const dailyRate = item.dailyRate;
      if (dailyRate > roomRentCap) {
        const proRataRatio = roomRentCap / dailyRate;
        flagged.push({
          id: item.id,
          description: item.description,
          billed: item.billed,
          benchmark: roomRentCap * item.days,
          benchmarkSource: 'Policy room rent cap',
          overcharge: item.billed - (roomRentCap * item.days),
          note: `Room rent ₹${dailyRate}/day exceeds policy cap ₹${roomRentCap}/day. Pro-rata ratio: ${proRataRatio.toFixed(2)} — all other items also reduced proportionally`,
          proRataRatio: proRataRatio,
          proRataImpact: true
        });
        totalOvercharge += item.billed - (roomRentCap * item.days);
      }
    }

    if (item.category === 'consumable' && item.cdscoFlag) {
      flagged.push({
        id: item.id,
        description: item.description,
        billed: item.billed,
        benchmark: Math.round(item.billed * 0.4),
        benchmarkSource: 'CDSCO generic equivalent',
        overcharge: Math.round(item.billed * 0.6),
        note: 'CDSCO-approved generic equivalents available at ~60% lower cost'
      });
      totalOvercharge += Math.round(item.billed * 0.6);
    }
  }

  return {
    totalBilled: bill.totalBilled,
    flaggedItems: flagged,
    totalOvercharge: Math.round(totalOvercharge),
    cleanItems: bill.lineItems.filter(i => !flagged.find(f => f.id === i.id)).length,
    summary: `Found ${flagged.length} overcharged items totalling ₹${Math.round(totalOvercharge)}`
  };
}
