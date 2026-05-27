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

function getBodyAtCommit(filePath, commitHash) {
  try {
    const relativePath = path.relative(process.cwd(), filePath)
    const raw = execSync(`git show ${commitHash}:"${relativePath}"`, { encoding: 'utf8' })
    return matter(raw).content.trim()
  } catch {
    return null
  }
}

function getLastContentModifiedTime(filePath) {
  try {
    const relativePath = path.relative(process.cwd(), filePath)
    const cmd = `git log -20 --format=%H_%aI -- "${filePath}"`
    const out = execSync(cmd, { encoding: 'utf8' }).trim()
    const commits = out.split('\n').filter(Boolean).map(line => {
      const sepIdx = line.indexOf('_')
      return { hash: line.slice(0, sepIdx), date: line.slice(sepIdx + 1) }
    })

    if (!commits.length) return null
    if (commits.length === 1) return commits[0].date

    for (let i = 0; i < commits.length - 1; i++) {
      const bodyThis = getBodyAtCommit(filePath, commits[i].hash)
      const bodyPrev = getBodyAtCommit(filePath, commits[i + 1].hash)

      if (bodyThis === null || bodyPrev === null) return commits[i].date
      if (bodyThis !== bodyPrev) return commits[i].date
    }

    return commits[commits.length - 1].date
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

  const gitLastModified = getLastContentModifiedTime(filePath)
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
