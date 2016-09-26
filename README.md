#marko-tester

===

Test library to assist with testing marko-widget UI components.

## Usage

#### Start using marko-tester with:

```
npm install --save-dev marko-tester
```

See `/test` for an example using this test library.

There are two things you can test:

### Template rendering given specific input;

The rendering test works by giving the Marko template the input to use for rendering, and by comparing the generated HTML with the expected HTML.


The test works with the following naming conventions required for the input JSON file and the expected HTML file that define a test case:

```
{test-case}.json
{test-case}.html
{another-test-case}.js
{another-test-case}.html
```

### Rendered template client testing;

The client test works by instanstiating a marko-widget and testing the functionality against it.

You need to create a file in which you can pass settings for client-testing, see example in:

```
/test/marko-tester.config.js
```

This file should be targeted first by mocha.

## Coverage

Having tests is awesome, but we should also know how much we tested already and how much of code still left to cover. That's why i've implemented Istanbul coverage tool to gather that data for you. Long story short, after a little bit of setup istanbul will gather test coverage from server-side fixture rendering, combine it with client-side marko-widget code coverage and report it in the way you need.

### Configuration:

In the initial marko-tester configuration file mentioned earlier you need to add `coverage` attribute:

```
tester.configure({
    ...
    coverage: {
        // Type of reporters you want your coverage be printed out.
        reporters: [
            'text-summary',
            'html',
            'json-summary'
        ],
        // Base of your project, in which the JS files should be tested.
        base: 'src',
        // Exclude file patterns and should not be covered.
        excludes: [
            '**/*.marko.js',
            '**/test/**'
        ]
    }
});
```

### Usage:

Imagine you have this command (possible in package.json) to run the unit-tests:

``` 
"scripts": {
    "lint": "./node_modules/marko-tester/node_modules/.bin/jshint source",
    "unit-test": "./node_modules/marko-tester/node_modules/.bin/mocha test/marko-tester.config.js $(find source -name '*.spec.js') --ui bdd --reporter spec --check-leaks --timeout 6000",
    "test": "npm run lint && npm run unit-test",
}
```

You can see the coverage by simply passing `--coverage` argument to that script:

```
npm run unit-test -- --coverage
// ./node_modules/marko-tester/node_modules/.bin/mocha test/marko-tester.config.js $(find source -name '*.spec.js') --ui bdd --reporter spec --check-leaks --timeout 6000 --coverage
```

## Code style

Bundle comes with additional tools to raise (or keep) your code quality.

### JSHint

`JSHint` comes as part of the package to lint the `marko-tester` itself, but of course it could be easily used to test your app. Just add a `.jshintrc` configuration file to the root of the project (you can copy the one from here, it's quit stict, but we shouldn't be soft when it comes down to code quality). And point to `JSHint` binary that comes with `marko-tester` with folders to search for `JS` files:

```
"scripts": {
    ...
    "lint": "./node_modules/marko-tester/node_modules/.bin/jshint source test",
    ...
}
```

### JSCS

As an addition to our weaponry to fight bad code we can (read as should) add a `JSCS` to be sure that our code is more readable and consistent. The procedure is the same as for `JSHint`: add a `.jscsrc` file that you can just copy from this project to yours. And have a command in your `package.json` file that will use `jscs` binary from `marko-tester` and point to folders you want to check:

```
"scripts": {
    ...
    "jscs": "./node_modules/marko-tester/node_modules/.bin/jscs source test",
    ...
}
```

And you all done, happy code style linting!

## Contribution

#### Build marko-tester with:

```
npm install
```

#### Lint & Test marko-tester with:

```
npm test
```
