let insp = require("util").inspect;
let ins = (x) => insp(x, {depth:null});
let exec = require('child_process').exec;
let fs = require('fs');

let runTest = (executable, programName, assertion, done) => {
  let result = '';
  let expected = fs.readFileSync(`test/examples/${programName}.expected`, 'utf8');
  
  let program = `${executable} test/examples/${programName}`;
 
  let child = exec(program);

  child.stdout.on('data', function(data) {
    result += data;
  });

  child.on('close', function() {
    assertion(); // result.trim().should.eql(expected.trim());
    done();
  });
};

module.exports = runTest;
