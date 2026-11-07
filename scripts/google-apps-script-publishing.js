/**
 * ============================================================================
 * CA DWAR — GOOGLE SHEETS TO WEBSITE PUBLISHING INTEGRATION
 * ============================================================================
 * Project: CA Dwar Automation
 * Spreadsheet: CA DWAR – Automation Control Centre
 * Sheet Tab: Research Queue
 * Target Website: https://cadwar.in
 * Endpoint: POST https://cadwar.in/api/automation/publish-job
 * ============================================================================
 */

// Configuration Constants
var CONFIG = {
  WEBSITE_URL: 'https://cadwar.in',
  PUBLISH_ENDPOINT: 'https://cadwar.in/api/automation/publish-job',
  SHEET_NAME: 'Research Queue',
  SCRIPT_PROPERTY_KEY: 'AUTOMATION_API_KEY'
};

/**
 * Automatically creates the 'CA Dwar' custom menu when the spreadsheet opens.
 * Preserves all existing menus, triggers, and onEdit approval protections.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CA Dwar')
    .addItem('Publish Approved Vacancies', 'publishApprovedVacancies')
    .addSeparator()
    .addItem('Check Automation API Connection', 'checkAutomationConnection')
    .addToUi();
}

/**
 * Main action: Reads Research Queue, filters strictly approved vacancies,
 * asks for manual confirmation, and securely publishes to https://cadwar.in.
 */
