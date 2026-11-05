// Helper utilities for CA Setu

export function formatStipend(job) {
  if (!job) return '';
  const { stipendMin, stipendMax, stipendPeriod } = job;
  
  const hasMin = stipendMin !== undefined && stipendMin !== null && stipendMin !== '' && !isNaN(stipendMin) && Number(stipendMin) > 0;
  const hasMax = stipendMax !== undefined && stipendMax !== null && stipendMax !== '' && !isNaN(stipendMax) && Number(stipendMax) > 0;

  if (!hasMin && !hasMax) {
    return 'Not Disclosed';
  }

  const formatNum = (num) => '₹' + Number(num).toLocaleString('en-IN');

  if (stipendPeriod === 'Per Annum') {
    if (hasMin && hasMax) {
      const minLakhs = (stipendMin / 100000).toFixed(1).replace('.0', '');
      const maxLakhs = (stipendMax / 100000).toFixed(1).replace('.0', '');
      return `₹${minLakhs}–₹${maxLakhs} LPA`;
    }
    if (hasMin) {
      const minLakhs = (stipendMin / 100000).toFixed(1).replace('.0', '');
      return `₹${minLakhs} LPA`;
    }
    if (hasMax) {
      const maxLakhs = (stipendMax / 100000).toFixed(1).replace('.0', '');
      return `Up to ₹${maxLakhs} LPA`;
    }
  }

  // Monthly
  if (hasMin && hasMax) {
    return `${formatNum(stipendMin)}–${formatNum(stipendMax)}/mo`;
  }
  if (hasMin) {
    return `${formatNum(stipendMin)}/mo`;
  }
  if (hasMax) {
    return `Up to ${formatNum(stipendMax)}/mo`;
  }

  return 'Not Disclosed';
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Applied':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Under Review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Shortlisted':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Interview':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
    case 'Selected':
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Published':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Draft':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Pending Review':
      return 'bg-amber-50 text-amber-700 border-amber-300';
    case 'Paused':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Closed':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
