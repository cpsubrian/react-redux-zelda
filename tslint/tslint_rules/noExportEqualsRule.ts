const Lint = require("tslint");

function Rule() {
  Lint.Rules.AbstractRule.apply(this, arguments);
}

const regex = /(?:^|\n)(?:export\s*=)/g;

Rule.FAILURE_STRING = "Prefer 'export default thing;' instead of 'export = thing;'";
Rule.prototype = Object.create(Lint.Rules.AbstractRule.prototype);
Rule.prototype.apply = function(sourceFile) {
  const ruleFailures = [];
  const disabledIntervals = this.getOptions().disabledIntervals;
  sourceFile.text.replace(regex, (match, offsetIndex) => {
    const ruleFailure = new Lint.RuleFailure(sourceFile, offsetIndex, offsetIndex + match.length,
        Rule.FAILURE_STRING, this.getOptions().ruleName);
    if (!Lint.doesIntersect(ruleFailure, disabledIntervals)) {
      ruleFailures.push(ruleFailure);
    }
  });

  return ruleFailures;
};

exports.Rule = Rule;