function publishApprovedVacancies() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    ui.alert('Error', 'Sheet "' + CONFIG.SHEET_NAME + '" not found in this spreadsheet.', ui.ButtonSet.OK);
    return;
  }

  // 1. Check API Key in Script Properties
  var apiKey = PropertiesService.getScriptProperties().getProperty(CONFIG.SCRIPT_PROPERTY_KEY);
  if (!apiKey || apiKey.trim() === '') {
    ui.alert(
      'Missing Automation API Key',
      'AUTOMATION_API_KEY is not configured in Script Properties.\n\n' +
      'Please go to:\nExtensions → Apps Script → Project Settings (gear icon) → Script Properties\n' +
      'and add Property: AUTOMATION_API_KEY with your secret key.',
      ui.ButtonSet.OK
    );
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    ui.alert('No Data', 'The Research Queue has no vacancy rows to inspect.', ui.ButtonSet.OK);
    return;
  }

  // 2. Identify column indexes dynamically from Row 1
  var headers = data[0];
  var colMap = {};
  for (var c = 0; c < headers.length; c++) {
    var h = headers[c].toString().toLowerCase().trim();
    colMap[h] = c;
  }

  // Helper to resolve column index by partial match
  function findCol(keywords) {
    for (var k = 0; k < keywords.length; k++) {
      var key = keywords[k].toLowerCase();
      for (var header in colMap) {
        if (header === key || header.indexOf(key) !== -1) {
          return colMap[header];
        }
      }
    }
    return -1;
  }

  var colVacancyId = findCol(['vacancy id', 'vacancyid', 'job id', 'id']);
  var colTitle = findCol(['job title', 'title', 'role']);
  var colCompany = findCol(['company name', 'firm name', 'company']);
  var colCategory = findCol(['category']);
  var colLocation = findCol(['location', 'city']);
  var colWorkMode = findCol(['work mode', 'mode']);
  var colEligibility = findCol(['eligibility']);
  var colStipend = findCol(['stipend / salary', 'stipend', 'salary']);
  var colDeadline = findCol(['application deadline', 'deadline']);
  var colAppMethod = findCol(['application method', 'method']);
  var colAppUrl = findCol(['application url', 'apply link', 'url']);
  var colContact = findCol(['contact details', 'email', 'recruiter email']);
  var colSourceUrl = findCol(['original source url', 'source url']);
  var colDuration = findCol(['duration']);
  var colJoining = findCol(['joining details', 'joining']);
  var colRemarks = findCol(['remarks', 'description', 'notes']);

  var colVerification = findCol(['verification status', 'verification']);
  var colDuplicate = findCol(['duplicate check', 'duplicate']);
  var colApproval = findCol(['approval status', 'approval']);
  var colPublishStatus = findCol(['publish status', 'published status', 'published']);
  var colDatePublished = findCol(['date published', 'published date']);

  // Ensure output columns exist (Columns Z, AA, AB) without overwriting existing data
  var colWebsiteJobId = findCol(['website job id']);
  var colLiveUrl = findCol(['live website url', 'live url']);
  var colLastResponse = findCol(['last publish response', 'publish response']);

  var maxCol = sheet.getLastColumn();
  if (colWebsiteJobId === -1) {
    maxCol++;
    sheet.getRange(1, maxCol).setValue('Website Job ID').setFontWeight('bold');
    colWebsiteJobId = maxCol - 1;
  }
  if (colLiveUrl === -1) {
    maxCol++;
    sheet.getRange(1, maxCol).setValue('Live Website URL').setFontWeight('bold');
    colLiveUrl = maxCol - 1;
  }
  if (colLastResponse === -1) {
    maxCol++;
    sheet.getRange(1, maxCol).setValue('Last Publish Response').setFontWeight('bold');
    colLastResponse = maxCol - 1;
  }

  // 3. Scan and collect eligible rows
  var eligibleRows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    var vStatus = colVerification !== -1 ? row[colVerification].toString().trim() : '';
    var dCheck = colDuplicate !== -1 ? row[colDuplicate].toString().trim() : '';
    var aStatus = colApproval !== -1 ? row[colApproval].toString().trim() : '';
    var pStatus = colPublishStatus !== -1 ? row[colPublishStatus].toString().trim() : '';

    // STRICT APPROVAL SAFEGUARDS:
    // Only rows with Approval Status = Approved, Verification Status = Verified,
    // Duplicate Check = No Duplicate, and not already Published.
    if (
      aStatus === 'Approved' &&
      vStatus === 'Verified' &&
      dCheck === 'No Duplicate' &&
      pStatus !== 'Published'
    ) {
      eligibleRows.push({
        rowIndex: i + 1, // 1-based index for sheet
        vacancyId: colVacancyId !== -1 ? row[colVacancyId].toString().trim() : 'VAC-' + (i + 1),
        title: colTitle !== -1 ? row[colTitle].toString().trim() : '',
        companyName: colCompany !== -1 ? row[colCompany].toString().trim() : '',
        category: colCategory !== -1 ? row[colCategory].toString().trim() : 'Articleship',
        location: colLocation !== -1 ? row[colLocation].toString().trim() : 'Pan-India',
        workMode: colWorkMode !== -1 ? row[colWorkMode].toString().trim() : 'On-site',
        eligibility: colEligibility !== -1 ? row[colEligibility].toString().trim() : '',
        stipend: colStipend !== -1 ? row[colStipend].toString().trim() : '',
        deadline: colDeadline !== -1 ? row[colDeadline].toString().trim() : '15 days left',
        applicationMethod: colAppMethod !== -1 ? row[colAppMethod].toString().trim() : '',
        applicationUrl: colAppUrl !== -1 ? row[colAppUrl].toString().trim() : '',
        contactDetails: colContact !== -1 ? row[colContact].toString().trim() : '',
        sourceUrl: colSourceUrl !== -1 ? row[colSourceUrl].toString().trim() : '',
        duration: colDuration !== -1 ? row[colDuration].toString().trim() : '',
        joiningDetails: colJoining !== -1 ? row[colJoining].toString().trim() : '',
        remarks: colRemarks !== -1 ? row[colRemarks].toString().trim() : '',
        verificationStatus: vStatus,
        duplicateCheck: dCheck,
        approvalStatus: aStatus
      });
    }
  }

  // 4. If no eligible rows found
  if (eligibleRows.length === 0) {
    ui.alert(
      'No Vacancies Ready for Publishing',
      'No vacancies were found matching all required publishing criteria.\n\n' +
      'Every published vacancy must satisfy:\n' +
      '  ✓ Verification Status = Verified\n' +
      '  ✓ Duplicate Check = No Duplicate\n' +
      '  ✓ Approval Status = Approved\n' +
      '  ✓ Publish Status != Published\n\n' +
      'Please verify and approve vacancies manually in the Research Queue before publishing.',
      ui.ButtonSet.OK
    );
    return;
  }

  // 5. User Confirmation Dialog
  var confirmMsg = 'Found ' + eligibleRows.length + ' approved vacancy/vacancies ready to publish to CA Dwar:\n\n';
  for (var k = 0; k < Math.min(eligibleRows.length, 5); k++) {
    confirmMsg += '• [' + eligibleRows[k].vacancyId + '] ' + eligibleRows[k].companyName + ' — ' + eligibleRows[k].title + ' (' + eligibleRows[k].category + ')\n';
  }
  if (eligibleRows.length > 5) {
    confirmMsg += '... and ' + (eligibleRows.length - 5) + ' more.\n';
  }
  confirmMsg += '\nDo you want to proceed with publishing to https://cadwar.in?';

  var response = ui.alert('Confirm Publishing', confirmMsg, ui.ButtonSet.YES_NO);
  if (response !== ui.Button.YES) {
    return;
  }

  // 6. Send each eligible vacancy to the API
  var successCount = 0;
  var failCount = 0;
  var errorLog = [];

  for (var r = 0; r < eligibleRows.length; r++) {
    var item = eligibleRows[r];

    var payload = {
      vacancyId: item.vacancyId,
      jobTitle: item.title,
      companyName: item.companyName,
      category: item.category,
      location: item.location,
      workMode: item.workMode,
      eligibility: item.eligibility,
      stipend: item.stipend,
      applicationDeadline: item.deadline,
      applicationMethod: item.applicationMethod,
      applicationUrl: item.applicationUrl,
      contactDetails: item.contactDetails,
      originalSourceUrl: item.sourceUrl,
      duration: item.duration,
      joiningDetails: item.joiningDetails,
      remarks: item.remarks,
      verificationStatus: item.verificationStatus,
      duplicateCheck: item.duplicateCheck,
      approvalStatus: item.approvalStatus
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    try {
      var apiRes = UrlFetchApp.fetch(CONFIG.PUBLISH_ENDPOINT, options);
      var code = apiRes.getResponseCode();
      var resText = apiRes.getContentText();
      var json = {};
      try {
        json = JSON.parse(resText);
      } catch (e) {
        json = { success: false, message: resText };
      }

      if (code === 200 || code === 201) {
        successCount++;

        // Update Publish Status = Published
        if (colPublishStatus !== -1) {
          sheet.getRange(item.rowIndex, colPublishStatus + 1).setValue('Published');
        }
        // Update Date Published if column exists
        if (colDatePublished !== -1) {
          sheet.getRange(item.rowIndex, colDatePublished + 1).setValue(new Date());
        }
        // Update output columns
        sheet.getRange(item.rowIndex, colWebsiteJobId + 1).setValue(json.jobId || '');
        sheet.getRange(item.rowIndex, colLiveUrl + 1).setValue(json.liveUrl || '');
        var actionText = json.action === 'already_published' ? 'Already Published' : 'Published (' + new Date().toLocaleTimeString() + ')';
        sheet.getRange(item.rowIndex, colLastResponse + 1).setValue(actionText);

      } else {
        failCount++;
        var errMsg = json.message || ('HTTP ' + code);
        errorLog.push(item.vacancyId + ': ' + errMsg);
        sheet.getRange(item.rowIndex, colLastResponse + 1).setValue('Error: ' + errMsg);
        // Do NOT update Publish Status on failure
      }
    } catch (err) {
      failCount++;
      var netError = err.message || 'Network Timeout';
      errorLog.push(item.vacancyId + ': ' + netError);
      sheet.getRange(item.rowIndex, colLastResponse + 1).setValue('Error: ' + netError);
    }
  }

  // 7. Summary Notification
  var summary = 'Publishing Complete!\n\n' +
    '• Successfully Published: ' + successCount + '\n' +
    '• Failed: ' + failCount + '\n';

  if (failCount > 0) {
    summary += '\nErrors:\n' + errorLog.slice(0, 5).join('\n');
    if (errorLog.length > 5) summary += '\n... and ' + (errorLog.length - 5) + ' more.';
  }

  ui.alert('Publishing Summary', summary, ui.ButtonSet.OK);
}

