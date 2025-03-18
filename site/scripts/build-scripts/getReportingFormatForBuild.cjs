const fs = require('fs');
const path = require('path');


// ============================================================================
// Noticing files with no frontmatter or site_uuid property, 
// fixing it BEFORE trying to process for target script 
// ============================================================================


function noticeAndFixMissingPropertiesBeforeProcessingForScript(params) {
  const {
    reportName,
    today,
    numberOfFilePathsLoadedForScriptRequest,
    namesOfFilesObservedWithNoFrontmatter,
    namesOfFilesObservedWithNoUUID,
    numberOfFilesFixedWithFrontmatterAndUUID,
    numberOfFilesFixedWithUUIDOnly,
    namesOfFilesThatCouldNotBeLoaded,
    numberOfFilesFinallySentToProcess,
    namesOfFilesFixedWithFrontmatterAndUUID,
    namesOfFilesFixedWithUUIDOnly,
    namesOfFilesWithNoUrlOrSiteUrl
  } = params;

  // Create report object following content history data model
  const report = {
    metadata: {
      title: reportName,
      created_at: today,
      version: '1.0',
      status: 'completed'
    },
    content: {
      summary: {
        total_files: numberOfFilePathsLoadedForScriptRequest,
        files_with_no_frontmatter: namesOfFilesObservedWithNoFrontmatter.length,
        files_with_no_uuid: namesOfFilesObservedWithNoUUID.length,
        files_fixed_with_frontmatter_and_uuid: numberOfFilesFixedWithFrontmatterAndUUID,
        files_fixed_with_uuid_only: numberOfFilesFixedWithUUIDOnly,
        files_with_no_url_or_site_url: namesOfFilesWithNoUrlOrSiteUrl.length,
        files_that_could_not_load: namesOfFilesThatCouldNotBeLoaded.length,
        files_sent_to_process: numberOfFilesFinallySentToProcess
      },
      details: {
        no_frontmatter: namesOfFilesObservedWithNoFrontmatter,
        no_uuid: namesOfFilesObservedWithNoUUID,
        no_url_or_site_url: namesOfFilesWithNoUrlOrSiteUrl,
        could_not_load: namesOfFilesThatCouldNotBeLoaded,
        fixed_with_frontmatter_and_uuid: namesOfFilesFixedWithFrontmatterAndUUID,
        fixed_with_uuid_only: namesOfFilesFixedWithUUIDOnly
      }
    }
  };

  // Convert to markdown for display
  return `---
title: ${report.metadata.title}
date: ${report.metadata.created_at}
version: ${report.metadata.version}
status: ${report.metadata.status}
---
## Summary
Total filePaths loaded for script request: ${report.content.summary.total_files}
Number of files observed with no frontmatter: ${report.content.summary.files_with_no_frontmatter}
Number of files observed with no UUID: ${report.content.summary.files_with_no_uuid}
Number of files fixed with frontmatter and UUID: ${report.content.summary.files_fixed_with_frontmatter_and_uuid}
Number of files fixed with UUID only: ${report.content.summary.files_fixed_with_uuid_only}
Number of files that have no url or site_url property: ${report.content.summary.files_with_no_url_or_site_url}
Number of files that could not be loaded: ${report.content.summary.files_that_could_not_load}
Number of files finally sent to process: ${report.content.summary.files_sent_to_process}

## Details
### Files with No Frontmatter
${report.content.details.no_frontmatter.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}

### Files with No UUID
${report.content.details.no_uuid.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}

### Files with No URL or Site URL
${report.content.details.no_url_or_site_url.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}

### Files That Could Not Load
${report.content.details.could_not_load.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}

### Files Fixed with Frontmatter and UUID
${report.content.details.fixed_with_frontmatter_and_uuid.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}

### Files Fixed with UUID Only
${report.content.details.fixed_with_uuid_only.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}`;
}


// ============================================================================
// Single operation reporting section
// ============================================================================

function getOpenGraphReportTemplate(params) {
  const {
    reportName,
    today,
    filesProcessed,
    namesOfFilesForFirstFetch,
    namesOfFilesMeetingRunConditions,
    namesOfFilesThatSucceeded,
    namesOfFilesReceivingErrors,
    namesOfFilesForFirstFetchAndSucceeded,
    namesOfFilesMeetingRunConditionsThatSucceeded,
    namesOfFilesThatCouldNotBeProcessed
  } = params;

  return `---
title: ${reportName}
date: ${today}
---
## Summary of Files Processed
Files checked: ${filesProcessed}
Files to do a first OpenGraph fetch: ${namesOfFilesForFirstFetch.length}
Files to update based on run condition: ${namesOfFilesMeetingRunConditions.length}
Successful API Calls : ${namesOfFilesThatSucceeded.length}
Unsuccessful API Calls : ${namesOfFilesReceivingErrors.length}

### New files that received there first OpenGraph properties in this run. 
${namesOfFilesForFirstFetchAndSucceeded.map(file => `[[${path.basename(file, '.md')}]]`).join(', ')}

### Files with updated OpenGraph properties. 
${namesOfFilesMeetingRunConditionsThatSucceeded.map(file => `[[${path.basename(file, '.md')}]]`).join(', ')}

### List of files that could not be processed at all.  
These could not have frontmatter, not have a UUID, whatever. 
${namesOfFilesThatCouldNotBeProcessed.map(file => `[[${path.basename(file, '.md')}]]`).join(', ')}

`;
}

module.exports = {
  getOpenGraphReportTemplate,
  noticeAndFixMissingPropertiesBeforeProcessingForScript
};
