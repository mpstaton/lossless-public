import USER_OPTIONS from "site/scripts/build-scripts/getUserOptions.cjs"
import {knownErrorCases, helperFunctions, correctionFunctions} from "site/scripts/build-scripts/getKnownErrorsAndFixes.cjs"
import fs from "fs"

// ================================================
// Configuration by the user
// ================================================
const TARGET_FILES = {
  targetDir: "site/src/content/tooling/AI-Toolkit"
}

const REPORT_FILE = "site/scripts/data-or-content-generation/fixes-needed/errors-processing/Added-Quotes-Around-Errors.md"

// ================================================
// Setup by the user
// ================================================

const issueToAttemptToFix = knownErrorCases.unquotedErrorMessageProperty

const filesToCheck = fs.readdirSync(TARGET_FILES.targetDir)

let filesProcessed = 0
let namesOfFilesCorrected = []
let namesOfFilesWithIssue = []

// ================================================
// Process each file found in the target directory. 
// Extract the frontmatter with the helper function imported from getKnownErrorsAndFixes.cjs
// Test the frontmatter with the detectError function imported from getKnownErrorsAndFixes.cjs
// If the error is detected, count the file for reporting, then call the issueToAttemptToFix.correctionFunction
// If the correction function returns a success message, count the file for reporting, and add the file name to the namesOfFilesCorrected array


for (const markdownFile of filesToCheck) {
  const extractedFrontmatter = helperFunctions.extractFrontmatter(markdownFile)
  const issueDetected = issueToAttemptToFix.detectError.test(extractedFrontmatter)
  if (!extractedFrontmatter.success) {
    console.log(`Error extracting frontmatter from ${markdownFile}`)
    continue
  }
  const frontmatterString = extractedFrontmatter.frontmatterString

  
   

}

// ================================================
// Report the results in the Report File.
// The stats code here is copy pasted from the context file getReportingFormatForBuild.cjs
// The last section is a comma separated list of the files that were successfully corrected.
// The brackets syntax is used because Obsidian is the tool our team uses to manage Markdown files. It is an internal link syntax.
// ================================================
const reportTemplate = ```
## Summary of Completed Files Needing No Action
Files processed:
Files with issue: ${stats.yamlValid.beforeRun}/${processingStats.totalFound}
Successful corrections: ${stats.yamlValid.updatedThisRun}/${processingStats.totalFound}
### Files successfully corrected
${namesOfFilesCorrected.map(file => ` [[${file}]],`)}
```

fs.writeFileSync(REPORT_FILE, reportTemplate)
