

TARGET_REPORT = `site/src/content/changelog--content/reports/2025-03-19_unclean-url-report_01.md`

const report_data_accumulator = {
    content: {
        summary: {
            total_files: 0
        },
        details: {
            quote_characters_at_start_of_value: []
        }
    }
}

const reportTemplateForUncleanURLs = ```markdown
## Summary
Total filePaths loaded for script request: ${report.content.summary.total_files}

## Details


### Files with quote characters found before start of url property:
${report.content.details.quote_characters_at_start_of_value.map(file => `[[${path.basename(file, '.md')}]]`).join('\n')}
   { for each file.url_property_with_detected_quotes_in_front_of_url}   
   ${file.property_key} + ": " + ${file.property_value} + "\n"
   { + "\n\n" }
{ end for each file.url_property_with_detected_quotes_in_front_of_url}

```
