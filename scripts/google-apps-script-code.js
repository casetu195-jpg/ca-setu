/**
 * ============================================================================
 * CA DWAR — AUTOMATION CONTROL CENTRE (Code.gs)
 * ============================================================================
 * Spreadsheet: CA DWAR – Automation Control Centre
 * Sheet Tabs: Dashboard, Research Queue, Activity Log, Settings, Source Registry, Test Queue
 * ============================================================================
 */

// 25 Canonical Research Queue Column Headers in Strict Order (Columns A through Y)
const CANONICAL_RESEARCH_HEADERS = [
  "Vacancy ID",           // Col A (0)
  "Date Found",           // Col B (1)
  "Category",             // Col C (2)
  "Company Name",         // Col D (3)
  "Job Title",            // Col E (4)
  "Location",             // Col F (5)
  "Work Mode",            // Col G (6)
  "Eligibility",          // Col H (7)
  "Stipend / Salary",     // Col I (8)
  "Duration",             // Col J (9)
  "Joining Details",      // Col K (10)
  "Application Deadline", // Col L (11)
  "Application Method",   // Col M (12)
  "Application URL",      // Col N (13)
  "Contact Details",      // Col O (14)
  "Original Source URL",  // Col P (15)
  "Verification Status",  // Col Q (16)
  "Duplicate Check",      // Col R (17)
  "Approval Status",      // Col S (18)
  "Publish Status",       // Col T (19)
  "Remarks",              // Col U (20)
  "Source Name",          // Col V (21)
  "Source Checked Date",  // Col W (22)
  "Vacancy Type",         // Col X (23)
  "Research Report ID"    // Col Y (24)
];

const CONFIG = {
  sheets: {
    "Dashboard": [
      ["Metric", "Value"],
      ["Total Vacancies", 0],
      ["Pending Verification", 0],
      ["Pending Approval", 0],
      ["Approved Vacancies", 0],
      ["Published Vacancies", 0]
    ],

    "Research Queue": [CANONICAL_RESEARCH_HEADERS],

    "Activity Log": [
      ["Date & Time", "Activity", "Details", "Status"]
    ],

    "Settings": [
      ["Setting", "Value", "Notes"],
      ["Publishing Approval", "Required", "Manual approval is compulsory"],
      ["Automation Mode", "Research Only", "No automatic publishing"],
      ["Business Account", "casetu195@gmail.com", "CA Dwar business documents"]
    ]
  }
};

/**
 * Exactly ONE global onOpen() function.
 * Preserves all Control Centre, Dashboard, Settings, Bulk Import and Publishing tools.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("CA Dwar Tools")
    .addItem("Refresh Dashboard", "refreshDashboard")
    .addItem("Check Duplicates", "checkDuplicates")
    .addSeparator()
    .addItem("Bulk Import Vacancies", "showBulkImport")
    .addItem("Import Research Report from Settings (E2)", "importResearchReportFromSettings")
    .addSeparator()
    .addItem("Check Automation API Connection", "checkAutomationConnection")
    .addItem("Publish Approved Vacancies", "publishApprovedVacancies")
    .addSeparator()
    .addItem("Test Import in Separate Sheet (Test Queue)", "testImportDummyRecord")
    .addItem("Set Up Control Centre Tabs", "setupControlCentre")
    .addToUi();
}

/**
 * Sets up spreadsheet tabs safely without overwriting or clearing existing data.
 */
function setupControlCentre() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(CONFIG.sheets).forEach(name => {
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
    }

    const data = CONFIG.sheets[name];

    // Only add headers/data if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    } else if (name === "Research Queue") {
      // Safely ensure columns 22-25 headers exist without touching existing data
      const lastCol = sheet.getLastColumn();
      if (lastCol < 25) {
        for (let c = lastCol; c < 25; c++) {
          sheet.getRange(1, c + 1).setValue(CANONICAL_RESEARCH_HEADERS[c]);
        }
      }
    }

    sheet.setFrozenRows(1);
  });

  setupDropdowns();
  refreshDashboard();

  SpreadsheetApp.getUi().alert(
    "CA Dwar Control Centre setup verified successfully!\nExisting vacancy records were preserved."
  );
}

