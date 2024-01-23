const argparse = require('argparse');
const path = require('path');
const {convertFiles} = require("./main");

const parser = new argparse.ArgumentParser();

parser.add_argument('sourceDir', {
  type: 'string',
  default: 'E:/Work/King/repos/inbornking.com/4.code/shopxo-uniapp/pages',
  help: 'the directory to work with'
});
parser.add_argument('-o','--outputDir', {type: 'String', default: null, help: 'the output directory. write the source Directory if not set'});
parser.add_argument('--checkFileFunction', {type: 'String', default: null, help: 'take in every file as a parameter, then process with the file when this checkFileFunction function return true'});
parser.add_argument('--lineByLineCheckFunc', {type: 'String', default: null, help: 'take in every line as a parameter, then process with the line when this lineByLine function return true'});

const args = parser.parse_args();

const checkFileFunction = typeof args.checkFileFunction === 'string'  && args.checkFileFunction.length>0 
  ? Function.apply(Function, ['file',  checkFileFunction])
  : null

const lineByLineCheckFunc = typeof args.lineByLineCheckFunc === 'string'  && args.lineByLineCheckFunc.length>0
  ? Function.apply(Function, ['file',  lineByLineCheckFunc])
  : null

const args = {
  sourceDir : args.sourceDir,
  outputDir : args.outputDir,
  lineByLineCheckFunc,
  checkFileFunction 
}


convertFiles(sourceDir, args);
