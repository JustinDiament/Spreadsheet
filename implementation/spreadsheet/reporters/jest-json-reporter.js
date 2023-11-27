(function () {
  "use strict";

  const path = require('path');
  const jest = require('jest');
  const fs = require('fs');
  const funkyLogger = require('./funky-logger');

  class Suite {

    parent = null;

    constructor(parent, title, fullTitle) {
      this.parent = parent;
      this.title = title;
      this.fullTitle = fullTitle;
      this.suites = [];
      this.tests = [];
      this.pass = 0;
      this.fail = 0;
      this.total = 0;
    }

    addTest(test) {
      this.total++;
      if(test.status === 'PASS') {
        this.pass++;
      } else {
        this.fail++
      }
      this.tests.push(test);
    }

    toJSON() {
      return {
        title: this.title,
        fullTitle: this.fullTitle,
        suites: this.suites.map((suite) => suite.toJSON()),
        tests: this.tests.map((test) => test.toJSON()),
        pass: this.pass,
        fail: this.fail
      };
    }

  }

  class Spec {

    constructor(title, fullTitle, status, error) {
      this.title = title;
      this.fullTitle = fullTitle;
      this.status = status;
      this.error = error;
    }

    toJSON() {
      return {
        title: this.title,
        fullTitle: this.fullTitle,
        status: this.status,
        error: this.error
      };
    }

  }

  // this reporter outputs test results, indenting two spaces per suite
  class MyReporter {

    stats = undefined;

    constructor(globalConfig, options) {
      this._globalConfig = globalConfig;
      this._options = options;
    }

    onRunStart(stats) {
      this.stats = stats;
      console.log(funkyLogger.color("original", "\nStarted tests\n"));
    }

    onRunComplete(test, results) {
      this._indents = 0;
      
      this.stats.numFailedTests = results.numFailedTests;
      this.stats.numPassedTests = results.numPassedTests;
      this.stats.numPendingTests = results.numPendingTests;
      this.stats.startTime = results.startTime;

      let mySuite = new Suite(null, 'root', 'root');
      const groupedByAncestorTitles = { };

      results.testResults.forEach((suite) => {
        const newSuite = new Suite(mySuite, '', '');
        mySuite.suites.push(newSuite);
        mySuite = newSuite;

        suite.testResults.forEach((test) => {
          if(!groupedByAncestorTitles[test.ancestorTitles[0]]) {
            groupedByAncestorTitles[test.ancestorTitles[0]] = [];
          }
          if(test.status === 'passed') {
            mySuite.addTest(new Spec(test.title, test.fullName, 'PASS', null));
            groupedByAncestorTitles[test.ancestorTitles[0]].push(
              funkyLogger.color("green", `${this.indent(test.ancestorTitles.length + 1)}${test.fullName.replace(test.ancestorTitles[0], '')}`)
            );
          } else {
            mySuite.addTest(new Spec(test.title, test.fullName, 'FAIL', test.failureMessages.join(" ")));
            groupedByAncestorTitles[test.ancestorTitles[0]].push(
              funkyLogger.color("red", `${this.indent(test.ancestorTitles.length + 1)}${test.fullName.replace(test.ancestorTitles[0], '')} - error: ${test.failureMessages.join(" ")}`)
            );
          }
        });

      });

      Object.keys(groupedByAncestorTitles).forEach(groupName => {
        console.log(funkyLogger.color("cyan", groupName));
        groupedByAncestorTitles[groupName].forEach(result => {
          console.log(result);
        });
      });

      console.log(
        funkyLogger.color("magenta", `\nTests finished. ${this.stats.numPassedTests}/${this.stats.numPassedTests + this.stats.numFailedTests} ok\n`)
      );

      fs.writeFileSync('results.json', JSON.stringify({suites: mySuite.toJSON(), stats: this.stats}, null, 2), 'utf8');

    }

    indent(indents) {
      return Array(indents).join("  ");
    }

  }

  module.exports = MyReporter;
})();