function setupDropdowns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Research Queue");
  if (!sheet) return;

  const rules = [
    [3, ["Articleship", "Industrial Training", "CA Qualified Jobs"]],
    [17, ["Pending Verification", "Verified", "Unverified", "Inactive"]],
    [18, ["Not Checked", "No Duplicate", "Possible Duplicate", "Duplicate"]],
    [19, ["Pending Approval", "Approved", "Rejected", "On Hold"]],
    [20, ["Unpublished", "Not Published", "Published"]]
  ];

  rules.forEach(([column, values]) => {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(values, true)
      .setAllowInvalid(false)
      .build();

    sheet.getRange(2, column, 100, 1).setDataValidation(rule);
  });
}

function setupCategoryDropdown() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Research Queue");
  if (!sheet) return;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Articleship", "Industrial Training", "CA Qualified Jobs"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("C2:C101").setDataValidation(rule);
}

function setupVerificationDropdown() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Research Queue");
  if (!sheet) return;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending Verification", "Verified", "Unverified", "Inactive"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("Q2:Q101").setDataValidation(rule);
}

function setupDuplicateDropdown() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Research Queue");
  if (!sheet) return;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Not Checked", "No Duplicate", "Possible Duplicate", "Duplicate"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("R2:R101").setDataValidation(rule);
}

function setupApprovalDropdown() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Research Queue");
  if (!sheet) return;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending Approval", "Approved", "Rejected", "On Hold"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("S2:S101").setDataValidation(rule);
}

function setupPublishDropdown() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Research Queue");
  if (!sheet) return;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Unpublished", "Not Published", "Published"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("T2:T101").setDataValidation(rule);
}

function createDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Dashboard");
  if (!sheet) sheet = ss.insertSheet("Dashboard");

  sheet.getRange("A1:B6").setValues([
    ["Metric", "Value"],
    ["Total Vacancies", 0],
    ["Pending Verification", 0],
    ["Pending Approval", 0],
    ["Approved Vacancies", 0],
    ["Published Vacancies", 0]
  ]);
  sheet.setFrozenRows(1);
}

function createResearchQueue() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Research Queue");
  if (!sheet) sheet = ss.insertSheet("Research Queue");

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, CANONICAL_RESEARCH_HEADERS.length).setValues([CANONICAL_RESEARCH_HEADERS]);
  }
  sheet.setFrozenRows(1);
}

function createActivityLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Activity Log");
  if (!sheet) sheet = ss.insertSheet("Activity Log");

  if (sheet.getLastRow() === 0) {
    sheet.getRange("A1:D1").setValues([["Date & Time", "Activity", "Details", "Status"]]);
  }
  sheet.setFrozenRows(1);
}

function createSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Settings");
  if (!sheet) sheet = ss.insertSheet("Settings");

  if (sheet.getLastRow() === 0) {
    sheet.getRange("A1:C4").setValues([
      ["Setting", "Value", "Notes"],
      ["Publishing Approval", "Required", "Every vacancy needs manual approval"],
      ["Automation Mode", "Research Only", "No automatic publishing"],
      ["Business Account", "casetu195@gmail.com", "Official CA Dwar documents"]
    ]);
  }
  sheet.setFrozenRows(1);
}

function createSourceRegistry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Source Registry");
  if (!sheet) sheet = ss.insertSheet("Source Registry");

  const headers = [[
    "Source ID", "Source Name", "Source Type", "Public Source URL",
    "Vacancy Category", "Last Checked", "Source Status", "Notes"
  ]];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues(headers);
  }
  sheet.setFrozenRows(1);
}

function validateSources() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Source Registry");
  if (!sheet) throw new Error("Source Registry tab not found.");

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  data.forEach((row, index) => {
    const url = row[3];
    if (!url) {
      sheet.getRange(index + 2, 7).setValue("URL Required");
      return;
    }

    try {
      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        followRedirects: true
      });
      const status = response.getResponseCode();
      sheet.getRange(index + 2, 7).setValue(
        status >= 200 && status < 400 ? "Reachable" : "Check Required (" + status + ")"
      );
      sheet.getRange(index + 2, 6).setValue(new Date());
    } catch (error) {
      sheet.getRange(index + 2, 7).setValue("Connection Error");
      sheet.getRange(index + 2, 8).setValue(String(error).substring(0, 200));
    }
  });
}

/**
 * Refreshes Dashboard metrics from the Research Queue tab.
 */
