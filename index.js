let insp = require("util").inspect;
let ins = (x) => insp(x, {depth:null});
let exec = require('child_process').exec;
let fs = require('fs');

let runTest = ({executable, exampleInput, assertion, done}) => {
  let result = '';
  let program = `${executable} test/examples/${exampleInput}`;
  let expectedFile = `test/examples/${exampleInput}.expected`;
  try {
    let expected = fs.readFileSync(expectedFile, 'utf8');
    let child = exec(program);
    let clean = (err) => {
      done();
      child.kill();
      throw Error(`There were problems either opening file '${expectedFile}' or executing '${program}'\n${err}`);
    };

    child.stdout.on('data', function(data) {
      result += data;
    });

    child.on('close', function() {
      assertion(result, expected); // result.trim().should.eql(expected.trim());
      done();
    });

    child.on('uncaughtException', clean)
  } catch (err) {
    clean(err);
  }
};

module.exports = runTest;
