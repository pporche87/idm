import fs from 'fs'
import path from 'path'

const SRC_DIR = path.resolve(__dirname, '..', 'node_modules', 'src')

const SYMLINK_NAMES = [
  'client',
  'common',
  'config',
  'db',
  'scripts',
  'server',
  'test',
]

const dirExists = fs.existsSync(SRC_DIR)
if (!dirExists) {
  console.log('Creating dir:', SRC_DIR)
  fs.mkdirSync(SRC_DIR)
}

SYMLINK_NAMES.forEach(linkName => {
  const linkPath = path.resolve(__dirname, '..', 'node_modules', 'src', linkName)
  const linkTarget = path.resolve(__dirname, '..', linkName)
  const linkExists = fs.existsSync(linkPath)
  if (!linkExists) {
    console.log('Creating symlink:', linkTarget, linkPath)
    fs.symlinkSync(linkTarget, linkPath, 'dir')
  }
})