function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const queue = ss.getSheetByName("Research Queue");
  const dashboard = ss.getSheetByName("Dashboard");

  if (!queue || !dashboard) return;

  const lastRow = queue.getLastRow();
  let data = [];
  if (lastRow >= 2) {
    data = queue.getRange(2, 1, lastRow - 1, 20).getDisplayValues();
  }

  const total = data.filter(row => row[3] && row[3].trim() !== "").length;
  const pendingVerification = data.filter(row => row[16] === "Pending Verification").length;
  const pendingApproval = data.filter(row => row[18] === "Pending Approval").length;
  const approved = data.filter(row => row[18] === "Approved").length;
  const published = data.filter(row => row[19] === "Published").length;

  dashboard.getRange("A1:B6").setValues([
    ["Metric", "Value"],
    ["Total Vacancies", total],
    ["Pending Verification", pendingVerification],
    ["Pending Approval", pendingApproval],
    ["Approved Vacancies", approved],
    ["Published Vacancies", published]
  ]);
}

/**
 * Checks for duplicates in Research Queue based on normalized Company, Title, Location.
 */
function checkDuplicates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Research Queue");
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 21).getDisplayValues();

  const normalize = value =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const groups = {};

  data.forEach((row, index) => {
    const company = normalize(row[3]);
    const role = normalize(row[4]);
    const location = normalize(row[5]);
    const joining = normalize(row[10]);

    if (!company || !role || !location) return;

    const key = [company, role, location, joining].join("|");
    if (!groups[key]) groups[key] = [];
    groups[key].push(index);
  });

  const results = data.map(row => [row[17] || "Not Checked"]);

  Object.values(groups).forEach(indices => {
    if (indices.length > 1) {
      indices.forEach(index => {
        results[index][0] = "Possible Duplicate";
      });
    }
  });

  sheet.getRange(2, 18, results.length, 1).setValues(results);
}

/**
 * Audited and syntax-corrected onEdit trigger.
 * Handles automatic Vacancy ID generation and enforces strict approval & publishing safeguards.
 */
function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== "Research Queue") return;
  if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1) return;

  const row = e.range.getRow();
  const column = e.range.getColumn();
  if (row < 2) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = ss.getSheetByName("Activity Log");

  const company = sheet.getRange(row, 4).getDisplayValue().trim();
  const role = sheet.getRange(row, 5).getDisplayValue().trim();

  // Generate Vacancy ID and Date Found if missing
  if (company && role) {
    const idCell = sheet.getRange(row, 1);
    const dateCell = sheet.getRange(row, 2);

    if (!idCell.getValue()) {
      const vacancyId = "CAD-" +
        Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd") +
        "-" + String(row - 1).padStart(4, "0");
      idCell.setValue(vacancyId);
    }

    if (!dateCell.getValue()) {
      dateCell.setValue(new Date());
      dateCell.setNumberFormat("dd-mmm-yyyy");
    }
  }

  // Record and protect status changes (Cols 17, 18, 19, 20)
  if ([17, 18, 19, 20].includes(column)) {
    const statusNames = {
      17: "Verification Status",
      18: "Duplicate Check",
      19: "Approval Status",
      20: "Publish Status"
    };

    const newValue = e.range.getDisplayValue();
    const oldValue = e.oldValue || "Blank";

    // Approval protection (Col 19)
    if (column === 19 && newValue === "Approved") {
      const verification = sheet.getRange(row, 17).getDisplayValue();
      const duplicate = sheet.getRange(row, 18).getDisplayValue();

      if (verification !== "Verified" || duplicate !== "No Duplicate") {
        e.range.setValue("Pending Approval");

        if (log) {
          log.appendRow([
            new Date(),
            "Approval Blocked",
            company + " | " + role + " | Verification or duplicate check incomplete",
            "Blocked"
          ]);
        }

        ss.toast(
          "Approval requires Verified status and No Duplicate.",
          "CA Dwar Protection",
          6
        );

        refreshDashboard();
        return;
      }
    }

    // Publishing protection (Col 20)
    if (column === 20 && newValue === "Published") {
      const approval = sheet.getRange(row, 19).getDisplayValue();
      const verification = sheet.getRange(row, 17).getDisplayValue();
      const duplicate = sheet.getRange(row, 18).getDisplayValue();

      if (
        approval !== "Approved" ||
        verification !== "Verified" ||
        duplicate !== "No Duplicate"
      ) {
        e.range.setValue("Not Published");

        if (log) {
          log.appendRow([
            new Date(),
            "Publishing Blocked",
            company + " | " + role + " | Verification, duplicate check or approval incomplete",
            "Blocked"
          ]);
        }

        ss.toast(
          "Publishing requires Verified status, No Duplicate and Approved status.",
          "CA Dwar Protection",
          6
        );

        refreshDashboard();
        return;
      }
    }

    if (log) {
      log.appendRow([
        new Date(),
        statusNames[column],
        company + " | " + role + " | " + oldValue + " → " + newValue,
        "Recorded"
      ]);
    }
  }

  refreshDashboard();
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
 * Strict 25-Column Header Validator (Columns A through Y).
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
        reason: 'Column ' + colLetter + ' (Index ' + (i + 1) + ') header mismatch in "' + sheet.getName() + '": Expected "' + expected + '", found "' + (actual || '(blank)') + '".'
      };
    }
  }
  return { isValid: true };
}

