/**
 * ============================================================================
 * CA DWAR — AUTOMATION CONTROL CENTRE (Code.gs)
 * ============================================================================
 * Spreadsheet: CA DWAR – Automation Control Centre
 * Sheet Tab: Research Queue
 * Role: Main Sheet Controller, Menu Builder & Vacancy Import Processor
 * ============================================================================
 */

// Configuration Constants for Automation Control Centre
var CONTROL_CENTRE_CONFIG = {
  SHEET_NAME: 'Research Queue',
  TEST_SHEET_NAME: 'Test Queue'
};

/**
 * The exact 25 canonical column headers in strict order (Columns A through Y).
 */
var CANONICAL_RESEARCH_HEADERS = [
  'Vacancy ID',           // Col A (Index 0)
  'Date Found',           // Col B (Index 1)
  'Category',             // Col C (Index 2)
  'Company Name',         // Col D (Index 3)
  'Job Title',            // Col E (Index 4)
  'Location',             // Col F (Index 5)
  'Work Mode',            // Col G (Index 6)
  'Eligibility',          // Col H (Index 7)
  'Stipend / Salary',     // Col I (Index 8)
  'Duration',             // Col J (Index 9)
  'Joining Details',      // Col K (Index 10)
  'Application Deadline', // Col L (Index 11)
  'Application Method',   // Col M (Index 12)
  'Application URL',      // Col N (Index 13)
  'Contact Details',      // Col O (Index 14)
  'Original Source URL',  // Col P (Index 15)
  'Verification Status',  // Col Q (Index 16)
  'Duplicate Check',      // Col R (Index 17)
  'Approval Status',      // Col S (Index 18)
  'Publish Status',       // Col T (Index 19)
  'Remarks',              // Col U (Index 20)
  'Source Name',          // Col V (Index 21)
  'Source Checked Date',  // Col W (Index 22)
  'Vacancy Type',         // Col X (Index 23)
  'Research Report ID'    // Col Y (Index 24)
];

/**
 * Exactly ONE global onOpen() function across the entire Apps Script project.
 * Preserves the existing Bulk Import Vacancies menu item alongside publishing and test tools.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CA Dwar Tools')
    .addItem('Bulk Import Vacancies', 'showBulkImport')
    .addSeparator()
    .addItem('Check Automation API Connection', 'checkAutomationConnection')
    .addItem('Publish Approved Vacancies', 'publishApprovedVacancies')
    .addSeparator()
    .addItem('Test Import in Separate Sheet (Test Queue)', 'testImportDummyRecord')
    .addToUi();
}

/**
 * Generates the next sequential Vacancy ID (e.g. VAC-001, VAC-086).
 * Scans Column A to find the highest existing number.
 */
