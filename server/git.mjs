import { simpleGit } from 'simple-git'
import path from 'node:path'

const REPO_PATH = process.env.REPO_PATH
const BRANCH = process.env.GIT_BRANCH || 'main'
const USER_NAME = process.env.GIT_USER_NAME || 'gaga-blog-bot'
const USER_EMAIL = process.env.GIT_USER_EMAIL || 'bot@example.com'

if (!REPO_PATH) {
  console.warn('[git] REPO_PATH not set; git operations will fail.')
}

const git = REPO_PATH ? simpleGit(REPO_PATH) : null

async function ensureSync() {
  if (!git) throw new Error('REPO_PATH not configured')
  await git.fetch('origin', BRANCH)
  await git.reset('hard', [`origin/${BRANCH}`])
}

async function commitAndPush(message) {
  if (!git) throw new Error('REPO_PATH not configured')
  await git.addConfig('user.name', USER_NAME, false, 'local')
  await git.addConfig('user.email', USER_EMAIL, false, 'local')
  const status = await git.status()
  if (status.isClean()) {
    return { skipped: true }
  }
  await git.commit(message)
  await git.push('origin', BRANCH)
  return { skipped: false }
}

export const repoPath = REPO_PATH
export const branch = BRANCH
export { git, ensureSync, commitAndPush }

export function repoFile(...segments) {
  if (!REPO_PATH) throw new Error('REPO_PATH not configured')
  return path.join(REPO_PATH, ...segments)
}
