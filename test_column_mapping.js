import assert from 'assert';

/**
 * Test Suite: Google Sheets Research Queue 25-Column Automation & Safeguards
 */

const EXPECTED_25_HEADERS = [
  'Vacancy ID',           // Col A (0)
  'Date Found',           // Col B (1)
  'Category',             // Col C (2)
  'Company Name',         // Col D (3)
  'Job Title',            // Col E (4)
  'Location',             // Col F (5)
  'Work Mode',            // Col G (6)
  'Eligibility',          // Col H (7)
  'Stipend / Salary',     // Col I (8)
  'Duration',             // Col J (9)
  'Joining Details',      // Col K (10)
  'Application Deadline', // Col L (11)
  'Application Method',   // Col M (12)
  'Application URL',      // Col N (13)
  'Contact Details',      // Col O (14)
  'Original Source URL',  // Col P (15)
  'Verification Status',  // Col Q (16)
  'Duplicate Check',      // Col R (17)
  'Approval Status',      // Col S (18)
  'Publish Status',       // Col T (19)
  'Remarks',              // Col U (20)
  'Source Name',          // Col V (21)
  'Source Checked Date',  // Col W (22)
  'Vacancy Type',         // Col X (23)
  'Research Report ID'    // Col Y (24)
];

const OUTPUT_HEADERS = [
  'Website Job ID',       // Col Z (25)
  'Live Website URL',     // Col AA (26)
  'Last Publish Response' // Col AB (27)
];

// Helper to validate header structure and detect duplicate "Job Title"
function validateHeaderRow(headers) {
  const counts = {};
  for (const h of headers) {
    const norm = (h || '').toString().trim().toLowerCase();
    counts[norm] = (counts[norm] || 0) + 1;
  }

  if (counts['job title'] > 1) {
    return {
      isValid: false,
      error: `Duplicate Column Error: Header 'Job Title' appears ${counts['job title']} times in row 1.`
    };
  }

  // Check required fields
  const required = ['vacancy id', 'company name', 'job title', 'category', 'verification status', 'duplicate check', 'approval status', 'publish status'];
  for (const req of required) {
    if (!counts[req]) {
      return {
        isValid: false,
        error: `Missing Column Error: Required header '${req}' is not found.`
      };
    }
  }

  return { isValid: true };
}

