const Lint = require("tslint");

function Rule() {
  Lint.Rules.AbstractRule.apply(this, arguments);
}

// Matches import variableName = require('file/name')
const regex = /(?:^|\n)(?:import\s+)(?:[^=;]+)=\s*require\s*\(\s*['"](?:[a-zA-Z0-9_$\/.]+)['"]\s*\)/g;

Rule.FAILURE_STRING = "Prefer using 'import * as variable from file;' instead of 'import variable = require(file);'";
Rule.prototype = Object.create(Lint.Rules.AbstractRule.prototype);
Rule.prototype.apply = function(sourceFile) {
  const ruleFailures = [];
  const disabledIntervals = this.getOptions().disabledIntervals;
  sourceFile.text.replace(regex, (match, offsetIndex) => {
    if (match[0] == '\n') {
      offsetIndex++;
      match = match.substring(1);
    }

    const ruleFailure = new Lint.RuleFailure(sourceFile, offsetIndex, offsetIndex + match.length,
        Rule.FAILURE_STRING, this.getOptions().ruleName);
    if (!Lint.doesIntersect(ruleFailure, disabledIntervals)) {
      ruleFailures.push(ruleFailure);
    }
  });

  return ruleFailures;
};

exports.Rule = Rule;
