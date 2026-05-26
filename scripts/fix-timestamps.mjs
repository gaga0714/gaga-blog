import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import matter from 'gray-matter'

const DIARY_DIR = path.join(process.cwd(), 'diary')

function gitTime(filePath, flag) {
  try {
    const cmd = flag
      ? `git log --diff-filter=${flag} --follow --format=%aI -- "${filePath}"`
      : `git log -1 --format=%aI -- "${filePath}"`
    const out = execSync(cmd, { encoding: 'utf8' }).trim()
    const lines = out.split('\n').filter(Boolean)
    return lines.length ? lines[lines.length - 1] : null
  } catch {
    return null
  }
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  let changed = false

  if (!data.created) {
    data.created = gitTime(filePath, 'A') || new Date().toISOString()
    changed = true
    console.log(`[${path.basename(filePath)}] created: ${data.created}`)
  }

  const gitLastModified = gitTime(filePath)
  if (gitLastModified && gitLastModified !== data.updated) {
    data.updated = gitLastModified
    changed = true
    console.log(`[${path.basename(filePath)}] updated: ${data.updated}`)
  } else if (!data.updated) {
    data.updated = data.created
    changed = true
    console.log(`[${path.basename(filePath)}] updated: ${data.updated}`)
  }

  if (changed) {
    fs.writeFileSync(filePath, matter.stringify(content, data), 'utf8')
  }

  return changed
}

function main() {
  const files = fs.readdirSync(DIARY_DIR)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .map(f => path.join(DIARY_DIR, f))

  let count = 0
  for (const file of files) {
    try {
      if (processFile(file)) count++
    } catch (e) {
      console.error(`[${path.basename(file)}] Error:`, e.message)
    }
  }

  console.log(`\nDone. Updated ${count} file(s).`)
}

main()
