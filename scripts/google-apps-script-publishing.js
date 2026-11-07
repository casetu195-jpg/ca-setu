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
  WEBSITE_URL: 'https://www.cadwar.in',
  PUBLISH_ENDPOINT: 'https://www.cadwar.in/api/automation/publish-job',
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
 * Main action: Reads Research Queue, filters strictly approved vacancies,
 * validates genuine employer application destinations, asks for confirmation,
 * and securely publishes to https://www.cadwar.in.
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

  // 2. Strict 25 Canonical Column Order Validation (Columns A:Y)
  var CANONICAL_RESEARCH_HEADERS = [
    'Vacancy ID', 'Date Found', 'Category', 'Company Name', 'Job Title', 'Location',
    'Work Mode', 'Eligibility', 'Stipend / Salary', 'Duration', 'Joining Details',
    'Application Deadline', 'Application Method', 'Application URL', 'Contact Details',
    'Original Source URL', 'Verification Status', 'Duplicate Check', 'Approval Status',
    'Publish Status', 'Remarks', 'Source Name', 'Source Checked Date', 'Vacancy Type', 'Research Report ID'
  ];

  var headers = data[0];
  if (headers.length < 25) {
    ui.alert(
      'Structural Header Error',
      'Sheet "' + PUBLISHING_CONFIG.SHEET_NAME + '" has fewer than 25 columns (found ' + headers.length + ').\n\n' +
      'Publishing is blocked. Exactly 25 columns (A through Y) are required.',
      ui.ButtonSet.OK
    );
    return;
  }

  for (var i = 0; i < 25; i++) {
    var expectedH = CANONICAL_RESEARCH_HEADERS[i];
    var actualH = (headers[i] || '').toString().trim();
    if (actualH.toLowerCase() !== expectedH.toLowerCase()) {
      var colLetter = String.fromCharCode(65 + i);
      ui.alert(
        'Structural Header Error',
        'Column ' + colLetter + ' (Index ' + (i + 1) + ') mismatch in "' + PUBLISHING_CONFIG.SHEET_NAME + '":\n\n' +
        'Expected: "' + expectedH + '"\n' +
        'Found: "' + (actualH || '(blank)') + '"\n\n' +
        'Publishing is blocked to protect data integrity. Please ensure exact header names and column order before publishing.',
        ui.ButtonSet.OK
      );
      return;
    }
  }

  // Canonical column indexes (0-based)
  var colVacancyId = 0;
  var colDateFound = 1;
  var colCategory = 2;
  var colCompany = 3;
  var colTitle = 4;
  var colLocation = 5;
  var colWorkMode = 6;
  var colEligibility = 7;
  var colStipend = 8;
  var colDuration = 9;
  var colJoining = 10;
  var colDeadline = 11;
  var colAppMethod = 12;
  var colAppUrl = 13;
  var colContact = 14;
  var colSourceUrl = 15;
  var colVerification = 16;
  var colDuplicate = 17;
  var colApproval = 18;
  var colPublishStatus = 19;
  var colRemarks = 20;
  var colSourceName = 21;
  var colSourceCheckedDate = 22;
  var colVacancyType = 23;
  var colResearchReportId = 24;

  // Output columns placed at Z, AA, AB
  function findExactCol(name) {
    var target = name.toString().trim().toLowerCase();
    for (var idx = 0; idx < headers.length; idx++) {
      if (headers[idx] && headers[idx].toString().trim().toLowerCase() === target) {
        return idx;
      }
    }
    return -1;
  }

  var colWebsiteJobId = findExactCol('Website Job ID');
  var colLiveUrl = findExactCol('Live Website URL');
  var colLastResponse = findExactCol('Last Publish Response');
  var colDatePublished = findExactCol('Date Published');

  var lastCol = sheet.getLastColumn();
  if (colWebsiteJobId === -1) {
    lastCol++;
    sheet.getRange(1, lastCol).setValue('Website Job ID').setFontWeight('bold');
    colWebsiteJobId = lastCol - 1;
  }
  if (colLiveUrl === -1) {
    lastCol++;
    sheet.getRange(1, lastCol).setValue('Live Website URL').setFontWeight('bold');
    colLiveUrl = lastCol - 1;
  }
  if (colLastResponse === -1) {
    lastCol++;
    sheet.getRange(1, lastCol).setValue('Last Publish Response').setFontWeight('bold');
    colLastResponse = lastCol - 1;
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

  // 5. User Confirmation Dialog (Explicit count + single-vacancy warning)
  var confirmMsg = 'Found ' + eligibleRows.length + ' approved vacancy/vacancies ready to publish to CA Dwar:\n\n';
  for (var k = 0; k < Math.min(eligibleRows.length, 5); k++) {
    confirmMsg += '• [' + eligibleRows[k].vacancyId + '] ' + eligibleRows[k].companyName + ' — ' + eligibleRows[k].title + ' (' + (eligibleRows[k].category || 'Uncategorized') + ')\n';
  }
  if (eligibleRows.length > 5) {
    confirmMsg += '... and ' + (eligibleRows.length - 5) + ' more.\n';
  }
  confirmMsg += '\n⚠️ WARNING: This action will publish ALL ' + eligibleRows.length + ' approved vacancy/vacancies to the live website.\n' +
    'If you intended to test publishing with only ONE vacancy, click NO, set Approval Status to "Pending Approval" on all other rows, and run this again.\n\n' +
    'Do you want to proceed with publishing ' + eligibleRows.length + ' vacancy/vacancies to https://www.cadwar.in?';

  var response = ui.alert('Confirm Publishing (' + eligibleRows.length + ' Vacancies)', confirmMsg, ui.ButtonSet.YES_NO);
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
        'x-api-key': apiKey.trim()
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      followRedirects: false
    };

    try {
      var apiRes = UrlFetchApp.fetch(PUBLISHING_CONFIG.PUBLISH_ENDPOINT, options);
      var code = apiRes.getResponseCode();

      // If server returns a redirect (HTTP 301, 302, 307, 308), follow once safely
      if (code === 301 || code === 302 || code === 307 || code === 308) {
        var redHeaders = apiRes.getAllHeaders();
        var redirectLoc = redHeaders['Location'] || redHeaders['location'];
        if (redirectLoc) {
          apiRes = UrlFetchApp.fetch(redirectLoc, options);
          code = apiRes.getResponseCode();
        }
      }
      var resText = apiRes.getContentText();
      var json = {};
      try {
        json = JSON.parse(resText);
      } catch (e) {
        json = { success: false, message: resText };
      }

      // Requirement 4: Mark Published ONLY if HTTP response is successful AND json.success === true
      if ((code === 200 || code === 201) && json && json.success === true) {
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
        var errMsg = (json && json.message) || ('HTTP ' + code + (resText ? ': ' + resText : ''));
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
        'x-api-key': apiKey.trim()
      },
      payload: JSON.stringify({ action: 'ping' }),
      muteHttpExceptions: true,
      followRedirects: false
    };

    var res = UrlFetchApp.fetch(PUBLISHING_CONFIG.PUBLISH_ENDPOINT, options);
    var code = res.getResponseCode();

    // If server returns a redirect (HTTP 301, 302, 307, 308), follow once safely
    if (code === 301 || code === 302 || code === 307 || code === 308) {
      var redHeaders = res.getAllHeaders();
      var redirectLoc = redHeaders['Location'] || redHeaders['location'];
      if (redirectLoc) {
        res = UrlFetchApp.fetch(redirectLoc, options);
        code = res.getResponseCode();
      }
    }
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
