const {transform} = require("./index");

transform('E:/Work/OpenCC-Hans-Hant/goods-category', {
  outputDir: null,
  checkFileFunction: (file) => {
    return file.endsWith('.vue')
  },
  lineByLineCheckFunc: (line) => {
    const trimed = line.trim();
    if (trimed.startsWith('//') || trimed.startsWith('<!--')) {
      return false
    }
    return true
  },
})