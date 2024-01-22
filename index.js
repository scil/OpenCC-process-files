
const fs = require('fs');
const path = require('path');

const OpenCC = require('opencc');
const converter = new OpenCC('s2t.json');

// 定义原始目录和目标目录
const sourceDirectory =  'E:/Work/King/repos/inbornking.com/4.code/shopxo-uniapp/pages'; 
const targetDirectory =  'E:/Work/King/repos/inbornking.com/4.code/shopxo-uniapp/pages-hant'; 

// 递归读取目录下的所有文件并进行转换
function convertFiles(sourceDir, targetDir) {
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归处理
      fs.mkdirSync(targetPath, { recursive: true });
      convertFiles(sourcePath, targetPath);
    } else {
      // 如果是文件，则进行转换并写入目标目录
      let content = fs.readFileSync(sourcePath, 'utf8');
      
      converter.convertPromise(content).then(converted => {
        fs.writeFileSync(targetPath, converted, 'utf8');
    });

    }
  });
}

// 调用函数开始转换
convertFiles(sourceDirectory, targetDirectory);