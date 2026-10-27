/**
 * Lightweight client-side LinkedIn Job Post parser for CA Dwar
 * Extracts structured fields from raw text without external APIs or dependencies.
 */
import { initialCities, initialDomains } from '../services/mockData';

export function parseLinkedInPost(rawText, sourceUrl = '') {
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      error: 'Please paste the LinkedIn job post content.',
    };
  }

  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. CA Category Validation & Classification
  const isArticleship =
    lower.includes('article') ||
    lower.includes('articleship') ||
    lower.includes('articled assistant') ||
    lower.includes('ca inter') ||
    lower.includes('ipcc');

  const isIndustrial =
    lower.includes('industrial train') ||
    lower.includes('industrial trainee') ||
    lower.includes('industrial training') ||
    lower.includes('ca industrial');

  const isCaJob =
    lower.includes('qualified ca') ||
    lower.includes('fresher ca') ||
    lower.includes('chartered accountant') ||
    lower.includes('ca qualified') ||
    lower.includes('experienced ca') ||
    lower.includes('manager - audit') ||
    lower.includes('manager - tax');

  let category = 'articleship';
  let categoryName = 'Articleship';

  if (isIndustrial) {
    category = 'industrial-training';
    categoryName = 'Industrial Training';
  } else if (isCaJob && !isArticleship) {
    category = 'ca-jobs';
    categoryName = 'CA Jobs';
  } else if (isArticleship) {
    category = 'articleship';
    categoryName = 'Articleship';
  }

  // Flag if post does not seem CA related
  const caKeywords = ['ca', 'icai', 'audit', 'tax', 'gst', 'articleship', 'industrial', 'chartered accountant', 'inter', 'final'];
  const hasCaKeyword = caKeywords.some((kw) => lower.includes(kw));

  // 2. Extract Company / Firm Name
  let companyName = '';
  const companyPatterns = [
    /(?:at|for|company|firm|organization):\s*([A-Za-z0-9&.,\s]{2,50}?)(?:\n|\.|\,|$|is hiring)/i,
    /(?:welcome to|joining)\s+([A-Za-z0-9&.,\s]{2,50}?)(?:\n|\.|\,|$)/i,
    /([A-Z][A-Za-z0-9&.,\s]{2,40}?)\s+is\s+(?:hiring|looking for|inviting applications)/i,
    /Hiring\s+alert\s*[-:—]?\s*([A-Z][A-Za-z0-9&.,\s]{2,40}?)(?:\n|\.|\,|$)/i,
  ];

  for (const pat of companyPatterns) {
    const match = text.match(pat);
    if (match && match[1]) {
      const candidate = match[1].trim().replace(/[-–—]$/, '').trim();
      if (candidate.length > 2 && !candidate.toLowerCase().startsWith('the ') && !candidate.toLowerCase().includes('we are')) {
        companyName = candidate;
        break;
      }
    }
  }

  // Common CA firms / banks direct lookup fallback
  const knownFirms = [
    'Deloitte', 'PwC', 'Price Waterhouse', 'EY', 'Ernst & Young', 'KPMG',
    'BDO India', 'BDO', 'Grant Thornton', 'GT Bharat', 'Walker Chandiok',
    'Morgan Stanley', 'Goldman Sachs', 'JPMorgan', 'J.P. Morgan', 'Citi', 'Citigroup',
    'Motilal Oswal', 'Avendus Capital', 'Kotak Mahindra Bank', 'Kotak', 'HDFC Bank',
    'ICICI Bank', 'Tata Sons', 'Reliance Industries', 'Aditya Birla Group',
    'K.G. Somani & Co.', 'Haribhakti & Co.', 'Singhi & Co.', 'Lodha & Co.', 'S.R. Batliboi',
  ];

  for (const firm of knownFirms) {
    const regex = new RegExp(`\\b${firm.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(text)) {
      companyName = firm;
      break;
    }
  }

  // 3. Location / City Detection
  let city = 'Mumbai';
  for (const c of initialCities) {
    const cLower = c.toLowerCase();
    if (lower.includes(cLower)) {
      city = c;
      break;
    }
  }
  // Alternate aliases
  if (lower.includes('bangalore')) city = 'Bengaluru';
  if (lower.includes('gurgaon')) city = 'Gurugram';
  if (lower.includes('delhi ncr') || lower.includes('new delhi')) city = 'Delhi';

  // 4. Work Mode
  let workMode = 'On-site';
  if (lower.includes('hybrid')) workMode = 'Hybrid';
  else if (lower.includes('remote') || lower.includes('work from home') || lower.includes('wfh')) workMode = 'Remote';

  // 5. Specialized Domain Matching
  const domainChoices =
    category === 'articleship'
      ? initialDomains.articleship
      : category === 'industrial-training'
      ? initialDomains.industrial
      : initialDomains.jobs;

  let domain = domainChoices[0];
  for (const d of domainChoices) {
    const dKeywords = d.toLowerCase().split(/[\s&/()]+/);
    if (dKeywords.some((kw) => kw.length > 3 && lower.includes(kw))) {
      domain = d;
      break;
    }
  }
  // Common specific overrides
  if (lower.includes('statutory audit') || lower.includes('stat audit') || lower.includes('assurance')) {
    domain = category === 'industrial-training' ? 'Statutory Audit' : 'Statutory Audit & Assurance';
  } else if (lower.includes('direct tax') || lower.includes('corporate tax')) {
    domain = 'Direct Tax';
  } else if (lower.includes('indirect tax') || lower.includes('gst')) {
    domain = 'Indirect Taxation (GST)';
  } else if (lower.includes('investment banking') || lower.includes('m&a') || lower.includes('deal advisory')) {
    domain = 'Investment Banking';
  } else if (lower.includes('private equity') || lower.includes('pe fund')) {
    domain = 'Private Equity';
  } else if (lower.includes('fp&a') || lower.includes('financial planning')) {
    domain = 'FP&A';
  } else if (lower.includes('transfer pricing')) {
    domain = 'Transfer Pricing';
  }

  // 6. Job Title
  let title = '';
  const titlePatterns = [
    /(?:role|position|profile|title|designation|hiring for|opening for):\s*([^\n]+)/i,
    /([^\n]*(?:article trainee|industrial trainee|chartered accountant|ca intern|assistant manager)[^\n]*)/i,
  ];

  for (const pat of titlePatterns) {
    const match = text.match(pat);
    if (match && match[1]) {
      const clean = match[1].trim().replace(/^[-:–—]\s*/, '').trim();
      if (clean.length > 5 && clean.length < 80) {
        title = clean;
        break;
      }
    }
  }

  if (!title) {
    if (category === 'articleship') {
      title = `CA Article Trainee – ${domain}`;
    } else if (category === 'industrial-training') {
      title = `CA Industrial Trainee – ${domain}`;
    } else {
      title = `Chartered Accountant – ${domain}`;
    }
  }

  // 7. Vacancies
  let openVacancies = 1;
  const vacMatch = text.match(/(\d+)\s*(?:vacanc|openings?|positions?|seats?|candidates?)/i);
  if (vacMatch && vacMatch[1]) {
    const num = parseInt(vacMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 50) {
      openVacancies = num;
    }
  }

  // 8. Stipend / Salary Detection
  let stipendMin = category === 'ca-jobs' ? 900000 : category === 'industrial-training' ? 25000 : 15000;
  let stipendMax = category === 'ca-jobs' ? 1400000 : category === 'industrial-training' ? 40000 : 22000;
  let stipendPeriod = category === 'ca-jobs' ? 'Per Annum' : 'Monthly';

  // Check for LPA patterns: e.g. "8-12 LPA", "10 to 15 lakhs", "12 LPA"
  const lpaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)/i);
  if (lpaMatch) {
    stipendMin = Math.round(parseFloat(lpaMatch[1]) * 100000);
    stipendMax = Math.round(parseFloat(lpaMatch[2]) * 100000);
    stipendPeriod = 'Per Annum';
  } else {
    // Check for Monthly patterns: e.g. "15000 - 20000", "15k - 25k", "₹20,000 to ₹30,000"
    const monthlyMatch = text.match(/(?:stipend|salary|pay)?\s*(?:rs\.?|inr|₹)?\s*(\d{1,2}(?:,\d{3}|\s*k|\d{3}))\s*(?:-|to)\s*(?:rs\.?|inr|₹)?\s*(\d{1,2}(?:,\d{3}|\s*k|\d{3}))/i);
    if (monthlyMatch) {
      const parseVal = (str) => {
        let clean = str.replace(/,/g, '').trim().toLowerCase();
        if (clean.endsWith('k')) return parseFloat(clean) * 1000;
        return parseInt(clean, 10);
      };
      const min = parseVal(monthlyMatch[1]);
      const max = parseVal(monthlyMatch[2]);
      if (!isNaN(min) && !isNaN(max) && min > 0) {
        stipendMin = min;
        stipendMax = max;
        stipendPeriod = min > 100000 ? 'Per Annum' : 'Monthly';
      }
    }
  }

  // 9. CA Eligibility & Attempts
  let requiredGroups = 'Both Groups';
  if (lower.includes('either group') || lower.includes('any group')) {
    requiredGroups = 'Either Group';
  } else if (lower.includes('group 1') && !lower.includes('both')) {
    requiredGroups = 'Group 1';
  } else if (lower.includes('group 2') && !lower.includes('both')) {
    requiredGroups = 'Group 2';
  }

  let attempts = 'Any Attempt';
  if (lower.includes('first attempt') || lower.includes('1st attempt') || lower.includes('ranker')) {
    attempts = 'First Attempt Preferred';
  } else if (lower.includes('max 2 attempts') || lower.includes('second attempt') || lower.includes('1-2 attempts')) {
    attempts = 'Max 2 Attempts';
  }

  let eligibility = '';
  if (category === 'articleship') {
    eligibility = 'CA Intermediate cleared (Both Groups preferred) as per ICAI norms';
  } else if (category === 'industrial-training') {
    eligibility = 'CA Finalist with min 12 months of completed articleship';
  } else {
    eligibility = 'Qualified Chartered Accountant (ICAI Member)';
  }

  // 10. Extract Application Link & Recruiter Email
  let recruiterEmail = '';
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    recruiterEmail = emailMatch[0];
  }

  let applicationLink = sourceUrl || '';
  const urlMatches = text.match(/https?:\/\/[^\s)]+/g);
  if (urlMatches) {
    const nonLinkedIn = urlMatches.find((u) => !u.includes('linkedin.com/feed') && !u.includes('lnkd.in'));
    if (nonLinkedIn) {
      applicationLink = nonLinkedIn;
    } else if (!applicationLink && urlMatches[0]) {
      applicationLink = urlMatches[0];
    }
  }

  // 11. Extract Responsibilities & Skills
  const responsibilities = [];
  const skills = [];

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let mode = 'normal';

  for (const line of lines) {
    const lLower = line.toLowerCase();
    if (lLower.includes('responsibilit') || lLower.includes('duties') || lLower.includes('key tasks') || lLower.includes('you will do')) {
      mode = 'resp';
      continue;
    }
    if (lLower.includes('skill') || lLower.includes('requirement') || lLower.includes('prerequisite') || lLower.includes('qualifications')) {
      mode = 'skills';
      continue;
    }
    if (lLower.includes('how to apply') || lLower.includes('contact') || lLower.includes('about the company')) {
      mode = 'other';
      continue;
    }

    if (mode === 'resp') {
      const clean = line.replace(/^[-•*–—\d.)\s]+/, '').trim();
      if (clean.length > 5 && clean.length < 150) responsibilities.push(clean);
    } else if (mode === 'skills') {
      const clean = line.replace(/^[-•*–—\d.)\s]+/, '').trim();
      if (clean.length > 2 && clean.length < 60) skills.push(clean);
    }
  }

  const defaultResp =
    category === 'articleship'
      ? ['Assist in audit planning, walkthroughs, and substantive testing.', 'Verify statutory tax compliances and assist in drafting memos.']
      : category === 'industrial-training'
      ? ['Build dynamic financial models, DCF, and ratio analysis.', 'Assist deal teams in commercial due diligence and presentations.']
      : ['Lead statutory audit / tax engagements independently.', 'Ensure compliance with Ind AS and statutory deadlines.'];

  const defaultSkills =
    category === 'articleship'
      ? ['Ind AS', 'MS Excel', 'Audit Principles']
      : category === 'industrial-training'
      ? ['Financial Modeling', 'Valuation', 'Corporate Finance', 'MS Excel']
      : ['Ind AS', 'Direct Tax', 'Team Leadership', 'ERP / Tally'];

  return {
    success: true,
    isCaRelated: hasCaKeyword,
    extracted: {
      companyName: companyName || '',
      title,
      category,
      categoryName,
      domain,
      city,
      workMode,
      openVacancies,
      requiredGroups,
      attempts,
      eligibility,
      deadline: '20 days left',
      stipendMin,
      stipendMax,
      stipendPeriod,
      description: text,
      responsibilitiesText: (responsibilities.length > 0 ? responsibilities : defaultResp).join('\n'),
      skillsText: (skills.length > 0 ? skills : defaultSkills).join(', '),
      recruiterEmail,
      applicationLink,
    },
  };
}
