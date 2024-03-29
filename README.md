[![npm version](https://badge.fury.io/js/%40ull-esit-pl%2Fexample2test.svg)](https://badge.fury.io/js/%40ull-esit-pl%2Fexample2test)


## Methodology

This package may help to automate your testing cycle when you follow a methodology like this one:

1. You code a new feature `f` for your program `p`
2. You run your program `p` against a new input file `i` that test the new feature `f`: `p [options] i`
3. You manually check the output. If it looks good then 
4. You run your program again, but this time redirecting the output to a file `test/examples/i.expected` like this `p [options] i > test/examples/i.expected`
5. You also copy the input file `i` next to the expected output in `test/examples/i`
6. Then you make a mocha test that 
    1. Runs the program `p` against that same input file `i` and 
    2. Checks up that the new output `r` is the same as in the previously redirected file  `test/examples/i.expected`
7. You repeat the cycle (forever! :repeat:)


## Example: Generating the files

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

At the end, after repeating these steps a few times, you'll have a hierarchy similar to this:

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

## Example: Writing the test

Now, inside our test program we require the module:

```js
let e2t = require('@ull-esit-pl/example2test');
```

and then configure it for our needs:

```js
  let runTest = (programName, done) => {
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

## The executable `maketest`

```
➜  eloquentjsegg git:(private2021) make-test --help
Usage: maketest [options] <programName>

Options:
  -V, --version                      output the version number
  -c --config <configFileName.json>  Name of the JSON configuration file (default:
                                     "./.make-test.json")
  -h, --help                         display help for command
```

Example of configuration file:

```json
➜  eloquentjsegg git:(private2021) cat .make-test.json 
{
  "executable": "./bin/egg.js",
  "execOptions": "",
  "testPrefix": "npx mocha test -g",
  "defaultExtension": ".egg",
  "testFolder": "test"
}
```

```
➜  eloquentjsegg git:(private2021) cat examples/regexp-global.egg 
do {
  :=(x, RegExp.exec("2015-02-22", r/./)),
  print(x)
}

➜  eloquentjsegg git:(private2021) ./bin/make-test.js examples/regexp-global.egg
examples  regexp-global.egg regexp-global .egg
["2"]
Executed "./bin/egg.js  examples/regexp-global.egg > test/examples/regexp-global.egg.expected" succesfully
Executed "cp examples/regexp-global.egg test/examples/regexp-global.egg" succesfully


  Regular Expressions in Egg
    ✓ testing regexp-global.egg (158ms)


  1 passing (163ms)

Executed "npx mocha test -g regexp-global.egg" succesfully
test/examples/regexp-global.egg
test/examples/regexp-global.egg.expected
```