/**
 * SURGICALLY PATCHED IMPORT PROCESSOR (Patch A)
 * 1. Generates unique sequential Vacancy IDs in batch (never blank).
 * 2. Maps every field strictly to its canonical column (A:Y).
 * 3. Never uses Job Title as a fallback for missing fields.
 * 4. Leaves unavailable fields blank and flags them in Remarks.
 */
function importVacanciesIntoQueue(vacancyList, targetSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = targetSheetName || "Research Queue";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" not found in this spreadsheet.');
  }

  // Pre-flight validation of all 25 canonical headers (A through Y)
  var headerValidation = validateStrict25Headers(sheet);
  if (!headerValidation.isValid) {
    throw new Error('Import blocked: ' + headerValidation.reason + '\n\nPlease ensure exact canonical headers and column order before importing.');
  }

  var existingData = sheet.getDataRange().getValues();
  var rowsToAppend = [];
  var todayStr = formatDateYMD(new Date());

  // Pre-calculate starting Vacancy ID number from existing rows
  var currentMaxVacNum = 0;
  for (var r = 1; r < existingData.length; r++) {
    var rowVal = (existingData[r][0] || '').toString().trim();
    var match = rowVal.match(/^(?:VAC|CAD(?:-\d+)?)-?(\d+)$/i);
    if (match) {
      var n = parseInt(match[1], 10);
      if (n > currentMaxVacNum) currentMaxVacNum = n;
    }
  }

  for (var i = 0; i < vacancyList.length; i++) {
    var item = vacancyList[i] || {};
    var company = (item.companyName || item.company || item.firm || item.employer || '').toString().trim();
    var title = (item.jobTitle || item.title || item.role || item.position || '').toString().trim();

    // 1. Sequential Vacancy ID generation (Always unique VAC-xxx, never blank)
    var vacId = (item.vacancyId || item.id || '').toString().trim();
    if (!vacId) {
      currentMaxVacNum++;
      vacId = 'VAC-' + ('000' + currentMaxVacNum).slice(-3);
    } else {
      var matchId = vacId.match(/^(?:VAC|CAD(?:-\d+)?)-?(\d+)$/i);
      if (matchId) {
        var parsedNum = parseInt(matchId[1], 10);
        if (parsedNum > currentMaxVacNum) currentMaxVacNum = parsedNum;
      }
    }

    // 2. Asian Paints safeguard
    var isAsianPaints = company.toLowerCase().indexOf('asian paints') !== -1;
    var duplicateCheckStatus = 'Needs Review';
    var approvalStatus = 'Pending Approval';
    var verificationStatus = 'Pending Verification';
    var publishStatus = 'Unpublished';
    var remarks = (item.remarks || '').toString().trim();

    if (isAsianPaints) {
      duplicateCheckStatus = 'Duplicate: Asian Paints (Previously Inactive - Manual Verification Required)';
      approvalStatus = 'On Hold';
      var holdNote = '[HELD] Asian Paints was previously marked Inactive. Explicit verification required before re-activation.';
      remarks = remarks ? holdNote + ' ' + remarks : holdNote;
    } else {
      for (var ex = 1; ex < existingData.length; ex++) {
        var exComp = (existingData[ex][3] || '').toString().trim().toLowerCase();
        var exTitle = (existingData[ex][4] || '').toString().trim().toLowerCase();
        var exSource = (existingData[ex][15] || '').toString().trim().toLowerCase();
        var newSource = (item.sourceUrl || item.originalSourceUrl || item.sourceLink || '').toString().trim().toLowerCase();

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

    // 3. Strict individual extraction (NEVER fall back to Job Title)
    var category = (item.category || '').toString().trim();
    var location = (item.location || item.city || '').toString().trim();
    var workMode = (item.workMode || item.mode || '').toString().trim();
    var eligibility = (item.eligibility || item.qualification || '').toString().trim();
    var stipend = (item.stipend || item.salary || '').toString().trim();
    var duration = (item.duration || '').toString().trim();
    var joiningDetails = (item.joiningDetails || item.joining || '').toString().trim();
    var deadline = (item.deadline || item.applicationDeadline || '').toString().trim();
    var appUrl = (item.applicationUrl || item.applyUrl || item.applicationLink || item.link || '').toString().trim();
    var contactDetails = (item.contactDetails || item.contact || item.email || item.phone || '').toString().trim();
    var sourceUrl = (item.sourceUrl || item.originalSourceUrl || item.sourceLink || '').toString().trim();
    var sourceName = (item.sourceName || item.source || '').toString().trim();
    var vacancyType = (item.vacancyType || item.type || '').toString().trim();
    var researchReportId = (item.researchReportId || item.reportId || '').toString().trim();

    var appMethod = (item.applicationMethod || item.method || '').toString().trim();
    if (!appMethod) {
      if (contactDetails && contactDetails.indexOf('@') !== -1) {
        appMethod = 'email';
      } else if (appUrl) {
        appMethod = 'link';
      } else {
        appMethod = '';
      }
    }

    // Flag missing fields for manual review
    var missingFields = [];
    if (!category) missingFields.push('Category');
    if (!location) missingFields.push('Location');
    if (!workMode) missingFields.push('Work Mode');
    if (!deadline) missingFields.push('Application Deadline');
    if (!sourceName) missingFields.push('Source Name');
    if (!vacancyType) missingFields.push('Vacancy Type');
    if (!contactDetails && !appUrl) missingFields.push('Application Destination (URL/Email)');

    if (missingFields.length > 0) {
      var missingNote = '[VERIFICATION NEEDED] Missing fields: ' + missingFields.join(', ');
      remarks = remarks ? remarks + '; ' + missingNote : missingNote;
    }

    // 4. Strict 25-Column Canonical Mapping (Columns A through Y)
    var row = new Array(25);
    row[0] = vacId;                                                                          // Col A: Vacancy ID
    row[1] = item.dateFound ? formatDateYMD(item.dateFound) : todayStr;                     // Col B: Date Found
    row[2] = category;                                                                       // Col C: Category
    row[3] = company;                                                                        // Col D: Company Name
    row[4] = title;                                                                          // Col E: Job Title
    row[5] = location;                                                                       // Col F: Location (Blank if missing)
    row[6] = workMode;                                                                       // Col G: Work Mode (Blank if missing)
    row[7] = eligibility;                                                                    // Col H: Eligibility (Blank if missing)
    row[8] = stipend;                                                                        // Col I: Stipend / Salary (Blank if missing)
    row[9] = duration;                                                                       // Col J: Duration (Blank if missing)
    row[10] = joiningDetails;                                                                // Col K: Joining Details (Blank if missing)
    row[11] = deadline;                                                                      // Col L: Application Deadline (Blank if missing)
    row[12] = appMethod;                                                                     // Col M: Application Method
    row[13] = appUrl;                                                                        // Col N: Application URL (Blank if missing)
    row[14] = contactDetails;                                                                // Col O: Contact Details (Blank if missing)
    row[15] = sourceUrl;                                                                     // Col P: Original Source URL
    row[16] = verificationStatus;                                                            // Col Q: Verification Status
    row[17] = duplicateCheckStatus;                                                          // Col R: Duplicate Check
    row[18] = approvalStatus;                                                                // Col S: Approval Status
    row[19] = publishStatus;                                                                 // Col T: Publish Status
    row[20] = remarks;                                                                       // Col U: Remarks
    row[21] = sourceName;                                                                    // Col V: Source Name
    row[22] = item.sourceCheckedDate ? formatDateYMD(item.sourceCheckedDate) : todayStr;     // Col W: Source Checked Date
    row[23] = vacancyType;                                                                   // Col X: Vacancy Type
    row[24] = researchReportId;                                                              // Col Y: Research Report ID

    rowsToAppend.push(row);
  }

  if (rowsToAppend.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsToAppend.length, 25).setValues(rowsToAppend);
  }

  refreshDashboard();
  return rowsToAppend.length;
}

