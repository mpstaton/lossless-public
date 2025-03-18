const fs = require('fs');
const path = require('path');
const { processFilesForTargetScript } = require('./utils/processFilesForTargetScript.cjs');
const { getOpenGraphReportTemplate, noticeAndFixMissingPropertiesBeforeProcessingForScript } = require('./getReportingFormatForBuild.cjs');
const fetchOpenGraphData = require('./fetchOpenGraphData.cjs');

// =============================================================
// User Options
// Core configuration for the build orchestrator
// ===============================

const USER_OPTIONS = {
    // Directory containing markdown files to process
    TARGET_DIR: 'site/src/content/tooling/',

    // Days to wait before refetching OpenGraph data
    DAYS_SINCE_LAST_API_CALL: 30,

    // Properties required to fetch OpenGraph data
    MUST_HAVE_ONE_OF_THESE_PROPERTIES: ['url', 'site_url'],

    LIST_OF_RETRYABLE_ERROR_STRINGS: 
      ['timeout', 'rate limit'],

    // File to write the processing report to
    REPORT_FILE: 'site/src/content/data/reports/open-graph-fetch-report.md',

    // Safety options
    SAFETY_OPTIONS: {
        DRY_RUN: process.env.DRY_RUN === 'true',
        VERBOSE: process.env.VERBOSE === 'true'
    }
};

// =============================================================
// Main Processing Function
// Handles the creation or update of OpenGraph data
// ===============================

async function createOrUpdateOpenGraphData() {
    if (USER_OPTIONS.SAFETY_OPTIONS.VERBOSE) {
        console.log('Processing files with options:', {
            targetDir: USER_OPTIONS.TARGET_DIR,
            dryRun: USER_OPTIONS.SAFETY_OPTIONS.DRY_RUN,
            verbose: USER_OPTIONS.SAFETY_OPTIONS.VERBOSE,
            requiredProperties: USER_OPTIONS.MUST_HAVE_ONE_OF_THESE_PROPERTIES
        });
    }

    const results = await processFilesForTargetScript({
        targetDir: USER_OPTIONS.TARGET_DIR,
        runConditions: {
            hasNoLastFetch: (frontmatter) => !frontmatter.og_last_fetch,
            hasEmptyLastFetch: (frontmatter) => frontmatter.og_last_fetch === '',
            isStale: (frontmatter) => {
                if (!frontmatter.og_last_fetch) return false;
                const lastFetch = new Date(frontmatter.og_last_fetch);
                const daysSinceLastFetch = (new Date() - lastFetch) / (1000 * 60 * 60 * 24);
                return daysSinceLastFetch > USER_OPTIONS.DAYS_SINCE_LAST_API_CALL;
            },
            hasUrlChanged: (frontmatter) => {
                if (!frontmatter.og_fetched_url) return false;
                const currentUrl = frontmatter.url || frontmatter.site_url;
                return currentUrl !== frontmatter.og_fetched_url;
            },
            hasRetryableError: (frontmatter) => {
                if (!frontmatter.og_error_message) return false;
                return USER_OPTIONS.LIST_OF_RETRYABLE_ERROR_STRINGS.some(
                    errorString => frontmatter.og_error_message.toLowerCase().includes(errorString)
                );
            }
        },
        processFunction: fetchOpenGraphData.getFromOpenGraphIo,
        dryRun: USER_OPTIONS.SAFETY_OPTIONS.DRY_RUN,
        verbose: USER_OPTIONS.SAFETY_OPTIONS.VERBOSE,
        userOptions: USER_OPTIONS
    }) || { 
        filesProcessed: 0,
        metadata: {
            noFrontmatter: [],
            noUuid: [],
            fixedWithFrontmatter: [],
            fixedWithUuid: [],
            couldNotLoad: [],
            readyToProcess: [],
            noUrlOrSiteUrl: []
        }
    };

    // Generate report
    const today = new Date().toISOString().split('T')[0];
    const openGraphReport = getOpenGraphReportTemplate({
        reportName: 'OpenGraph Data Update Report',
        today,
        filesProcessed: results.filesProcessed || 0,
        namesOfFilesForFirstFetch: results.metadata?.firstFetch || [],
        namesOfFilesMeetingRunConditions: results.metadata?.runConditionMet || [],
        namesOfFilesThatSucceeded: results.metadata?.succeeded || [],
        namesOfFilesReceivingErrors: results.metadata?.failed || [],
        namesOfFilesForFirstFetchAndSucceeded: (results.metadata?.firstFetch || [])
            .filter(file => results.metadata?.succeeded?.includes(file)) || [],
        namesOfFilesMeetingRunConditionsThatSucceeded: (results.metadata?.runConditionMet || [])
            .filter(file => results.metadata?.succeeded?.includes(file)) || [],
        namesOfFilesThatCouldNotBeProcessed: results.metadata?.couldNotLoad || []
    });

    // Get processing report
    const processingReport = noticeAndFixMissingPropertiesBeforeProcessingForScript({
        reportName: 'File Processing Report',
        today,
        numberOfFilePathsLoadedForScriptRequest: results.filesProcessed || 0,
        namesOfFilesObservedWithNoFrontmatter: results.metadata?.noFrontmatter || [],
        namesOfFilesObservedWithNoUUID: results.metadata?.noUuid || [],
        namesOfFilesWithNoUrlOrSiteUrl: results.metadata?.noUrlOrSiteUrl || [],
        numberOfFilesFixedWithFrontmatterAndUUID: results.metadata?.fixedWithFrontmatter?.length || 0,
        numberOfFilesFixedWithUUIDOnly: results.metadata?.fixedWithUuid?.length || 0,
        namesOfFilesThatCouldNotBeLoaded: results.metadata?.couldNotLoad || [],
        numberOfFilesFinallySentToProcess: results.metadata?.readyToProcess?.length || 0,
        namesOfFilesFixedWithFrontmatterAndUUID: results.metadata?.fixedWithFrontmatter || [],
        namesOfFilesFixedWithUUIDOnly: results.metadata?.fixedWithUuid || []
    });

    // Combine reports
    const combinedReport = `${openGraphReport}

---

${processingReport}`;

    try {
        // Ensure reports directory exists
        const reportsDir = path.dirname(USER_OPTIONS.REPORT_FILE);
        fs.mkdirSync(reportsDir, { recursive: true });

        // Write report
        fs.writeFileSync(USER_OPTIONS.REPORT_FILE, combinedReport);
        if (USER_OPTIONS.SAFETY_OPTIONS.VERBOSE) {
            console.log(`Report written to ${USER_OPTIONS.REPORT_FILE}`);
        }
    } catch (err) {
        if (USER_OPTIONS.SAFETY_OPTIONS.VERBOSE) {
            console.log(`Note: Could not write report to ${USER_OPTIONS.REPORT_FILE}: ${err.message}`);
        }
    }

    return results;
}

// =============================================================
// Execute if run directly
// ===============================

if (require.main === module) {
    createOrUpdateOpenGraphData().catch(console.error);
}

module.exports = {
    createOrUpdateOpenGraphData,
    USER_OPTIONS
};