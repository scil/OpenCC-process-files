const fs = require('fs');
const path = require('path');
const readline = require('readline');

const OpenCC = require('opencc');
const converter = new OpenCC('s2t.json');

/* 配置区
 *
 */

// 定义原始目录和目标目录
const sourceDirectory = 'E:/Work/King/repos/inbornking.com/4.code/shopxo-uniapp/pages';

// const targetDirectory = 'E:/Work/King/repos/inbornking.com/4.code/shopxo-uniapp/pages-hant';
const targetDirectory = null; // 覆盖模式 而非保存到新目录

const lineByLine = true;

// const checkFile = false;
const checkFile = (file) => {
  // 只处理 .vue文件
  return path.extname(file) === '.vue'
}
/* 配置区 */

// 递归读取目录下的所有文件并进行转换
/**
 *
 * @param sourceDir {string}
 * @param targetDir {string|null}
 */
 function convertFiles(sourceDir, targetDir) {
  const files = fs.readdirSync(sourceDir);
  files.forEach( (file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = targetDir ? path.join(targetDir, file) : sourcePath;
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归处理
      targetDir && fs.mkdirSync(targetPath, {recursive: true});
       convertFiles(sourcePath, targetDir? targetPath:null);
    } else {

      if (!checkFile || checkFile(sourcePath)) {

        lineByLine
          ?  convertFileLineByLine(sourcePath, targetDir ? targetPath : null)
          : convertFile(sourcePath, targetPath);
      }

    }
  });
}

function convertFile(sourcePath, targetPath) {

  let content = fs.readFileSync(sourcePath, 'utf8');

  converter.convertPromise(content).then(converted => {
    fs.writeFileSync(targetPath, converted, 'utf8');
  });
}

/**
 *
 * @param sourcePath
 * @param targetPath {string|null}
 */
 function convertFileLineByLine(sourcePath, targetPath) {

  const samefile = !targetPath;
  const fileWriteStream = samefile ? null : fs.createWriteStream(targetPath);
  const rl = readline.createInterface({
    input: fs.createReadStream(sourcePath),
    output: fileWriteStream,
    terminal: false
  });

  let newLines = [];

  rl.on('line',  (line) => {
    const trimed = line.trim()
    if (trimed.startsWith('//') || trimed.startsWith('<!--')) {
      samefile ? newLines.push(line) : fileWriteStream.write(line + '\n');
    } else {
      // 转换
      const convertedLine =  converter.convertSync(line);

      samefile ? newLines.push(convertedLine) : fileWriteStream.write(convertedLine + '\n');
    }
  });

  rl.on('close', function () {
    if(samefile){
      fs.writeFileSync(sourcePath, newLines.join('\n'));
    }
    else{
      fileWriteStream.end(); // 关闭写入流
    }
  });
}


// 调用函数开始转换
convertFiles(sourceDirectory, targetDirectory);