/**
 * Diagnostic helper: Tests if the API key and server connection are active.
 */
function checkAutomationConnection() {
  var ui = SpreadsheetApp.getUi();
  var apiKey = PropertiesService.getScriptProperties().getProperty(CONFIG.SCRIPT_PROPERTY_KEY);

  if (!apiKey || apiKey.trim() === '') {
    ui.alert(
      'API Key Missing',
      'AUTOMATION_API_KEY is not set in Script Properties.\n\n' +
      'Go to: Extensions → Apps Script → Project Settings → Script Properties\n' +
      'and add AUTOMATION_API_KEY.',
      ui.ButtonSet.OK
    );
    return;
  }

  try {
    // Send a validation ping (intentionally empty payload to test API key authentication)
    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey
      },
      payload: JSON.stringify({}),
      muteHttpExceptions: true
    };

    var res = UrlFetchApp.fetch(CONFIG.PUBLISH_ENDPOINT, options);
    var code = res.getResponseCode();
    var text = res.getContentText();

    if (code === 401) {
      ui.alert('Connection Failed', 'Authentication Rejected (HTTP 401): The API Key in Script Properties does not match the server key.', ui.ButtonSet.OK);
    } else if (code === 500 && text.indexOf('AUTOMATION_API_KEY environment variable is missing') !== -1) {
      ui.alert('Server Setup Required', 'AUTOMATION_API_KEY is missing in Vercel environment variables. Please add it to your Vercel project settings.', ui.ButtonSet.OK);
    } else if (code === 400) {
      ui.alert('Connection Successful!', '✓ Connected to CA Dwar API.\n✓ API Key authentication passed successfully.\n\nYour Google Sheet is ready to publish approved vacancies.', ui.ButtonSet.OK);
    } else {
      ui.alert('Connection Status', 'Server responded with HTTP ' + code + ':\n' + text, ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Connection Error', 'Could not reach ' + CONFIG.PUBLISH_ENDPOINT + ':\n' + err.message, ui.ButtonSet.OK);
  }
}