function getNextVacancyId(sheet) {
  var data = sheet.getDataRange().getValues();
  var maxNum = 0;
  for (var i = 1; i < data.length; i++) {
    var val = (data[i][0] || '').toString().trim();
    var match = val.match(/^VAC-(\d+)$/i);
    if (match) {
      var num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return 'VAC-' + ('000' + (maxNum + 1)).slice(-3);
}

/**
 * Validates the header row of a sheet.
 * Detects and alerts if duplicate headers (like repeated 'Job Title') exist.
 */
function validateSheetHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return { isValid: false, reason: 'Sheet is empty.' };

  var headers = sheet.getRange(1, 1, 1, Math.max(lastCol, 25)).getValues()[0];
  var counts = {};
  for (var i = 0; i < headers.length; i++) {
    var h = (headers[i] || '').toString().trim().toLowerCase();
    if (h) {
      counts[h] = (counts[h] || 0) + 1;
      if (h === 'job title' && counts[h] > 1) {
        return {
          isValid: false,
          hasDuplicateJobTitle: true,
          reason: 'Duplicate column header "Job Title" detected in row 1.'
        };
      }
    }
  }
  return { isValid: true, headers: headers };
}

/**
 * Formats a Date object as YYYY-MM-DD string.
 */
function formatDateYMD(d) {
  if (!d) return '';
  if (typeof d === 'string') return d;
  try {
    var year = d.getFullYear();
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  } catch (e) {
    return String(d);
  }
}

/**
 * Imports an array of vacancy objects strictly into the 25 canonical columns.
 * Enforces Vacancy ID generation, Asian Paints inactive protection, and manual approval defaults.
 * 
 * @param {Array<Object>} vacancyList Array of vacancy data objects.
 * @param {string} [targetSheetName] Target sheet name ('Research Queue' or 'Test Queue').
 */
function importVacanciesIntoQueue(vacancyList, targetSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = targetSheetName || CONTROL_CENTRE_CONFIG.SHEET_NAME;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" not found in this spreadsheet.');
  }

  // Pre-flight check on headers
  var headerCheck = validateSheetHeaders(sheet);
  if (!headerCheck.isValid && headerCheck.hasDuplicateJobTitle) {
    throw new Error('Import blocked: Row 1 of "' + sheetName + '" contains repeated "Job Title" headers. Please remove the duplicate column before importing.');
  }

  var existingData = sheet.getDataRange().getValues();
  var rowsToAppend = [];
  var todayStr = formatDateYMD(new Date());

  for (var i = 0; i < vacancyList.length; i++) {
    var item = vacancyList[i] || {};
    var company = (item.companyName || item.company || '').toString().trim();
    var title = (item.jobTitle || item.title || '').toString().trim();

    // 1. Ensure Vacancy ID is generated
    var vacId = (item.vacancyId || '').toString().trim();
    if (!vacId) {
      vacId = getNextVacancyId(sheet);
    }

    // 2. Asian Paints & Inactive Re-Import Safeguard
    var isAsianPaints = company.toLowerCase().indexOf('asian paints') !== -1;
    var duplicateCheckStatus = 'Needs Review';
    var approvalStatus = 'Pending Approval';
    var verificationStatus = 'Pending Verification';
    var publishStatus = 'Unpublished';
    var remarks = (item.remarks || '').toString().trim();

    if (isAsianPaints) {
      // Asian Paints was previously marked Inactive. Never re-import as new active without explicit verification.
      duplicateCheckStatus = 'Duplicate: Asian Paints (Previously Inactive - Manual Verification Required)';
      approvalStatus = 'On Hold';
      verificationStatus = 'Pending Verification';
      publishStatus = 'Unpublished';
      var holdNote = '[HELD] Asian Paints was previously marked Inactive. Explicit verification required before re-activation.';
      remarks = remarks ? holdNote + ' ' + remarks : holdNote;
    } else {
      // Scan existing rows for duplicate company + title or source url
      for (var r = 1; r < existingData.length; r++) {
        var exComp = (existingData[r][3] || '').toString().trim().toLowerCase();
        var exTitle = (existingData[r][4] || '').toString().trim().toLowerCase();
        var exSource = (existingData[r][15] || '').toString().trim().toLowerCase();
        var newSource = (item.sourceUrl || item.originalSourceUrl || '').toString().trim().toLowerCase();

        if (company && exComp === company.toLowerCase() && title && exTitle === title.toLowerCase()) {
          duplicateCheckStatus = 'Potential Duplicate of ' + (existingData[r][0] || 'Row ' + (r + 1));
          approvalStatus = 'Pending Review';
          break;
        } else if (newSource && exSource && newSource === exSource) {
          duplicateCheckStatus = 'Potential Duplicate (Matching Source URL: ' + (existingData[r][0] || 'Row ' + (r + 1)) + ')';
          approvalStatus = 'Pending Review';
          break;
        }
      }
    }

    // 3. Strict 25-Column Row Array Construction
    var row = new Array(25);
    row[0] = vacId;                                                                          // Col A: Vacancy ID
    row[1] = item.dateFound ? formatDateYMD(item.dateFound) : todayStr;                     // Col B: Date Found
    row[2] = item.category || 'Articleship';                                                 // Col C: Category
    row[3] = company;                                                                        // Col D: Company Name
    row[4] = title;                                                                          // Col E: Job Title
    row[5] = item.location || 'Pan-India';                                                   // Col F: Location
    row[6] = item.workMode || 'On-site';                                                     // Col G: Work Mode
    row[7] = item.eligibility || '';                                                         // Col H: Eligibility
    row[8] = item.stipend || '';                                                             // Col I: Stipend / Salary
    row[9] = item.duration || '';                                                            // Col J: Duration
    row[10] = item.joiningDetails || '';                                                     // Col K: Joining Details
    row[11] = item.deadline || '15 days left';                                               // Col L: Application Deadline
    row[12] = item.applicationMethod || (item.contactDetails ? 'email' : 'link');            // Col M: Application Method
    row[13] = item.applicationUrl || '';                                                     // Col N: Application URL
    row[14] = item.contactDetails || '';                                                     // Col O: Contact Details
    row[15] = item.sourceUrl || item.originalSourceUrl || '';                                // Col P: Original Source URL
    row[16] = verificationStatus;                                                            // Col Q: Verification Status (NEVER 'Verified')
    row[17] = duplicateCheckStatus;                                                          // Col R: Duplicate Check (NEVER 'No Duplicate')
    row[18] = approvalStatus;                                                                // Col S: Approval Status (NEVER 'Approved')
    row[19] = publishStatus;                                                                 // Col T: Publish Status (NEVER 'Published')
    row[20] = remarks;                                                                       // Col U: Remarks
    row[21] = item.sourceName || 'Company Careers';                                          // Col V: Source Name
    row[22] = item.sourceCheckedDate ? formatDateYMD(item.sourceCheckedDate) : todayStr;     // Col W: Source Checked Date
    row[23] = item.vacancyType || 'Full-Time';                                               // Col X: Vacancy Type
    row[24] = item.researchReportId || '';                                                   // Col Y: Research Report ID

    rowsToAppend.push(row);
  }

  if (rowsToAppend.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsToAppend.length, 25).setValues(rowsToAppend);
  }

  return rowsToAppend.length;
}

