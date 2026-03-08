'use strict'

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const [,, version, changelogText] = process.argv

if (!version || !changelogText) {
  console.error('Usage: node scripts/release.js <version> "<changelog text>"')
  process.exit(1)
}

const ROOT = path.resolve(__dirname, '..')
const INDEX_PATH = path.join(ROOT, 'index.html')
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md')

// Safety check: abort if working tree has uncommitted changes
try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'ignore' })
} catch (e) {
  console.error('Working tree is not clean. Commit or stash changes before running a release.')
  process.exit(1)
}

// 1. Update both version occurrences in index.html
const PATTERN_WINDOW = /window\.KB_BUILD_VERSION = "[^"]+"/
const PATTERN_CONST  = /\(window\.KB_BUILD_VERSION \|\| "[^"]+"\)/

const indexContent = fs.readFileSync(INDEX_PATH, 'utf8')
if (!PATTERN_WINDOW.test(indexContent)) {
  console.error('Error: window.KB_BUILD_VERSION = "..." not found in index.html')
  process.exit(1)
}
if (!PATTERN_CONST.test(indexContent)) {
  console.error('Error: (window.KB_BUILD_VERSION || "...") not found in index.html')
  process.exit(1)
}
const updatedIndex = indexContent
  .replace(PATTERN_WINDOW, `window.KB_BUILD_VERSION = "${version}"`)
  .replace(PATTERN_CONST,  `(window.KB_BUILD_VERSION || "${version}")`)
fs.writeFileSync(INDEX_PATH, updatedIndex, 'utf8')
console.log(`index.html: updated both KB_BUILD_VERSION occurrences to "${version}"`)

// 2. Prepend new entry to CHANGELOG.md
const date = new Date().toISOString().slice(0, 10)
const newLine = `- ${version} (${date}): ${changelogText}`
const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8')
const marker = 'CHANGELOG:'
const markerIndex = changelogContent.indexOf(marker)
let updatedChangelog
if (markerIndex !== -1) {
  const insertAt = markerIndex + marker.length + 1
  updatedChangelog =
    changelogContent.slice(0, insertAt) +
    newLine + '\n' +
    changelogContent.slice(insertAt)
} else {
  updatedChangelog = newLine + '\n' + changelogContent
}
fs.writeFileSync(CHANGELOG_PATH, updatedChangelog, 'utf8')
console.log(`CHANGELOG.md: prepended "${newLine}"`)

// 3. Git
function git(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  } catch (err) {
    console.error(`Git command failed: ${cmd}`)
    process.exit(1)
  }
}

git('git add index.html CHANGELOG.md')
git(`git commit -m "Release ${version}"`)
git(`git tag v${version}`)

console.log(`Released v${version}`)
