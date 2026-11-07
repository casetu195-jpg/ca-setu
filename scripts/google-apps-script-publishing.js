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

// Configuration Constants for Vacancy Publishing Integration
var PUBLISHING_CONFIG = {
  WEBSITE_URL: 'https://cadwar.in',
  PUBLISH_ENDPOINT: 'https://cadwar.in/api/automation/publish-job',
  SHEET_NAME: 'Research Queue',
  SCRIPT_PROPERTY_KEY: 'AUTOMATION_API_KEY'
};

/**
 * Known third-party job aggregators, generic listing boards, and competing platforms.
 * Candidate Apply buttons must NEVER redirect to these platforms.
 */
var BLOCKED_AGGREGATOR_DOMAINS = [
  'caway.in',
  'naukri.com',
  'indeed.com',
  'indeed.co.in',
  'foundit.in',
  'monsterindia.com',
  'shine.com',
  'internshala.com',
  'freshersworld.com',
  'timesjobs.com',
  'instahyre.com',
  'hirist.com',
  'hirist.tech',
  'iimjobs.com',
  'glassdoor.com',
  'glassdoor.co.in',
  'simplyhired.com',
  'simplyhired.co.in',
  'jooble.org',
  'caclubindia.com',
  'casansaar.com',
  'taxguru.in',
  'cadwar.in',
  'unstop.com',
  'cutshort.io',
  'apna.co',
  'linkedin.com'
];

/**
 * URL shorteners and masking domains that obscure the true destination.
 */
var BLOCKED_SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'is.gd',
  'ow.ly',
  'rebrand.ly',
  'buff.ly'
];

/**
 * Supported Application Form platforms commonly used by employers.
 * Note: A recognized platform confirms the interface type, but manual verification
 * is required to confirm that the specific form was provided by the stated employer.
 */
var SUPPORTED_FORM_DOMAINS = [
  'forms.gle',
  'forms.office.com',
  'forms.microsoft.com',
  'typeform.com',
  'forms.zohopublic.com',
  'forms.zoho.com',
  'forms.zohopublic.in',
  'forms.zoho.in'
];

/**
 * Supported Enterprise Applicant Tracking Systems (ATS) used by employers.
 */
var SUPPORTED_ATS_DOMAINS = [
  'myworkdayjobs.com',
  'workday.com',
  'greenhouse.io',
  'lever.co',
  'smartrecruiters.com',
  'darwinbox.in',
  'darwinbox.com',
  'keka.com',
  'talentlyft.com',
  'recruitee.com',
  'bamboohr.com',
  'jobvite.com',
  'taleo.net',
  'successfactors.com',
  'successfactors.eu',
  'oraclecloud.com',
  'sap.com',
  'ashbyhq.com',
  'rippling.com',
  'freshteam.com',
  'workable.com',
  'icims.com',
  'zohorecruit.com',
  'zohorecruit.in'
];

/**
 * Safely parse a URL string and extract lowercase hostname and pathname.
 * Compatible with modern V8 runtime and fallback environments.
 */
