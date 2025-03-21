---
title: "Create a Basic Changelog"  # Core purpose of this prompt
lede: 'Guidelines for creating and maintaining a structured changelog'  # Brief description
date_authored_initial_draft: 2025-03-17
date_authored_current_draft: 2025-03-18  # Updated today
date_authored_final_draft: null
date_first_published: null
date_last_updated: null
at_semantic_version: "0.0.0.1"
authors: Michael Staton
status: To-Do
augmented_with: 'Windsurf Cascade on Claude 3.5 Sonnet'  # Current AI system
category: "Documentation"  # Primary focus
tags:  # Key areas this prompt covers
- Documentation-Standards
- Version-Control
- Change-Management
- Content-Organization
---

# Purpose  # High-level goal
Establish consistent, informative changelog entries that document changes to code and content across the project.

## Directory Structure  # File organization
1. Code Changes:  # Technical modifications
   ```
   site/src/content/changelog--code/  # Root directory for code changes
   ├── YYYY-MM-DD_index.md  # Daily entries
   └── reports/  # Detailed technical reports
       └── YYYY-MM-DD_description_index.md
   ```

2. Content Changes:  # Documentation/content updates
   ```
   site/src/content/changelog--content/  # Root directory for content changes
   ├── YYYY-MM-DD_index.md  # Daily entries
   └── reports/  # Detailed content reports
       └── YYYY-MM-DD_description_index.md
   ```

## Entry Structure  # Required sections

### 1. Frontmatter  # Metadata section
```yaml
---
title: "Brief, descriptive title"  # What changed
date: YYYY-MM-DD  # When it changed
author: "Author Name"  # Who made the change
augmented_with: "Windsurf on Claude 3.5 Sonnet"  # Tools used
category: "Technical | Documentation | Content"  # Type of change
tags:  # Related topics
- Tag-One
- Tag-Two
---
```

### 2. Content Sections  # Main content structure
```markdown
# Summary  # Brief overview
One to two sentences describing the changes.

## Changes Made  # Specific modifications
- What was added, removed, or modified
- File paths and function names
- Breaking changes
- Dependencies affected

## Technical Details  # Implementation specifics
- How changes were implemented
- Configuration updates
- Performance considerations
- Security implications

## Integration Points  # System connections
- Related components
- Required updates
- Migration steps

## Documentation  # Supporting information
- Related documentation
- Usage examples
- API changes
```

## Writing Guidelines  # Style requirements

### 1. Specificity  # Be precise
- Use technical language  # Clear terminology
- Include version numbers  # For tracking
- Reference specific files  # For context
- Document function names  # For searching

### 2. Completeness  # Be thorough
- List all changes  # Nothing omitted
- Note additions/removals  # Track both
- Document deprecations  # Forward planning
- Include migration steps  # User guidance

### 3. Context  # Be informative
- Explain rationale  # Why changes made
- Document impact  # What affected
- Note alternatives  # What considered
- List dependencies  # What required

### 4. Organization  # Be structured
- Group related changes  # Logical sets
- Use consistent format  # Standard layout
- Follow section order  # Easy navigation
- Include all sections  # Complete entries

### 5. Integration  # Be connected
- Link related issues  # Cross-reference
- Reference other logs  # Build context
- Note dependencies  # System impact
- Document APIs  # Interface changes

## Example Entry  # Practical demonstration
```markdown
---
title: "Enhanced Build Script Performance"  # What improved
date: 2025-03-18  # When changed
author: "Michael Staton"  # Who changed
augmented_with: "Windsurf on Claude 3.5 Sonnet"  # Tools used
category: "Technical"  # Change type
tags:  # Related areas
- Build-Scripts
- Performance
- Optimization
---

# Summary
Optimized build script processing for large YAML files, reducing build time by 40%.

## Changes Made
- Implemented parallel processing for YAML validation
- Added caching for frequently accessed files
- Updated error handling for better reporting

## Technical Details
- New worker pool implementation
- LRU cache with 1000 entry limit
- Enhanced error aggregation system

## Integration Points
- Updated build pipeline configuration
- Modified CI/CD workflow
- Enhanced monitoring system

## Documentation
- Updated build documentation
- Added performance metrics
- Included migration guide
```