[![npm version](https://badge.fury.io/js/%40ull-esit-pl%2Fexample2test.svg)](https://badge.fury.io/js/%40ull-esit-pl%2Fexample2test)


## Methodology

This package may help when you follow a methodology like this one:

1. Code a new feature for your program
2. Run your program against a input file that test the new feature
2. Run your program again and redirect the output 
3. Check the output. If it looks good then you make a test that 
  1. Runs the program against that input file and 
  2. Check the new output is the same as in the previously redirected file


### Example. Generating the files

Each time we add a new feature to our program (here `bin/egg.js`) we usually run it with an input file (here 
`examples/regexp-global.egg`) and visually check the output to see if it is what we expected:

```
[~/.../crguezl-egg(private2019)]$ bin/egg.js examples/regexp-global.egg
[ '2', index: 0, input: '2015-02-22' ]
```

If it is what we expected then we save the output in  the directory `test/examples` with
the same name of the input file (here `examples/regexp-global.egg`) and the extension `.expected`
(here `test/examples/regexp-global.egg.expected`)

```
[~/.../crguezl-egg(private2019)]$ bin/egg.js examples/regexp-global.egg > test/examples/regexp-global.egg.expected
```

We also copy the input file (here `examples/regexp-global.egg`) to `test/examples`:

```
[~/.../crguezl-egg(private2019)]$ cp examples/regexp-global.egg test/examples/
```

At the end, you'll have a hierarchy similar to this:

```
[~/.../crguezl-egg(private2019)]$ tree test
test
├── examples
│   ├── regexp-global.egg
│   ├── regexp-global.egg.expected
│   ├── regexp-simple.egg
│   ├── regexp-simple.egg.expected
│   ├── regexp.egg
│   └── regexp.egg.expected
├── regexp.js
└── test.js

1 directory, 8 files
```

## Example of use

Now, inside our test program we require the module:

```js
let e2t = require('@ull-esit-pl/example2test');
```

and then configure it for our needs:

```js
  let runTest = (programName, done) => {
    debugger;
    e2t({
      exampleInput: programName+'.egg', 
      executable: 'bin/egg.js', 
      assertion: (result, expected) => result.trim().should.eql(expected.trim()),
      done: done, 
    });
  };
``` 

Now adding a test that checks if running the executable on the input gives the expected result is just
a matter of addding three new lines like this:

```js
  it("testing regexp-global.egg", function(done) {
    runTest('regexp-global', done);
  });
```

See the full code for the example:

**[~/.../crguezl-egg(private2019)]$ cat test/regexp.js**

```js
var should = require("should");
let e2t = require('@ull-esit-pl/example2test');

describe("Regular Expressions in Egg", function() {
  let runTest = (programName, done) => {
    e2t({
      exampleInput: programName+'.egg', 
      executable: 'bin/egg.js', 
      assertion: (result, expected) => result.trim().should.eql(expected.trim()),
      done: done, 
    });
  };

  it("testing regexp.egg", function(done) {
    runTest('regexp', done);
  });


  it("testing regexp-simple.egg", function(done) {
    runTest('regexp-simple', done);
  });

  it("testing regexp-global.egg", function(done) {
    runTest('regexp-global', done);
  });

});
```

Now you can run the tests:

```
~/.../crguezl-egg(private2019)]$ npx mocha test/regexp.js 


  Regular Expressions in Egg
    ✓ testing regexp.egg (163ms)
    ✓ testing regexp-simple.egg (165ms)
    ✓ testing regexp-global.egg (163ms)


  3 passing (500ms)
```