/**
 * Displays the Bulk Import Vacancies dialog.
 */
function showBulkImport() {
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createHtmlOutput(
    '<html><body style="font-family: Arial, sans-serif; padding: 15px;">' +
    '<h3 style="margin-top:0;">Bulk Import Vacancies</h3>' +
    '<p style="font-size: 13px; color: #555;">Paste JSON array or CSV of researched vacancies. Fields will map strictly to the 25 canonical columns.</p>' +
    '<textarea id="importData" style="width: 100%; height: 220px; font-family: monospace; font-size: 12px;" placeholder="[{\n  \"companyName\": \"ABC & Co\",\n  \"jobTitle\": \"Articleship Trainee\",\n  \"category\": \"Articleship\",\n  \"location\": \"Mumbai\"\n}]"></textarea><br><br>' +
    '<button style="background: #1a73e8; color: white; border: none; padding: 10px 18px; font-size: 14px; border-radius: 4px; cursor: pointer;" onclick="runImport()">Import to Research Queue</button>' +
    '<script>' +
    'function runImport() {' +
    '  var text = document.getElementById("importData").value.trim();' +
    '  if (!text) { alert("Please paste vacancy data first."); return; }' +
    '  google.script.run.withSuccessHandler(function(res) {' +
    '    alert(res); google.script.host.close();' +
    '  }).withFailureHandler(function(err) {' +
    '    alert("Import Error: " + err.message);' +
    '  }).executeBulkImportFromModal(text);' +
    '}' +
    '</script>' +
    '</body></html>'
  ).setWidth(600).setHeight(400);

  ui.showModalDialog(html, 'Bulk Import Vacancies — CA Dwar');
}

