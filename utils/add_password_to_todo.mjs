import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const todoDir = path.join(__dirname, '../todo')

// 读取 todo 目录下的所有文件
const files = fs.readdirSync(todoDir)

// 处理每个文件
files.forEach((file) => {
  // 只处理 .md 文件，跳过 index.md（已经处理过）
  if (file.endsWith('.md') && file !== 'index.md') {
    const filePath = path.join(todoDir, file)
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // 检查是否已经包含密码保护组件
    if (!content.includes('<PasswordProtect>')) {
      // 添加密码保护组件
      content = `<PasswordProtect>\n\n${content}\n\n</PasswordProtect>`
      fs.writeFileSync(filePath, content)
      console.log(`✅ 已为 ${file} 添加密码保护`)
    } else {
      console.log(`⏭️  ${file} 已经有密码保护了`)
    }
  }
})

console.log('✨ 完成！所有 todo 页面都已添加密码保护')

