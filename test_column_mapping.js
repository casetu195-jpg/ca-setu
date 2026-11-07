import assert from 'assert';

/**
 * Strict 25-Column Canonical Schema
 */
const CANONICAL_25_HEADERS = [
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

function validateStrict25Headers(actualHeaders) {
  if (!actualHeaders || actualHeaders.length < 25) {
    return {
      isValid: false,
      reason: 'Sheet has fewer than 25 columns (found ' + (actualHeaders ? actualHeaders.length : 0) + ').'
    };
  }

  for (let i = 0; i < 25; i++) {
    const expected = CANONICAL_25_HEADERS[i];
    const actual = (actualHeaders[i] || '').toString().trim();
    if (actual.toLowerCase() !== expected.toLowerCase()) {
      const colLetter = String.fromCharCode(65 + i);
      return {
        isValid: false,
        colLetter: colLetter,
        colIndex: i + 1,
        expected: expected,
        found: actual,
        reason: 'Column ' + colLetter + ' (Index ' + (i + 1) + ') mismatch: Expected "' + expected + '", but found "' + actual + '".'
      };
    }
  }

  return { isValid: true };
}

function getHighestExistingVacancyNumber(existingRows) {
  let maxNum = 0;
  for (let i = 0; i < existingRows.length; i++) {
    const idStr = (existingRows[i][0] || '').toString().trim();
    const match = idStr.match(/^VAC-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return maxNum;
}

function processImportBatch(vacancyList, existingRows) {
  let currentMax = getHighestExistingVacancyNumber(existingRows);
  const rows = [];
  const todayStr = '2026-11-07';

  for (let i = 0; i < vacancyList.length; i++) {
    const item = vacancyList[i] || {};
    const company = (item.companyName || item.company || '').toString().trim();
    const title = (item.jobTitle || item.title || '').toString().trim();

    // Unique sequential ID in batch even before appending
    let vacId = (item.vacancyId || '').toString().trim();
    if (!vacId) {
      currentMax++;
      vacId = 'VAC-' + ('000' + currentMax).slice(-3);
    }

    const isAsianPaints = company.toLowerCase().includes('asian paints');
    let duplicateCheck = 'Needs Review';
    let approvalStatus = 'Pending Approval';
    let verificationStatus = 'Pending Verification';
    let publishStatus = 'Unpublished';
    let remarks = (item.remarks || '').toString().trim();

    // Flag missing fields (Requirement 3: no invented defaults)
    const missing = [];
    if (!item.category) missing.push('Category');
    if (!item.location) missing.push('Location');
    if (!item.workMode) missing.push('Work Mode');
    if (!item.deadline) missing.push('Application Deadline');
    if (!item.sourceName) missing.push('Source Name');
    if (!item.vacancyType) missing.push('Vacancy Type');

    if (missing.length > 0) {
      const note = '[VERIFICATION NEEDED] Missing fields: ' + missing.join(', ');
      remarks = remarks ? note + ' | ' + remarks : note;
    }

    if (isAsianPaints) {
      duplicateCheck = 'Duplicate: Asian Paints (Previously Inactive - Manual Verification Required)';
      approvalStatus = 'On Hold';
      const asianNote = '[HELD] Asian Paints was previously marked Inactive. Explicit verification required before re-activation.';
      remarks = remarks ? asianNote + ' | ' + remarks : asianNote;
    }

    const row = new Array(25);
    row[0] = vacId;
    row[1] = item.dateFound || todayStr;
    row[2] = item.category || '';                     // NO invented 'Articleship'
    row[3] = company;
    row[4] = title;
    row[5] = item.location || '';                     // NO invented 'Pan-India'
    row[6] = item.workMode || '';                     // NO invented 'On-site'
    row[7] = item.eligibility || '';
    row[8] = item.stipend || '';
    row[9] = item.duration || '';
    row[10] = item.joiningDetails || '';
    row[11] = item.deadline || '';                    // NO invented '15 days left'
    row[12] = item.applicationMethod || '';
    row[13] = item.applicationUrl || '';
    row[14] = item.contactDetails || '';
    row[15] = item.sourceUrl || item.originalSourceUrl || '';
    row[16] = verificationStatus;
    row[17] = duplicateCheck;
    row[18] = approvalStatus;
    row[19] = publishStatus;
    row[20] = remarks;
    row[21] = item.sourceName || '';                  // NO invented 'Company Careers'
    row[22] = item.sourceCheckedDate || todayStr;
    row[23] = item.vacancyType || '';                 // NO invented 'Full-Time'
    row[24] = item.researchReportId || '';

    rows.push(row);
  }

  return rows;
}

// ============================================================================
// TESTS
// ============================================================================
console.log('=== TEST 1: Batch Vacancy ID Generation (At least 3 vacancies without IDs) ===');
const existingRows = [
  ['VAC-001', '2026-11-01', 'Articleship', 'ABC & Co', 'Audit Trainee'],
  ['VAC-002', '2026-11-02', 'Articleship', 'XYZ LLP', 'Tax Trainee'],
  ['VAC-085', '2026-11-06', 'Industrial Training', 'PQR Ltd', 'Finance Analyst']
];

const batch3Vacancies = [
  { companyName: 'Firm Alpha & Co', jobTitle: 'Articleship Trainee' },
  { companyName: 'Beta Advisors LLP', jobTitle: 'Direct Tax Executive' },
  { companyName: 'Gamma Financial Services', jobTitle: 'Industrial Trainee' }
];

const processedBatch = processImportBatch(batch3Vacancies, existingRows);
assert.strictEqual(processedBatch.length, 3, 'Batch should contain 3 rows');
assert.strictEqual(processedBatch[0][0], 'VAC-086', 'First vacancy must be VAC-086');
assert.strictEqual(processedBatch[1][0], 'VAC-087', 'Second vacancy must be VAC-087');
assert.strictEqual(processedBatch[2][0], 'VAC-088', 'Third vacancy must be VAC-088');

const idSet = new Set(processedBatch.map(r => r[0]));
assert.strictEqual(idSet.size, 3, 'All 3 batch IDs must be unique');
console.log('✓ All 3 vacancies received unique, sequential IDs before appending: VAC-086, VAC-087, VAC-088.');

console.log('\n=== TEST 2: Strict Header Validation of Exact Names and Column Order A:Y ===');
const validHeaders = [...CANONICAL_25_HEADERS];
const validCheck = validateStrict25Headers(validHeaders);
assert.strictEqual(validCheck.isValid, true, 'Canonical 25 headers must be valid');

const misalignedHeaders = [...CANONICAL_25_HEADERS];
misalignedHeaders[3] = 'Job Title'; // Column D duplicate
const invalidCheck = validateStrict25Headers(misalignedHeaders);
assert.strictEqual(invalidCheck.isValid, false, 'Misaligned header must be rejected');
assert.strictEqual(invalidCheck.colLetter, 'D');
assert.strictEqual(invalidCheck.expected, 'Company Name');
assert.strictEqual(invalidCheck.found, 'Job Title');
console.log('✓ Strict validation caught Column D mismatch (Expected "Company Name", found "Job Title").');

console.log('\n=== TEST 3: Removal of Invented Defaults ===');
const minimalVacancy = {
  companyName: 'Minimalist CA Firm',
  jobTitle: 'Audit Associate'
};
const processedMinimal = processImportBatch([minimalVacancy], existingRows)[0];
assert.strictEqual(processedMinimal[2], '', 'Category must be empty when not provided');
assert.strictEqual(processedMinimal[5], '', 'Location must be empty when not provided');
assert.strictEqual(processedMinimal[6], '', 'Work Mode must be empty when not provided');
assert.strictEqual(processedMinimal[11], '', 'Application Deadline must be empty when not provided');
assert.strictEqual(processedMinimal[21], '', 'Source Name must be empty when not provided');
assert.strictEqual(processedMinimal[23], '', 'Vacancy Type must be empty when not provided');
assert(processedMinimal[20].includes('[VERIFICATION NEEDED] Missing fields:'), 'Missing fields must be flagged in Remarks');
console.log('✓ No invented defaults: Category, Location, Work Mode, Deadline, Source Name, and Vacancy Type are left blank and flagged in Remarks.');

console.log('\n=== TEST 4: Asian Paints Inactive Safeguard in Batch ===');
const asianBatch = [
  { companyName: 'Asian Paints', jobTitle: 'Finance Trainee' }
];
const processedAsian = processImportBatch(asianBatch, existingRows)[0];
assert(processedAsian[17].includes('Previously Inactive'), 'Asian Paints flagged in Duplicate Check');
assert.strictEqual(processedAsian[18], 'On Hold', 'Asian Paints Approval Status must be On Hold');
assert.strictEqual(processedAsian[19], 'Unpublished', 'Publish Status must be Unpublished');
console.log('✓ Asian Paints strictly placed On Hold and Unpublished.');

console.log('\n=== TEST 5: Real Firm Verification (Sukhbir and Associates, Nitin Pandey & Co., ANS & Associates) ===');
const testFirms = [
  {
    companyName: 'Sukhbir and Associates',
    jobTitle: 'Articleship Trainee'
    // Intentionally missing: Vacancy ID, Location through Contact Details
  },
  {
    companyName: 'Nitin Pandey & Co.',
    jobTitle: 'CA Industrial Trainee',
    location: 'Delhi'
    // Intentionally missing: Vacancy ID, Work Mode through Contact Details
  },
  {
    companyName: 'ANS & Associates',
    jobTitle: 'Tax Associate',
    contactDetails: 'careers@ansassociates.com'
    // Intentionally missing: Vacancy ID, Location through Application URL
  }
];

const processedFirms = processImportBatch(testFirms, existingRows);
assert.strictEqual(processedFirms.length, 3, 'Must process 3 firms');

// Validate Sukhbir and Associates
const sukhbir = processedFirms[0];
assert.strictEqual(sukhbir[0], 'VAC-086', 'Col A: Must generate sequential Vacancy ID VAC-086');
assert.strictEqual(sukhbir[3], 'Sukhbir and Associates', 'Col D: Company Name');
assert.strictEqual(sukhbir[4], 'Articleship Trainee', 'Col E: Job Title');
// Verify Columns F through O do NOT contain Job Title
for (let c = 5; c <= 14; c++) {
  assert.notStrictEqual(sukhbir[c], 'Articleship Trainee', `Col ${CANONICAL_25_HEADERS[c]} must NOT contain repeated Job Title`);
  assert.strictEqual(sukhbir[c], '', `Col ${CANONICAL_25_HEADERS[c]} must be empty string when unavailable`);
}
assert(sukhbir[20].includes('[VERIFICATION NEEDED]'), 'Remarks must flag missing fields');

// Validate Nitin Pandey & Co.
const nitin = processedFirms[1];
assert.strictEqual(nitin[0], 'VAC-087', 'Col A: Must generate sequential Vacancy ID VAC-087');
assert.strictEqual(nitin[3], 'Nitin Pandey & Co.', 'Col D: Company Name');
assert.strictEqual(nitin[4], 'CA Industrial Trainee', 'Col E: Job Title');
assert.strictEqual(nitin[5], 'Delhi', 'Col F: Location correctly mapped to Delhi');
for (let c = 6; c <= 14; c++) {
  assert.notStrictEqual(nitin[c], 'CA Industrial Trainee', `Col ${CANONICAL_25_HEADERS[c]} must NOT contain repeated Job Title`);
  assert.strictEqual(nitin[c], '', `Col ${CANONICAL_25_HEADERS[c]} must be empty string when unavailable`);
}

// Validate ANS & Associates
const ans = processedFirms[2];
assert.strictEqual(ans[0], 'VAC-088', 'Col A: Must generate sequential Vacancy ID VAC-088');
assert.strictEqual(ans[3], 'ANS & Associates', 'Col D: Company Name');
assert.strictEqual(ans[4], 'Tax Associate', 'Col E: Job Title');
assert.strictEqual(ans[14], 'careers@ansassociates.com', 'Col O: Contact Details');
for (let c = 5; c <= 13; c++) {
  assert.notStrictEqual(ans[c], 'Tax Associate', `Col ${CANONICAL_25_HEADERS[c]} must NOT contain repeated Job Title`);
  assert.strictEqual(ans[c], '', `Col ${CANONICAL_25_HEADERS[c]} must be empty string when unavailable`);
}

console.log('✓ Verified: Vacancy IDs generated (VAC-086, VAC-087, VAC-088).');
console.log('✓ Verified: Job Title is NEVER used as fallback for Location through Contact Details.');
console.log('✓ Verified: Missing information left blank and flagged in Remarks.');

console.log('\n--- 25-COLUMN VERIFICATION MATRIX ---');
console.log(
  'Col'.padEnd(5) +
  'Header Name'.padEnd(24) +
  'Sukhbir & Associates'.padEnd(28) +
  'Nitin Pandey & Co.'.padEnd(26) +
  'ANS & Associates'
);
console.log('-'.repeat(105));
for (let i = 0; i < 25; i++) {
  const colLetter = String.fromCharCode(65 + i);
  const header = CANONICAL_25_HEADERS[i];
  const val1 = sukhbir[i] === '' ? '(blank)' : (sukhbir[i].length > 25 ? sukhbir[i].substring(0, 22) + '...' : sukhbir[i]);
  const val2 = nitin[i] === '' ? '(blank)' : (nitin[i].length > 23 ? nitin[i].substring(0, 20) + '...' : nitin[i]);
  const val3 = ans[i] === '' ? '(blank)' : (ans[i].length > 25 ? ans[i].substring(0, 22) + '...' : ans[i]);
  console.log(
    colLetter.padEnd(5) +
    header.padEnd(24) +
    val1.padEnd(28) +
    val2.padEnd(26) +
    val3
  );
}

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