function parseUrlDetails(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  var trimmed = urlStr.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  try {
    if (typeof URL !== 'undefined') {
      var parsed = new URL(trimmed);
      return {
        hostname: (parsed.hostname || '').toLowerCase(),
        pathname: parsed.pathname || '/',
        fullUrl: parsed.href
      };
    }
  } catch (e) {
    // Fallback to regex parser
  }

  var match = trimmed.match(/^https?:\/\/(?:[^:@\/\s]+(?::[^@\/\s]*)?@)?([^\/\?#:\s]+)(?::\d+)?(\/[^\?#\s]*)?/i);
  if (match) {
    return {
      hostname: (match[1] || '').toLowerCase(),
      pathname: match[2] || '/',
      fullUrl: trimmed
    };
  }
  return null;
}

/**
 * Check if a hostname matches a domain or any of its subdomains.
 */
function isHostMatchingDomain(hostname, targetDomain) {
  if (!hostname || !targetDomain) return false;
  var h = hostname.toLowerCase();
  var t = targetDomain.toLowerCase();
  return h === t || (h.length > t.length && h.slice(-t.length - 1) === '.' + t);
}

function isBlockedAggregator(hostname) {
  if (!hostname) return false;
  for (var i = 0; i < BLOCKED_AGGREGATOR_DOMAINS.length; i++) {
    if (isHostMatchingDomain(hostname, BLOCKED_AGGREGATOR_DOMAINS[i])) return true;
  }
  return false;
}

function isBlockedShortener(hostname) {
  if (!hostname) return false;
  for (var i = 0; i < BLOCKED_SHORTENER_DOMAINS.length; i++) {
    if (isHostMatchingDomain(hostname, BLOCKED_SHORTENER_DOMAINS[i])) return true;
  }
  return false;
}

function isSupportedApplicationPlatform(hostname, pathname) {
  if (!hostname) return false;
  if (isHostMatchingDomain(hostname, 'forms.gle')) return true;
  if (isHostMatchingDomain(hostname, 'docs.google.com') && (pathname || '').indexOf('/forms') === 0) return true;

  for (var i = 0; i < SUPPORTED_FORM_DOMAINS.length; i++) {
    if (isHostMatchingDomain(hostname, SUPPORTED_FORM_DOMAINS[i])) return true;
  }
  for (var j = 0; j < SUPPORTED_ATS_DOMAINS.length; j++) {
    if (isHostMatchingDomain(hostname, SUPPORTED_ATS_DOMAINS[j])) return true;
  }
  return false;
}

function doesHostMatchCompany(hostname, companyName) {
  if (!hostname || !companyName) return false;
  var cleanComp = companyName
    .toLowerCase()
    .replace(/\b(private|pvt|limited|ltd|llp|chartered|accountants|firm|and|co|company|corp|corporation|inc|india)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  var concatComp = cleanComp.replace(/\s+/g, '');
  if (concatComp.length >= 3 && hostname.indexOf(concatComp) !== -1) {
    return true;
  }

  var rawTokens = cleanComp.split(/\s+/);
  for (var i = 0; i < rawTokens.length; i++) {
    var tok = rawTokens[i];
    if (tok.length >= 3 && hostname.indexOf(tok) !== -1) {
      return true;
    }
  }

  return false;
}

function hasCareerSignals(hostname, pathname) {
  if (!hostname) return false;
  var hostParts = hostname.split('.');
  var subdomain = hostParts[0];
  var careerSubdomains = ['careers', 'career', 'jobs', 'job', 'talent', 'recruit', 'recruitment'];
  for (var i = 0; i < careerSubdomains.length; i++) {
    if (subdomain === careerSubdomains[i]) return true;
  }

  var p = (pathname || '').toLowerCase();
  var careerPaths = ['/careers', '/career', '/jobs', '/job/', '/openings', '/open-roles', '/vacancies', '/apply'];
  for (var j = 0; j < careerPaths.length; j++) {
    if (p.indexOf(careerPaths[j]) !== -1) return true;
  }
  return false;
}

/**
 * Comprehensive destination evaluation with strict hostname parsing.
 * Evaluates whether a destination URL is supported and appropriate for candidates.
 * Note: Automated checks verify platform type; human verification (Verification Status = Verified)
 * is strictly required to confirm that the specific form, portal, or recruiter email belongs to the employer.
 */
function evaluateApplicationDestination(urlStr, companyName) {
  var parsed = parseUrlDetails(urlStr);
  if (!parsed) {
    return {
      status: 'INVALID_URL',
      isAllowed: false,
      isSupported: false,
      reason: 'The provided application URL could not be parsed as a valid web address.'
    };
  }

  var hostname = parsed.hostname;
  var pathname = parsed.pathname;

  if (isBlockedAggregator(hostname)) {
    return {
      status: 'BLOCKED_AGGREGATOR',
      isAllowed: false,
      isSupported: false,
      hostname: hostname,
      reason: 'Application destination is a third-party aggregator (' + hostname + ').'
    };
  }

  if (isBlockedShortener(hostname)) {
    return {
      status: 'BLOCKED_SHORTENER',
      isAllowed: false,
      isSupported: false,
      hostname: hostname,
      reason: 'Application destination is a URL shortener (' + hostname + ').'
    };
  }

  if (isSupportedApplicationPlatform(hostname, pathname)) {
    return {
      status: 'SUPPORTED_PLATFORM',
      isAllowed: true,
      isSupported: true,
      hostname: hostname,
      reason: 'Supported application platform or official form provider.'
    };
  }

  if (doesHostMatchCompany(hostname, companyName || '')) {
    return {
      status: 'MATCHING_EMPLOYER_DOMAIN',
      isAllowed: true,
      isSupported: true,
      hostname: hostname,
      reason: 'Employer corporate domain matching the hiring entity name.'
    };
  }

  // Arbitrary external domain not matching company name and not a supported ATS/form
  return {
    status: 'UNVERIFIED_DESTINATION',
    isAllowed: false,
    isSupported: false,
    hostname: hostname,
    reason: 'Application destination (' + hostname + ') is an unverified external domain.'
  };
}

/**
 * Automatically creates the 'CA Dwar Tools' custom menu when the spreadsheet opens.
 * Preserves the existing Bulk Import Vacancies option alongside the new publishing integration.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CA Dwar Tools')
    .addItem('Bulk Import Vacancies', 'showBulkImport')
    .addSeparator()
    .addItem('Check Automation API Connection', 'checkAutomationConnection')
    .addItem('Publish Approved Vacancies', 'publishApprovedVacancies')
    .addToUi();
}

/**
 * Main action: Reads Research Queue, filters strictly approved vacancies,
 * validates genuine employer application destinations, asks for confirmation,
 * and securely publishes to https://cadwar.in.
 */
function publishApprovedVacancies() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PUBLISHING_CONFIG.SHEET_NAME);

  if (!sheet) {
    ui.alert('Error', 'Sheet "' + PUBLISHING_CONFIG.SHEET_NAME + '" not found in this spreadsheet.', ui.ButtonSet.OK);
    return;
  }

  // 1. Check API Key in Script Properties
  var apiKey = PropertiesService.getScriptProperties().getProperty(PUBLISHING_CONFIG.SCRIPT_PROPERTY_KEY);
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
    // NOTE: 'Verification Status = Verified' is the mandatory manual check confirming
    // that employer identity, application destination (Google Form, ATS, portal), and
    // recruiter contact details have been verified by the researcher/admin.
    if (
      aStatus === 'Approved' &&
      vStatus === 'Verified' &&
      dCheck === 'No Duplicate' &&
      pStatus !== 'Published'
    ) {
      var rawAppUrl = colAppUrl !== -1 ? row[colAppUrl].toString().trim() : '';
      var rawContact = colContact !== -1 ? row[colContact].toString().trim() : '';
      var rawCompName = colCompany !== -1 ? row[colCompany].toString().trim() : '';
      var rawSourceUrl = colSourceUrl !== -1 ? row[colSourceUrl].toString().trim() : '';
      var rawAppMethod = colAppMethod !== -1 ? row[colAppMethod].toString().trim() : '';

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var hasValidEmail = rawContact && emailRegex.test(rawContact);

      // SAFEGUARD 1: Strict Hostname Parsing & Destination Safeguards
      if (rawAppUrl) {
        var destEval = evaluateApplicationDestination(rawAppUrl, rawCompName);
        if (!destEval.isAllowed || !destEval.isSupported) {
          if (hasValidEmail) {
            // Fall back cleanly to the verified employer recruiter email and clear aggregator/unverified URL
            rawAppUrl = '';
            rawAppMethod = 'email';
          } else {
            // Keep unpublished and notify user in Last Publish Response
            var heldMsg = destEval.status === 'BLOCKED_AGGREGATOR'
              ? 'Held: Application URL is a third-party aggregator (' + destEval.hostname + '). Genuine employer destination or verified recruiter email required.'
              : 'Held: Application destination (' + (destEval.hostname || rawAppUrl) + ') is unverified. Hold for manual verification or provide verified recruiter email.';
            sheet.getRange(i + 1, colLastResponse + 1).setValue(heldMsg);
            continue;
          }
        }
      }

      // SAFEGUARD 2: If neither a direct employer application URL nor recruiter email exists, keep unpublished
      if (!rawAppUrl && !hasValidEmail) {
        sheet.getRange(i + 1, colLastResponse + 1).setValue('Held: No verified employer application URL or recruiter email available.');
        continue;
      }

      if (!rawAppUrl && hasValidEmail) {
        rawAppMethod = 'email';
      }

      eligibleRows.push({
        rowIndex: i + 1, // 1-based index for sheet
        vacancyId: colVacancyId !== -1 ? row[colVacancyId].toString().trim() : 'VAC-' + (i + 1),
        title: colTitle !== -1 ? row[colTitle].toString().trim() : '',
        companyName: rawCompName,
        category: colCategory !== -1 ? row[colCategory].toString().trim() : 'Articleship',
        location: colLocation !== -1 ? row[colLocation].toString().trim() : 'Pan-India',
        workMode: colWorkMode !== -1 ? row[colWorkMode].toString().trim() : 'On-site',
        eligibility: colEligibility !== -1 ? row[colEligibility].toString().trim() : '',
        stipend: colStipend !== -1 ? row[colStipend].toString().trim() : '',
        deadline: colDeadline !== -1 ? row[colDeadline].toString().trim() : '15 days left',
        applicationMethod: rawAppMethod,
        applicationUrl: rawAppUrl,
        contactDetails: rawContact,
        sourceUrl: rawSourceUrl,
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
      '  ✓ Verification Status = Verified (Employer identity, application destination, and recruiter contact verified)\n' +
      '  ✓ Duplicate Check = No Duplicate\n' +
      '  ✓ Approval Status = Approved\n' +
      '  ✓ Publish Status != Published\n' +
      '  ✓ Confirmed Employer Career Portal, Supported ATS Link, Confirmed Google Form, or Verified Recruiter Email\n\n' +
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
      var apiRes = UrlFetchApp.fetch(PUBLISHING_CONFIG.PUBLISH_ENDPOINT, options);
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
  var apiKey = PropertiesService.getScriptProperties().getProperty(PUBLISHING_CONFIG.SCRIPT_PROPERTY_KEY);

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
    // Send a dedicated diagnostic ping to test API key authentication reliably
    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey
      },
      payload: JSON.stringify({ action: 'ping' }),
      muteHttpExceptions: true
    };

    var res = UrlFetchApp.fetch(PUBLISHING_CONFIG.PUBLISH_ENDPOINT, options);
    var code = res.getResponseCode();
    var text = res.getContentText();
    var json = {};
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = {};
    }

    if (code === 200 && json.success === true) {
      ui.alert(
        'Connection Successful!',
        '✓ Connected to CA Dwar API.\n✓ API Key authentication verified successfully.\n\nYour Google Sheet is ready to publish approved vacancies.',
        ui.ButtonSet.OK
      );
    } else if (code === 401) {
      ui.alert(
        'Connection Failed',
        'Authentication Rejected (HTTP 401): The API Key in Script Properties does not match the server key.\n\nPlease verify AUTOMATION_API_KEY in Project Settings → Script Properties.',
        ui.ButtonSet.OK
      );
    } else if (code === 500 && text.indexOf('AUTOMATION_API_KEY environment variable is missing') !== -1) {
      ui.alert(
        'Server Setup Required',
        'AUTOMATION_API_KEY is missing in Vercel environment variables.\n\nPlease add AUTOMATION_API_KEY to your Vercel project settings.',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        'Connection Status',
        'Server responded with HTTP ' + code + ':\n' + (json.message || text),
        ui.ButtonSet.OK
      );
    }
  } catch (err) {
    ui.alert('Connection Error', 'Could not reach ' + PUBLISHING_CONFIG.PUBLISH_ENDPOINT + ':\n' + err.message, ui.ButtonSet.OK);
  }
}