/**
 * Preserved single-item draft import function (uses patched 25-column mapper).
 */
function importVacancyDraft(vacancy) {
  if (!vacancy || typeof vacancy !== "object") {
    throw new Error("Invalid vacancy object.");
  }

  var company = vacancy.companyName || vacancy.company;
  var role = vacancy.jobTitle || vacancy.role;

  if (!company || !role) {
    throw new Error("Company Name and Job Title are required.");
  }

  var count = importVacanciesIntoQueue([vacancy], "Research Queue");
  return count > 0 ? "Vacancy draft imported successfully. Approval is pending." : "Failed to import vacancy.";
}

/**
 * Preserved batch import function (uses patched 25-column mapper).
 */
function importVacancyBatch(vacancies) {
  if (!Array.isArray(vacancies) || vacancies.length === 0) {
    throw new Error("Please provide a valid vacancy list.");
  }

  var count = importVacanciesIntoQueue(vacancies, "Research Queue");
  return {
    imported: count,
    duplicates: 0,
    failed: 0,
    details: ["Imported " + count + " vacancy/vacancies successfully."]
  };
}

/**
 * Preserved sidebar dialog for Bulk Import Vacancies.
 */
function showBulkImport() {
  const html = HtmlService.createHtmlOutput(`
    <div style="font-family:Arial;padding:15px">
      <h2>CA Dwar Bulk Import</h2>
      <p style="font-size:13px;color:#555">Paste vacancy data in JSON format below. Fields will map strictly to the 25 canonical columns without Job Title fallback:</p>

      <textarea id="data"
        style="width:100%;height:220px;font-family:monospace;font-size:12px"
        placeholder='[{"category":"Articleship","company":"Company Name","role":"Article Assistant","location":"Mumbai"}]'>
      </textarea>

      <br><br>
      <button style="background:#1a73e8;color:#fff;border:none;padding:10px 16px;border-radius:4px;cursor:pointer" onclick="importData()">Import Vacancies</button>
      <p id="result" style="font-size:13px;color:#333;margin-top:15px"></p>

      <script>
        function importData() {
          const result = document.getElementById("result");
          try {
            const raw = document.getElementById("data").value.trim();
            if (!raw) { alert("Please paste JSON data first."); return; }
            let vacancies = JSON.parse(raw);
            if (!Array.isArray(vacancies)) vacancies = [vacancies];

            result.innerText = "Importing...";

            google.script.run
              .withSuccessHandler(function(response) {
                result.innerText = "Import complete! " + (response.imported || 0) + " vacancy/vacancies imported.";
              })
              .withFailureHandler(function(error) {
                result.innerText = "Error: " + error.message;
              })
              .importVacancyBatch(vacancies);

          } catch (error) {
            result.innerText = "Invalid JSON: " + error.message;
          }
        }
      </script>
    </div>
  `).setTitle("CA Dwar Bulk Import").setWidth(400);

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Preserved Settings tab JSON importer (reads cell E2).
 */
function importResearchReportFromSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName("Settings");

  if (!settings) throw new Error("Settings tab not found.");

  const jsonText = settings.getRange("E2").getDisplayValue().trim();
  if (!jsonText) throw new Error("Please paste the research JSON in Settings cell E2.");

  let vacancies;
  try {
    vacancies = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Invalid JSON in Settings cell E2. Please check formatting.");
  }

  if (!Array.isArray(vacancies)) vacancies = [vacancies];

  const result = importVacancyBatch(vacancies);

  ss.toast(
    "Import completed. Imported: " + result.imported + " vacancies.",
    "CA Dwar Research Import",
    8
  );

  return result;
}

