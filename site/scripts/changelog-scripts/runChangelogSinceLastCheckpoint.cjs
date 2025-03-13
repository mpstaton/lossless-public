const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration options (set only one of these)
const CONFIG = {
  FOR_TAG: null,           // e.g., 'v1.0.0' - get changes for specific tag
  FROM_DATE: null,         // e.g., '2024-03-01' - get changes since date
  BETWEEN_DATES: {         // get changes between two dates
    start: null,           // e.g., '2024-02-01'
    end: null             // e.g., '2024-03-01'
  },
  BETWEEN_COMMITS: {       // get changes between two commits
    start: null,          // e.g., 'abc123'
    end: null            // e.g., 'def456'
  }
};

const CHANGELOG_PATH = path.join(__dirname, '@changelog--code');

function getGitRange() {
  // Handle different range configurations
  if (CONFIG.FOR_TAG) {
    return `${CONFIG.FOR_TAG}^..${CONFIG.FOR_TAG}`;
  }
  if (CONFIG.FROM_DATE) {
    return `--since="${CONFIG.FROM_DATE}"`;
  }
  if (CONFIG.BETWEEN_DATES.start && CONFIG.BETWEEN_DATES.end) {
    return `--since="${CONFIG.BETWEEN_DATES.start}" --until="${CONFIG.BETWEEN_DATES.end}"`;
  }
  if (CONFIG.BETWEEN_COMMITS.start && CONFIG.BETWEEN_COMMITS.end) {
    return `${CONFIG.BETWEEN_COMMITS.start}..${CONFIG.BETWEEN_COMMITS.end}`;
  }
  
  // Default: changes since last tag
  try {
    const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
    return `${lastTag}..HEAD`;
  } catch {
    // If no tags exist, get from first commit
    const firstCommit = execSync('git rev-list --max-parents=0 HEAD').toString().trim();
    return `${firstCommit}..HEAD`;
  }
}

function generateChangelog() {
  const gitRange = getGitRange();
  const date = new Date().toISOString().split('T')[0];
  
  // Get commits based on configured range
  const commits = execSync(`git log ${gitRange} --pretty=format:"%h|%s|%b"`).toString().trim();
  
  // Parse commits into categories
  const categories = {
    features: [],
    fixes: [],
    improvements: [],
    other: []
  };

  commits.split('\n').forEach(commit => {
    const [hash, subject, body] = commit.split('|');
    
    // Categorize based on commit message
    if (subject.toLowerCase().includes('feat:') || subject.toLowerCase().includes('feature:')) {
      categories.features.push({ hash, subject: subject.replace(/^(feat:|feature:)/i, '').trim(), body });
    } else if (subject.toLowerCase().includes('fix:')) {
      categories.fixes.push({ hash, subject: subject.replace(/^fix:/i, '').trim(), body });
    } else if (subject.toLowerCase().includes('improve:') || subject.toLowerCase().includes('refactor:')) {
      categories.improvements.push({ hash, subject: subject.replace(/^(improve:|refactor:)/i, '').trim(), body });
    } else {
      categories.other.push({ hash, subject, body });
    }
  });

  // Generate markdown content
  let markdown = `---
title: Changes for ${date}
date: ${date}
---

# Changelog ${date}

`;

  // Add categories to markdown
  if (categories.features.length) {
    markdown += '\n## New Features\n\n';
    categories.features.forEach(({ subject, hash }) => {
      markdown += `- ${subject} (\`${hash}\`)\n`;
    });
  }

  if (categories.improvements.length) {
    markdown += '\n## Improvements\n\n';
    categories.improvements.forEach(({ subject, hash }) => {
      markdown += `- ${subject} (\`${hash}\`)\n`;
    });
  }

  if (categories.fixes.length) {
    markdown += '\n## Bug Fixes\n\n';
    categories.fixes.forEach(({ subject, hash }) => {
      markdown += `- ${subject} (\`${hash}\`)\n`;
    });
  }

  if (categories.other.length) {
    markdown += '\n## Other Changes\n\n';
    categories.other.forEach(({ subject, hash }) => {
      markdown += `- ${subject} (\`${hash}\`)\n`;
    });
  }

  // Save to file
  const filename = path.join(CHANGELOG_PATH, `${date}.md`);
  fs.mkdirSync(CHANGELOG_PATH, { recursive: true });
  fs.writeFileSync(filename, markdown);
  
  console.log(`Changelog generated at: ${filename}`);
}

// Run the generator
generateChangelog();