/**
 * Server-side handler for the Bulk Import modal.
 */
function executeBulkImportFromModal(text) {
  var list = [];
  try {
    list = JSON.parse(text);
    if (!Array.isArray(list)) list = [list];
  } catch (e) {
    throw new Error('Input must be a valid JSON array of vacancy objects.');
  }

  var count = importVacanciesIntoQueue(list, CONTROL_CENTRE_CONFIG.SHEET_NAME);
  return 'Successfully imported ' + count + ' vacancy/vacancies into Research Queue.\n\nAll imported vacancies are set to "Pending Approval" and "Pending Verification" for manual review.';
}

/**
 * TEST ACTION 9:
 * Imports 1 dummy record into a separate isolated 'Test Queue' sheet tab.
 * NEVER modifies the live 'Research Queue'.
 * Verifies that all 25 fields map to their exact respective columns.
 */
function testImportDummyRecord() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var testSheetName = CONTROL_CENTRE_CONFIG.TEST_SHEET_NAME;

  // 1. Get or create the separate Test Queue tab
  var testSheet = ss.getSheetByName(testSheetName);
  if (!testSheet) {
    testSheet = ss.insertSheet(testSheetName);
  } else {
    testSheet.clear(); // Clear only the test tab
  }

  // 2. Set the 25 Canonical Headers in Row 1 of Test Queue
  testSheet.getRange(1, 1, 1, 25).setValues([CANONICAL_RESEARCH_HEADERS]);
  testSheet.getRange(1, 1, 1, 25).setFontWeight('bold').setBackground('#f3f3f3');

  // 3. Construct 1 Dummy Test Vacancy with distinct values across all 25 fields
  var dummyVacancy = {
    vacancyId: 'VAC-TEST-999',
    dateFound: new Date(),
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
    sourceCheckedDate: new Date(),
    vacancyType: 'Full-Time Trainee',
    researchReportId: 'REP-TEST-001'
  };

  // 4. Import the dummy record into Test Queue
  var importedCount = importVacanciesIntoQueue([dummyVacancy], testSheetName);

  // 5. Read back Row 2 from Test Queue and verify each of the 25 fields
  var readRow = testSheet.getRange(2, 1, 1, 25).getValues()[0];
  var mismatchList = [];

  var expectedChecks = [
    { col: 'A (1)', header: 'Vacancy ID', value: readRow[0], expected: 'VAC-TEST-999' },
    { col: 'B (2)', header: 'Date Found', value: readRow[1], expected: formatDateYMD(new Date()) },
    { col: 'C (3)', header: 'Category', value: readRow[2], expected: 'Industrial Training' },
    { col: 'D (4)', header: 'Company Name', value: readRow[3], expected: 'Dummy Test Firm & Co' },
    { col: 'E (5)', header: 'Job Title', value: readRow[4], expected: 'Finance & Accounts Trainee' },
    { col: 'F (6)', header: 'Location', value: readRow[5], expected: 'Mumbai, Maharashtra' },
    { col: 'G (7)', header: 'Work Mode', value: readRow[6], expected: 'Hybrid' },
    { col: 'H (8)', header: 'Eligibility', value: readRow[7], expected: 'CA Inter Both Groups Cleared' },
    { col: 'I (9)', header: 'Stipend / Salary', value: readRow[8], expected: '₹25,000 / month' },
    { col: 'J (10)', header: 'Duration', value: readRow[9], expected: '12 Months' },
    { col: 'K (11)', header: 'Joining Details', value: readRow[10], expected: 'Immediate' },
    { col: 'L (12)', header: 'Application Deadline', value: readRow[11], expected: '15 Days Left' },
    { col: 'M (13)', header: 'Application Method', value: readRow[12], expected: 'email' },
    { col: 'N (14)', header: 'Application URL', value: readRow[13], expected: '' },
    { col: 'O (15)', header: 'Contact Details', value: readRow[14], expected: 'careers@dummytestfirm.com' },
    { col: 'P (16)', header: 'Original Source URL', value: readRow[15], expected: 'https://dummytestfirm.com/careers/trainee-2026' },
    { col: 'Q (17)', header: 'Verification Status', value: readRow[16], expected: 'Pending Verification' },
    { col: 'R (18)', header: 'Duplicate Check', value: readRow[17], expected: 'Needs Review' },
    { col: 'S (19)', header: 'Approval Status', value: readRow[18], expected: 'Pending Approval' },
    { col: 'T (20)', header: 'Publish Status', value: readRow[19], expected: 'Unpublished' },
    { col: 'U (21)', header: 'Remarks', value: readRow[20], expected: 'Test dummy import record for column mapping verification' },
    { col: 'V (22)', header: 'Source Name', value: readRow[21], expected: 'Company Career Page' },
    { col: 'W (23)', header: 'Source Checked Date', value: readRow[22], expected: formatDateYMD(new Date()) },
    { col: 'X (24)', header: 'Vacancy Type', value: readRow[23], expected: 'Full-Time Trainee' },
    { col: 'Y (25)', header: 'Research Report ID', value: readRow[24], expected: 'REP-TEST-001' }
  ];

  for (var k = 0; k < expectedChecks.length; k++) {
    var check = expectedChecks[k];
    if (String(check.value).trim() !== String(check.expected).trim()) {
      mismatchList.push(check.col + ' ' + check.header + ': Got "' + check.value + '", expected "' + check.expected + '"');
    }
  }

  if (mismatchList.length === 0) {
    ui.alert(
      'Test Passed: 25-Field Mapping Confirmed',
      '✓ Successfully tested in separate sheet "' + testSheetName + '" (Live Research Queue untouched).\n' +
      '✓ Exactly 25 columns verified in 1-to-1 correspondence with canonical headers:\n\n' +
      'Col A (1): Vacancy ID = VAC-TEST-999\n' +
      'Col B (2): Date Found = ' + formatDateYMD(new Date()) + '\n' +
      'Col C (3): Category = Industrial Training\n' +
      'Col D (4): Company Name = Dummy Test Firm & Co\n' +
      'Col E (5): Job Title = Finance & Accounts Trainee\n' +
      'Col F (6): Location = Mumbai, Maharashtra\n' +
      'Col G (7): Work Mode = Hybrid\n' +
      'Col H (8): Eligibility = CA Inter Both Groups Cleared\n' +
      'Col I (9): Stipend / Salary = ₹25,000 / month\n' +
      'Col J (10): Duration = 12 Months\n' +
      'Col K (11): Joining Details = Immediate\n' +
      'Col L (12): Application Deadline = 15 Days Left\n' +
      'Col M (13): Application Method = email\n' +
      'Col N (14): Application URL = (empty)\n' +
      'Col O (15): Contact Details = careers@dummytestfirm.com\n' +
      'Col P (16): Original Source URL = https://dummytestfirm.com/careers/trainee-2026\n' +
      'Col Q (17): Verification Status = Pending Verification\n' +
      'Col R (18): Duplicate Check = Needs Review\n' +
      'Col S (19): Approval Status = Pending Approval\n' +
      'Col T (20): Publish Status = Unpublished\n' +
      'Col U (21): Remarks = Test dummy import record...\n' +
      'Col V (22): Source Name = Company Career Page\n' +
      'Col W (23): Source Checked Date = ' + formatDateYMD(new Date()) + '\n' +
      'Col X (24): Vacancy Type = Full-Time Trainee\n' +
      'Col Y (25): Research Report ID = REP-TEST-001\n\n' +
      'Zero live vacancies were modified or published.',
      ui.ButtonSet.OK
    );
  } else {
    ui.alert(
      'Test Failed: Mapping Mismatches Detected',
      'Mismatches found in Test Queue:\n\n' + mismatchList.join('\n'),
      ui.ButtonSet.OK
    );
  }
}