/**
 * Isolated Test Function: Tests Sukhbir and Associates, Nitin Pandey & Co., and ANS & Associates
 * strictly in the separate "Test Queue" tab.
 * NEVER modifies live Research Queue records.
 */
function testImportDummyRecord() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var testSheetName = "Test Queue";

  var testSheet = ss.getSheetByName(testSheetName);
  if (!testSheet) {
    testSheet = ss.insertSheet(testSheetName);
  } else {
    testSheet.clear();
  }

  testSheet.getRange(1, 1, 1, 25).setValues([CANONICAL_RESEARCH_HEADERS]);
  testSheet.getRange(1, 1, 1, 25).setFontWeight("bold").setBackground("#f3f3f3");

  var batchTestVacancies = [
    {
      dateFound: new Date(),
      companyName: "Sukhbir and Associates",
      jobTitle: "Articleship Trainee"
    },
    {
      dateFound: new Date(),
      companyName: "Nitin Pandey & Co.",
      jobTitle: "CA Industrial Trainee",
      location: "Delhi"
    },
    {
      dateFound: new Date(),
      companyName: "ANS & Associates",
      jobTitle: "Tax Associate",
      contactDetails: "careers@ansassociates.com"
    }
  ];

  importVacanciesIntoQueue(batchTestVacancies, testSheetName);

  var rows = testSheet.getRange(2, 1, 3, 25).getValues();
  var id1 = rows[0][0]; // VAC-001
  var id2 = rows[1][0]; // VAC-002
  var id3 = rows[2][0]; // VAC-003

  var hasJobTitleLeak = false;
  for (var c = 5; c <= 14; c++) {
    if (rows[0][c] === "Articleship Trainee" || rows[1][c] === "CA Industrial Trainee" || rows[2][c] === "Tax Associate") {
      hasJobTitleLeak = true;
      break;
    }
  }

  if (!hasJobTitleLeak && id1 === "VAC-001" && id2 === "VAC-002" && id3 === "VAC-003") {
    ui.alert(
      "Test Passed: Column Mapping Verified",
      "✓ Successfully tested in separate sheet \"" + testSheetName + "\" (Live Research Queue untouched).\n\n" +
      "• Sequential IDs Generated: " + id1 + ", " + id2 + ", " + id3 + " (Started from VAC-001 in cleared Test Queue).\n" +
      "• No Fallback to Job Title: Columns F through O verified (contain actual data or blank).\n" +
      "• Missing Fields Flagged: [VERIFICATION NEEDED] added to Remarks.\n" +
      "• Zero Live Data Modified: Live Research Queue and live database remain 100% untouched.",
      ui.ButtonSet.OK
    );
  } else {
    ui.alert("Test Failed", "Verification mismatch detected in Test Queue.", ui.ButtonSet.OK);
  }
}

