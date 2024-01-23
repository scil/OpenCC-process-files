const {transform} = require("./index");

transform('E:/Work/OpenCC-Hans-Hant/goods-category', {
  outputDir: null,
  lineByLineCheckFunc: (line) => {
    const trimed = line.trim();
    if (trimed.startsWith('//') || trimed.startsWith('<!--')) {
      return false
    }
    return true
  },
  checkFileFunction: (file) => {
    return file.endsWith('.vue')
  }
})