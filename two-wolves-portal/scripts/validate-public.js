#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const projectRoot = path.join(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')
const ignoreDirs = new Set(['node_modules', '.next', '.git', '.vercel'])

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

function checkPublicReferences(files) {
  const offenders = []
  let hasPublicReference = false
  const disallowedRegex = /['"]\/public\//
  const publicPathRegex = /public\//

  for (const file of files) {
    if (path.resolve(file) === __filename) continue
    const content = fs.readFileSync(file, 'utf8')
    if (disallowedRegex.test(content)) {
      offenders.push(path.relative(projectRoot, file))
    }
    if (!hasPublicReference && publicPathRegex.test(content)) {
      hasPublicReference = true
    }
  }

  if (offenders.length > 0) {
    console.error('Found disallowed "/public/" references in:')
    for (const offender of offenders) {
      console.error(`  - ${offender}`)
    }
    process.exit(1)
  }

  if (hasPublicReference && !fs.existsSync(publicDir)) {
    console.error('The project references assets in public/, but the public/ directory is missing.')
    process.exit(1)
  }
}

function runNextBuild() {
  const result = spawnSync('next', ['build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    console.error('next build failed during validate-public')
    process.exit(result.status ?? 1)
  }
}

function main() {
  const files = collectFiles(projectRoot)
  checkPublicReferences(files)
  runNextBuild()
  console.log('✅ public path validation passed')
}

main()