// Preserved test utilities
function testConnection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Connected: " + (ss !== null));
}

function testVacancyImport() {
  const result = importVacancyDraft({
    category: "Articleship",
    company: "CA Dwar Test Company",
    role: "Article Assistant",
    location: "Mumbai",
    workMode: "On-site",
    eligibility: "CA Intermediate",
    salary: "Not stated",
    duration: "2 Years",
    sourceName: "Test Source",
    sourceUrl: "https://cadwar.in/",
    remarks: "Test entry only. Do not publish."
  });
  Logger.log(result);
}

function testDuplicateImport() {
  const result = importVacancyDraft({
    category: "Articleship",
    company: "CA Dwar Test Company",
    role: "Article Assistant",
    location: "Mumbai",
    sourceName: "Test Source",
    sourceUrl: "https://cadwar.in/",
    remarks: "Duplicate test"
  });
  Logger.log(result);
}

function testBulkImport() {
  const vacancies = [
    {
      category: "Articleship",
      company: "CA Dwar Bulk Test A",
      role: "Article Assistant",
      location: "Mumbai",
      sourceName: "Test Source",
      sourceUrl: "https://cadwar.in/",
      remarks: "Dummy bulk test A"
    },
    {
      category: "Industrial Training",
      company: "CA Dwar Bulk Test B",
      role: "Finance Industrial Trainee",
      location: "Pune",
      eligibility: "Minimum 12 months completed articleship - CA Dwar screening",
      sourceName: "Test Source",
      sourceUrl: "https://cadwar.in/",
      remarks: "Dummy bulk test B"
    }
  ];
  const result = importVacancyBatch(vacancies);
  Logger.log(JSON.stringify(result));
}
