export async function coverageMapper(policy, bill, auditResult) {
  const proRataItem = auditResult.flaggedItems.find(f => f.proRataImpact);
  const proRataRatio = proRataItem ? proRataItem.proRataRatio : 1;

  const mapped = bill.lineItems.map(item => {
    let covered = 0;
    let status = 'covered';
    let note = '';

    if (item.category === 'room') {
      covered = Math.min(item.billed, policy.roomRentCap * (item.days || 1));
      status = item.dailyRate > policy.roomRentCap ? 'partial' : 'covered';
      note = status === 'partial' ? `Room rent cap ₹${policy.roomRentCap}/day applied` : '';
    } else if (item.category === 'implant') {
      const subLimit = policy.specificDiseaseLimits?.jointReplacement || 0;
      covered = Math.min(item.billed, subLimit);
      status = item.billed > subLimit ? 'partial' : 'covered';
      note = `Joint replacement sub-limit ₹${subLimit} applied`;
    } else if (item.category === 'drug') {
      covered = Math.round(item.billed * proRataRatio);
      status = proRataRatio < 1 ? 'partial' : 'covered';
      note = proRataRatio < 1 ? `Pro-rata ratio ${proRataRatio.toFixed(2)} applied due to room rent breach` : '';
    } else {
      covered = Math.round(item.billed * proRataRatio);
      status = proRataRatio < 1 ? 'partial' : 'covered';
      note = proRataRatio < 1 ? `Pro-rata ratio applied` : '';
    }

    return {
      id: item.id,
      description: item.description,
      billed: item.billed,
      covered,
      patientPays: item.billed - covered,
      status,
      note
    };
  });

  const totalCovered = mapped.reduce((sum, i) => sum + i.covered, 0);
  const totalPatientPays = mapped.reduce((sum, i) => sum + i.patientPays, 0);

  return {
    lineItems: mapped,
    totalCovered,
    totalPatientPays,
    totalBilled: bill.totalBilled,
    summary: `Policy covers ₹${totalCovered.toLocaleString('en-IN')}. You pay ₹${totalPatientPays.toLocaleString('en-IN')}.`
  };
}
