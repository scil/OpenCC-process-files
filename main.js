const fs = require('fs');
const path = require('path');
const readline = require('readline');

const OpenCC = require('opencc');
const converter = new OpenCC('s2t.json');


// 递归读取目录下的所有文件并进行转换
/**
 *
 * @param sourceDir {string}
 * @param outputDir {Object}
 */
function convertFiles(sourceDir, {outputDir, ...args}) {
  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const outputPath = outputDir ? path.join(outputDir, file) : sourcePath;
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归处理
      outputDir && fs.mkdirSync(outputPath, {recursive: true});
      convertFiles(sourcePath, {
        outputDir: outputDir ? outputPath : null,
        ...args,
      });
    } else {

      if (!args.checkFileFunction || args.checkFileFunction(sourcePath)) {

        args.lineByLineCheckFunc
          ? convertFileLineByLine(sourcePath,
            {
              outputDir: outputDir ? outputPath : null,
              lineByLineCheckFunc: args.lineByLineCheckFunc,
            }
          )
          : convertFile(sourcePath, outputPath);
      }

    }
  });
}

function convertFile(sourcePath, outputPath) {

  let content = fs.readFileSync(sourcePath, 'utf8');

  converter.convertPromise(content).then(converted => {
    fs.writeFileSync(outputPath, converted, 'utf8');
  });
}

/**
 *
 * @param sourcePath
 * @param outputPath {string|null}
 */
function convertFileLineByLine(sourcePath, {
  outputPath,
  lineByLineCheckFunc,
}) {

  const samefile = !outputPath;
  const fileWriteStream = samefile ? null : fs.createWriteStream(outputPath);
  const rl = readline.createInterface({
    input: fs.createReadStream(sourcePath),
    output: fileWriteStream,
    terminal: false
  });

  let newLines = [];

  rl.on('line', (line) => {
    if (lineByLineCheckFunc && lineByLineCheckFunc(line)) {
      // 转换
      line = converter.convertSync(line);
    }

    samefile ? newLines.push(line) : fileWriteStream.write(line + '\n');

  });

  rl.on('close', function () {
    if (samefile) {
      fs.writeFileSync(sourcePath, newLines.join('\n'));
    } else {
      fileWriteStream.end(); // 关闭写入流
    }
  });
}

function transform(sourceDir, {outputDir, lineByLineCheckFunc, checkFileFunction}) {
  checkFileFunction = typeof checkFileFunction === 'function' ? checkFileFunction : null;
  lineByLineCheckFunc = typeof lineByLineCheckFunc === 'function' ? lineByLineCheckFunc : null;

  convertFiles(sourceDir, {outputDir, lineByLineCheckFunc, checkFileFunction});
}

module.exports = {
  transform,
}
