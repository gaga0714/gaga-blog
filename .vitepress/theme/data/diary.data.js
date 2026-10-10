import { DIARY_DIRECTORY, readDiaryArticles } from '../../lib/diary-meta.mjs'

export default {
  watch: `${DIARY_DIRECTORY}*.md`,
  load() {
    return readDiaryArticles()
  }
}
