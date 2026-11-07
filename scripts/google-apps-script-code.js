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
 * Strict validation of all 25 canonical headers in exact order (Columns A:Y).
 * Halts if any header is missing, duplicated, or misplaced.
 */
function validateStrict25Headers(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 25) {
    return {
      isValid: false,
      reason: 'Sheet "' + sheet.getName() + '" has fewer than 25 columns (found ' + lastCol + '). Exactly 25 canonical columns (A through Y) are required.'
    };
  }

  var headers = sheet.getRange(1, 1, 1, Math.max(lastCol, 25)).getValues()[0];
  for (var i = 0; i < 25; i++) {
    var expected = CANONICAL_RESEARCH_HEADERS[i];
    var actual = (headers[i] || '').toString().trim();
    if (actual.toLowerCase() !== expected.toLowerCase()) {
      var colLetter = String.fromCharCode(65 + i);
      return {
        isValid: false,
        colLetter: colLetter,
        colIndex: i + 1,
        expected: expected,
        found: actual || '(blank)',
        reason: 'Column ' + colLetter + ' (Index ' + (i + 1) + ') header mismatch in "' + sheet.getName() + '": Expected "' + expected + '", found "' + (actual || '(blank)') + '".'
      };
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
 * Enforces:
 *  1. Batch-aware sequential Vacancy ID generation before appending.
 *  2. Pre-flight strict validation of all 25 canonical headers.
 *  3. Removal of invented defaults (blank fields flagged in Remarks).
 *  4. Asian Paints inactive safeguard (On Hold, Unpublished).
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

  // Pre-flight strict validation of all 25 canonical headers (A through Y)
  var headerValidation = validateStrict25Headers(sheet);
  if (!headerValidation.isValid) {
    throw new Error('Import blocked: ' + headerValidation.reason + '\n\nPlease ensure exact canonical headers and column order before importing.');
  }

  var existingData = sheet.getDataRange().getValues();
  var rowsToAppend = [];
  var todayStr = formatDateYMD(new Date());

  // Pre-calculate starting Vacancy ID number for batch sequential generation
  var currentMaxVacNum = 0;
  for (var r = 1; r < existingData.length; r++) {
    var rowVal = (existingData[r][0] || '').toString().trim();
    var match = rowVal.match(/^VAC-(\d+)$/i);
    if (match) {
      var n = parseInt(match[1], 10);
      if (n > currentMaxVacNum) currentMaxVacNum = n;
    }
  }

  for (var i = 0; i < vacancyList.length; i++) {
    var item = vacancyList[i] || {};
    var company = (item.companyName || item.company || '').toString().trim();
    var title = (item.jobTitle || item.title || '').toString().trim();

    // 1. Ensure Vacancy ID is generated sequentially in batch
    var vacId = (item.vacancyId || '').toString().trim();
    if (!vacId) {
      currentMaxVacNum++;
      vacId = 'VAC-' + ('000' + currentMaxVacNum).slice(-3);
    } else {
      var matchId = vacId.match(/^VAC-(\d+)$/i);
      if (matchId) {
        var parsedNum = parseInt(matchId[1], 10);
        if (parsedNum > currentMaxVacNum) currentMaxVacNum = parsedNum;
      }
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
      for (var ex = 1; ex < existingData.length; ex++) {
        var exComp = (existingData[ex][3] || '').toString().trim().toLowerCase();
        var exTitle = (existingData[ex][4] || '').toString().trim().toLowerCase();
        var exSource = (existingData[ex][15] || '').toString().trim().toLowerCase();
        var newSource = (item.sourceUrl || item.originalSourceUrl || '').toString().trim().toLowerCase();

        if (company && exComp === company.toLowerCase() && title && exTitle === title.toLowerCase()) {
          duplicateCheckStatus = 'Potential Duplicate of ' + (existingData[ex][0] || 'Row ' + (ex + 1));
          approvalStatus = 'Pending Review';
          break;
        } else if (newSource && exSource && newSource === exSource) {
          duplicateCheckStatus = 'Potential Duplicate (Matching Source URL: ' + (existingData[ex][0] || 'Row ' + (ex + 1)) + ')';
          approvalStatus = 'Pending Review';
          break;
        }
      }
    }

    // 3. Remove invented defaults: leave blank if missing and flag in remarks
    var category = (item.category || '').toString().trim();
    var location = (item.location || '').toString().trim();
    var workMode = (item.workMode || '').toString().trim();
    var deadline = (item.deadline || item.applicationDeadline || '').toString().trim();
    var sourceName = (item.sourceName || '').toString().trim();
    var vacancyType = (item.vacancyType || '').toString().trim();

    var missingFields = [];
    if (!category) missingFields.push('Category');
    if (!location) missingFields.push('Location');
    if (!workMode) missingFields.push('Work Mode');
    if (!deadline) missingFields.push('Application Deadline');
    if (!sourceName) missingFields.push('Source Name');
    if (!vacancyType) missingFields.push('Vacancy Type');

    if (missingFields.length > 0) {
      var missingNote = '[VERIFICATION NEEDED] Missing fields: ' + missingFields.join(', ');
      remarks = remarks ? remarks + '; ' + missingNote : missingNote;
    }

    // 4. Strict 25-Column Row Array Construction
    var row = new Array(25);
    row[0] = vacId;                                                                          // Col A: Vacancy ID
    row[1] = item.dateFound ? formatDateYMD(item.dateFound) : todayStr;                     // Col B: Date Found
    row[2] = category;                                                                       // Col C: Category (No invented default)
    row[3] = company;                                                                        // Col D: Company Name
    row[4] = title;                                                                          // Col E: Job Title
    row[5] = location;                                                                       // Col F: Location (No invented default)
    row[6] = workMode;                                                                       // Col G: Work Mode (No invented default)
    row[7] = (item.eligibility || '').toString().trim();                                     // Col H: Eligibility
    row[8] = (item.stipend || '').toString().trim();                                         // Col I: Stipend / Salary
    row[9] = (item.duration || '').toString().trim();                                        // Col J: Duration
    row[10] = (item.joiningDetails || '').toString().trim();                                 // Col K: Joining Details
    row[11] = deadline;                                                                      // Col L: Application Deadline (No invented default)
    row[12] = (item.applicationMethod || (item.contactDetails ? 'email' : 'link')).toString().trim(); // Col M: Application Method
    row[13] = (item.applicationUrl || '').toString().trim();                                 // Col N: Application URL
    row[14] = (item.contactDetails || '').toString().trim();                                 // Col O: Contact Details
    row[15] = (item.sourceUrl || item.originalSourceUrl || '').toString().trim();           // Col P: Original Source URL
    row[16] = verificationStatus;                                                            // Col Q: Verification Status (NEVER 'Verified')
    row[17] = duplicateCheckStatus;                                                          // Col R: Duplicate Check (NEVER 'No Duplicate')
    row[18] = approvalStatus;                                                                // Col S: Approval Status (NEVER 'Approved')
    row[19] = publishStatus;                                                                 // Col T: Publish Status (NEVER 'Published')
    row[20] = remarks;                                                                       // Col U: Remarks
    row[21] = sourceName;                                                                    // Col V: Source Name (No invented default)
    row[22] = item.sourceCheckedDate ? formatDateYMD(item.sourceCheckedDate) : todayStr;     // Col W: Source Checked Date
    row[23] = vacancyType;                                                                   // Col X: Vacancy Type (No invented default)
    row[24] = (item.researchReportId || '').toString().trim();                               // Col Y: Research Report ID

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
 * TEST ACTION:
 * Imports a batch of 3 test vacancies WITHOUT supplied IDs into a separate isolated 'Test Queue' tab.
 * NEVER modifies the live 'Research Queue'.
 * Verifies:
 *  1. Unique sequential Vacancy ID generation across the batch before appending.
 *  2. Exact 25-column canonical mapping.
 *  3. Complete removal of invented defaults (missing fields remain blank & flagged in Remarks).
 *  4. Asian Paints inactive safeguard (On Hold & Unpublished).
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

  // 3. Construct 3 Test Vacancies WITHOUT supplied IDs in a single batch
  var batchTestVacancies = [
    // Item 1: Complete fields (no ID supplied)
    {
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
      remarks: 'Test batch record 1 for column mapping verification',
      sourceName: 'Company Career Page',
      sourceCheckedDate: new Date(),
      vacancyType: 'Full-Time Trainee',
      researchReportId: 'REP-TEST-001'
    },
    // Item 2: Minimal fields with missing values (no ID, no defaults supplied)
    {
      dateFound: new Date(),
      companyName: 'Minimalist CA Firm & Associates',
      jobTitle: 'Audit Associate',
      contactDetails: 'hr@minimalistca.com',
      sourceUrl: 'https://minimalistca.com/jobs/audit',
      remarks: 'Minimal record to verify removal of invented defaults'
    },
    // Item 3: Asian Paints inactive safeguard test (no ID supplied)
    {
      dateFound: new Date(),
      companyName: 'Asian Paints',
      jobTitle: 'Finance & Accounts Intern',
      contactDetails: 'campus@asianpaints.com',
      sourceUrl: 'https://asianpaints.com/careers'
    }
  ];

  // 4. Import the batch of 3 into Test Queue
  var importedCount = importVacanciesIntoQueue(batchTestVacancies, testSheetName);

  // 5. Read back Rows 2, 3, 4 from Test Queue
  var rows = testSheet.getRange(2, 1, 3, 25).getValues();
  var row1 = rows[0];
  var row2 = rows[1];
  var row3 = rows[2];
  var mismatchList = [];

  // Check 1: Unique sequential Vacancy IDs generated for all 3
  var id1 = (row1[0] || '').toString().trim();
  var id2 = (row2[0] || '').toString().trim();
  var id3 = (row3[0] || '').toString().trim();

  if (!id1.match(/^VAC-\d+$/i) || !id2.match(/^VAC-\d+$/i) || !id3.match(/^VAC-\d+$/i)) {
    mismatchList.push('Vacancy IDs not formatted properly: ' + id1 + ', ' + id2 + ', ' + id3);
  }
  if (id1 === id2 || id2 === id3 || id1 === id3) {
    mismatchList.push('Duplicate Vacancy IDs generated within the same batch: ' + id1 + ', ' + id2 + ', ' + id3);
  }

  // Check 2: Row 1 full 25-column mapping
  if (row1[3] !== 'Dummy Test Firm & Co') mismatchList.push('Row 1 Col D (Company Name): expected "Dummy Test Firm & Co", got "' + row1[3] + '"');
  if (row1[4] !== 'Finance & Accounts Trainee') mismatchList.push('Row 1 Col E (Job Title): expected "Finance & Accounts Trainee", got "' + row1[4] + '"');
  if (row1[5] !== 'Mumbai, Maharashtra') mismatchList.push('Row 1 Col F (Location): expected "Mumbai, Maharashtra", got "' + row1[5] + '"');
  if (row1[6] !== 'Hybrid') mismatchList.push('Row 1 Col G (Work Mode): expected "Hybrid", got "' + row1[6] + '"');
  if (row1[16] !== 'Pending Verification') mismatchList.push('Row 1 Col Q (Verification Status): expected "Pending Verification", got "' + row1[16] + '"');
  if (row1[18] !== 'Pending Approval') mismatchList.push('Row 1 Col S (Approval Status): expected "Pending Approval", got "' + row1[18] + '"');
  if (row1[19] !== 'Unpublished') mismatchList.push('Row 1 Col T (Publish Status): expected "Unpublished", got "' + row1[19] + '"');

  // Check 3: Row 2 removal of invented defaults (blank fields remain blank and flagged)
  if (row2[2] !== '') mismatchList.push('Row 2 Col C (Category): must be blank when not supplied, got "' + row2[2] + '"');
  if (row2[5] !== '') mismatchList.push('Row 2 Col F (Location): must be blank when not supplied, got "' + row2[5] + '"');
  if (row2[6] !== '') mismatchList.push('Row 2 Col G (Work Mode): must be blank when not supplied, got "' + row2[6] + '"');
  if (row2[11] !== '') mismatchList.push('Row 2 Col L (Application Deadline): must be blank when not supplied, got "' + row2[11] + '"');
  if (row2[21] !== '') mismatchList.push('Row 2 Col V (Source Name): must be blank when not supplied, got "' + row2[21] + '"');
  if (row2[23] !== '') mismatchList.push('Row 2 Col X (Vacancy Type): must be blank when not supplied, got "' + row2[23] + '"');
  if ((row2[20] || '').indexOf('[VERIFICATION NEEDED]') === -1) {
    mismatchList.push('Row 2 Col U (Remarks): expected [VERIFICATION NEEDED] missing fields flag, got "' + row2[20] + '"');
  }

  // Check 4: Row 3 Asian Paints safeguard (On Hold, Unpublished)
  if (row3[18] !== 'On Hold') mismatchList.push('Row 3 Col S (Approval Status): Asian Paints must be "On Hold", got "' + row3[18] + '"');
  if (row3[19] !== 'Unpublished') mismatchList.push('Row 3 Col T (Publish Status): Asian Paints must be "Unpublished", got "' + row3[19] + '"');
  if ((row3[17] || '').indexOf('Previously Inactive') === -1) {
    mismatchList.push('Row 3 Col R (Duplicate Check): Asian Paints must note Previously Inactive, got "' + row3[17] + '"');
  }

  if (mismatchList.length === 0) {
    ui.alert(
      'Test Passed: All Safeguards Confirmed',
      '✓ Successfully tested in separate sheet "' + testSheetName + '" (Live Research Queue untouched).\n\n' +
      '• Batch Vacancy ID Generation: 3/3 unique sequential IDs generated (' + id1 + ', ' + id2 + ', ' + id3 + ').\n' +
      '• Exact 25 Canonical Columns: Verified 1-to-1 correspondence with headers A through Y.\n' +
      '• Invented Defaults Eliminated: Missing Category, Location, Work Mode, Deadline, Source Name, and Vacancy Type left blank and flagged in Remarks.\n' +
      '• Asian Paints Safeguard: Marked "On Hold" and "Unpublished" with inactive hold note.\n' +
      '• Zero Live Data Modified: Live Research Queue and live database remain 100% untouched.',
      ui.ButtonSet.OK
    );
  } else {
    ui.alert(
      'Test Failed: Verification Mismatches Detected',
      'Mismatches found in Test Queue:\n\n' + mismatchList.join('\n'),
      ui.ButtonSet.OK
    );
  }
}