// Vacancy ID Generator
function generateNextVacancyId(existingRows) {
  let maxNum = 0;
  for (const row of existingRows) {
    const idStr = (row[0] || '').toString().trim();
    const match = idStr.match(/^VAC-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return 'VAC-' + String(nextNum).padStart(3, '0');
}

// Import Processor Simulation
function processImportVacancy(item, existingRows) {
  const vacancyId = item.vacancyId || generateNextVacancyId(existingRows);
  const company = (item.companyName || '').trim();
  const title = (item.jobTitle || item.title || '').trim();

  // Safeguard: Asian Paints & Inactive Check
  let isAsianPaints = company.toLowerCase().includes('asian paints');
  let duplicateCheck = 'Needs Review';
  let approvalStatus = 'Pending Approval';
  let verificationStatus = 'Pending Verification';
  let publishStatus = 'Unpublished';
  let remarks = item.remarks || '';

  if (isAsianPaints) {
    duplicateCheck = 'Duplicate: Asian Paints (Previously Inactive - Manual Verification Required)';
    approvalStatus = 'On Hold';
    remarks = '[HELD] Asian Paints was previously marked Inactive. Explicit verification required before re-activation.';
  } else {
    // Check against existing rows for duplicate company + title
    for (const er of existingRows) {
      const exCompany = (er[3] || '').toString().trim().toLowerCase();
      const exTitle = (er[4] || '').toString().trim().toLowerCase();
      if (exCompany && exCompany === company.toLowerCase() && exTitle && exTitle === title.toLowerCase()) {
        duplicateCheck = `Potential Duplicate of ${er[0] || 'existing vacancy'}`;
        approvalStatus = 'Pending Review';
        break;
      }
    }
  }

  // Map strictly to 25 columns
  const row = new Array(25).fill('');
  row[0] = vacancyId;
  row[1] = item.dateFound || new Date().toISOString().split('T')[0];
  row[2] = item.category || 'Articleship';
  row[3] = company;
  row[4] = title;
  row[5] = item.location || 'Mumbai';
  row[6] = item.workMode || 'Hybrid';
  row[7] = item.eligibility || 'CA Inter Both Groups';
  row[8] = item.stipend || '₹20,000 / month';
  row[9] = item.duration || '12 Months';
  row[10] = item.joiningDetails || 'Immediate';
  row[11] = item.deadline || '15 Days Left';
  row[12] = item.applicationMethod || 'email';
  row[13] = item.applicationUrl || '';
  row[14] = item.contactDetails || 'recruiter@example.com';
  row[15] = item.sourceUrl || 'https://example.com/careers';
  row[16] = verificationStatus;
  row[17] = duplicateCheck;
  row[18] = approvalStatus;
  row[19] = publishStatus;
  row[20] = remarks;
  row[21] = item.sourceName || 'Company Careers Page';
  row[22] = item.sourceCheckedDate || new Date().toISOString().split('T')[0];
  row[23] = item.vacancyType || 'Full-Time';
  row[24] = item.researchReportId || 'REP-001';

  return row;
}

// -------------------------------------------------------------
// TESTS
// -------------------------------------------------------------
console.log('=== TEST 1: Validate Exact 25 Headers & Detect Duplicate Job Title ===');
const goodHeaders = [...EXPECTED_25_HEADERS];
const validation1 = validateHeaderRow(goodHeaders);
assert.strictEqual(validation1.isValid, true, 'Clean 25 headers should be valid');
console.log('✓ Clean 25 headers validation passed.');

const duplicateJobTitleHeaders = [
  'Vacancy ID', 'Date Found', 'Category', 'Job Title', 'Job Title', 'Location',
  'Work Mode', 'Eligibility', 'Stipend / Salary', 'Duration', 'Joining Details',
  'Application Deadline', 'Application Method', 'Application URL', 'Contact Details',
  'Original Source URL', 'Verification Status', 'Duplicate Check', 'Approval Status',
  'Publish Status', 'Remarks', 'Source Name', 'Source Checked Date', 'Vacancy Type', 'Research Report ID'
];
const validation2 = validateHeaderRow(duplicateJobTitleHeaders);
assert.strictEqual(validation2.isValid, false, 'Duplicate Job Title headers must be detected');
assert(validation2.error.includes("Duplicate Column Error: Header 'Job Title' appears 2 times"));
console.log('✓ Duplicate "Job Title" header correctly detected and rejected.');

console.log('\n=== TEST 2: Vacancy ID Generation ===');
const existingSheet = [
  ['VAC-001', '2026-11-01', 'Articleship', 'ABC & Co', 'Audit Trainee'],
  ['VAC-002', '2026-11-02', 'Articleship', 'XYZ LLP', 'Tax Trainee'],
  ['VAC-085', '2026-11-06', 'Industrial Training', 'PQR Ltd', 'Finance Analyst']
];
const nextId = generateNextVacancyId(existingSheet);
assert.strictEqual(nextId, 'VAC-086', 'Next Vacancy ID should be VAC-086');
console.log(`✓ Vacancy ID generated correctly: ${nextId}`);

console.log('\n=== TEST 3: Asian Paints Inactive Safeguard ===');
const asianPaintsItem = {
  companyName: 'Asian Paints',
  jobTitle: 'Finance & Accounts Trainee',
  category: 'Industrial Training'
};
const asianRow = processImportVacancy(asianPaintsItem, existingSheet);
assert.strictEqual(asianRow[3], 'Asian Paints');
assert.strictEqual(asianRow[17].includes('Asian Paints (Previously Inactive'), true, 'Duplicate check must flag Asian Paints');
assert.strictEqual(asianRow[18], 'On Hold', 'Approval Status must be On Hold, never Approved');
assert.strictEqual(asianRow[16], 'Pending Verification', 'Verification Status must be Pending Verification, never Verified');
assert.strictEqual(asianRow[19], 'Unpublished', 'Publish Status must be Unpublished');
console.log('✓ Asian Paints correctly flagged, held, and prohibited from active re-import without explicit verification.');

console.log('\n=== TEST 4: Preservation of Manual Approval Workflow ===');
const standardItem = {
  companyName: 'Tata Consultancy Services',
  jobTitle: 'Industrial Trainee - Internal Audit',
  category: 'Industrial Training'
};
const standardRow = processImportVacancy(standardItem, existingSheet);
assert.notStrictEqual(standardRow[16], 'Verified', 'Imported row must NEVER be automatically Verified');
assert.notStrictEqual(standardRow[17], 'No Duplicate', 'Imported row must NEVER be automatically No Duplicate');
assert.notStrictEqual(standardRow[18], 'Approved', 'Imported row must NEVER be automatically Approved');
assert.notStrictEqual(standardRow[19], 'Published', 'Imported row must NEVER be automatically Published');
assert.strictEqual(standardRow[16], 'Pending Verification');
assert.strictEqual(standardRow[17], 'Needs Review');
assert.strictEqual(standardRow[18], 'Pending Approval');
assert.strictEqual(standardRow[19], 'Unpublished');
console.log('✓ Manual approval workflow strictly preserved: Verification, Duplicate Check, Approval, and Publish statuses default to unapproved.');

console.log('\n=== TEST 5: Dummy Record 25-Field Column Mapping Verification ===');
const dummyItem = {
  vacancyId: 'VAC-999',
  dateFound: '2026-11-07',
  category: 'Industrial Training',
  companyName: 'Dummy Test Firm & Co',
  jobTitle: 'Finance & Accounts Trainee',
  location: 'Mumbai, Maharashtra',
  workMode: 'Hybrid',
  eligibility: 'CA Inter Both Groups Cleared',
  stipend: '₹25,000 / month',
  duration: '12 Months',
  joiningDetails: 'Immediate',
  deadline: '15 Days Left',
  applicationMethod: 'email',
  applicationUrl: '',
  contactDetails: 'careers@dummytestfirm.com',
  sourceUrl: 'https://dummytestfirm.com/careers/trainee-2026',
  remarks: 'Test dummy import record for column mapping verification',
  sourceName: 'Company Career Page',
  sourceCheckedDate: '2026-11-07',
  vacancyType: 'Full-Time Trainee',
  researchReportId: 'REP-TEST-001'
};
const dummyRow = processImportVacancy(dummyItem, existingSheet);

assert.strictEqual(dummyRow.length, 25, 'Row must have exactly 25 columns');
assert.strictEqual(dummyRow[0], 'VAC-999', 'Col A: Vacancy ID');
assert.strictEqual(dummyRow[1], '2026-11-07', 'Col B: Date Found');
assert.strictEqual(dummyRow[2], 'Industrial Training', 'Col C: Category');
assert.strictEqual(dummyRow[3], 'Dummy Test Firm & Co', 'Col D: Company Name');
assert.strictEqual(dummyRow[4], 'Finance & Accounts Trainee', 'Col E: Job Title');
assert.strictEqual(dummyRow[5], 'Mumbai, Maharashtra', 'Col F: Location');
assert.strictEqual(dummyRow[6], 'Hybrid', 'Col G: Work Mode');
assert.strictEqual(dummyRow[7], 'CA Inter Both Groups Cleared', 'Col H: Eligibility');
assert.strictEqual(dummyRow[8], '₹25,000 / month', 'Col I: Stipend / Salary');
assert.strictEqual(dummyRow[9], '12 Months', 'Col J: Duration');
assert.strictEqual(dummyRow[10], 'Immediate', 'Col K: Joining Details');
assert.strictEqual(dummyRow[11], '15 Days Left', 'Col L: Application Deadline');
assert.strictEqual(dummyRow[12], 'email', 'Col M: Application Method');
assert.strictEqual(dummyRow[13], '', 'Col N: Application URL');
assert.strictEqual(dummyRow[14], 'careers@dummytestfirm.com', 'Col O: Contact Details');
assert.strictEqual(dummyRow[15], 'https://dummytestfirm.com/careers/trainee-2026', 'Col P: Original Source URL');
assert.strictEqual(dummyRow[16], 'Pending Verification', 'Col Q: Verification Status');
assert.strictEqual(dummyRow[17], 'Needs Review', 'Col R: Duplicate Check');
assert.strictEqual(dummyRow[18], 'Pending Approval', 'Col S: Approval Status');
assert.strictEqual(dummyRow[19], 'Unpublished', 'Col T: Publish Status');
assert.strictEqual(dummyRow[20], 'Test dummy import record for column mapping verification', 'Col U: Remarks');
assert.strictEqual(dummyRow[21], 'Company Career Page', 'Col V: Source Name');
assert.strictEqual(dummyRow[22], '2026-11-07', 'Col W: Source Checked Date');
assert.strictEqual(dummyRow[23], 'Full-Time Trainee', 'Col X: Vacancy Type');
assert.strictEqual(dummyRow[24], 'REP-TEST-001', 'Col Y: Research Report ID');

console.log('✓ All 25 fields verified in exact 1-to-1 correspondence with Expected Headers:');
EXPECTED_25_HEADERS.forEach((h, i) => {
  console.log(`  Col ${String.fromCharCode(65 + i)} [Index ${i}] '${h}' = "${dummyRow[i]}"`);
});

console.log('\nALL 5 TEST SUITES PASSED PERFECTLY!');
