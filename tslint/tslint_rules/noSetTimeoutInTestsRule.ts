/**
 * Based on tslint's `no-reference` rule.
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';

const TEST_FILE_REGEX = /\.jest\.tsx?$/;

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-set-timeout-in-tests',
    description: 'Disallow setTimeout/setInterval, use jasmine.clock() instead',
    rationale: Lint.Utils.dedent`
      Disallow setTimeout/setInterval usages in tests.
      Manual timers are under the discretion of the JS runtime and conditions, and as such cannot
      be trusted to be executed exactly on the given delay.

      Instead, mock timers using builtin timers mock and advance time procedurally.
      If your test also depends on Date values you should also mock the date.

      Example:
      jasmine.clock().install();
      jasmine.clock().mockDate(initialDate) // initialDate is optional. Defaults to Date.now()
      jasmine.clock().tick(123); // ms
      jasmine.clock().uninstall();

      If you're awaiting some async work due to Promises or setTimeout(() => {}, 0) you can also
      use Jest's builtin timer mocks, see https://facebook.github.io/jest/docs/en/timer-mocks.html
      In particular jest.runAllTicks() and jest.runAllTimers() works great.

      Search for existing code for how you could/should use these.

      Mocking timers will also have the biproduct of making the test case synchronious and thus
      speed up the overall test suite!`,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: ['true'],
    type: 'typescript',
    typescriptOnly: false,
  };

  public static FAILURE_STRING_FACTORY(expression: string, messageAddition?: string) {
    return `'${expression}' should not be be used in tests. Use timer mocks or jasmine.clock()`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (TEST_FILE_REGEX.test(sourceFile.fileName)) {
      return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
  }
}

const BANNED_FUNCTIONS = ['setTimeout', 'setInterval'];
function walk(ctx: Lint.WalkContext<string[]>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node): void {
    if (node.kind === ts.SyntaxKind.CallExpression) {
      const expression = (node as ts.CallExpression).expression;
      if (expression.kind === ts.SyntaxKind.Identifier) {
        const name = (expression as ts.Identifier).text;
        if (BANNED_FUNCTIONS.indexOf(name) !== -1) {
          ctx.addFailureAtNode(expression, Rule.FAILURE_STRING_FACTORY(`${name}`));
        }
      }
    }
    return ts.forEachChild(node, cb);
  });
}
