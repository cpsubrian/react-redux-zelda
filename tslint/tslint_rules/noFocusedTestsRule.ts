import * as ts from 'typescript';
import * as Lint from 'tslint';

const TEST_FILE_REGEX = /\.[jt]est\.tsx?$/;

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-focused-tests',
    description: 'Disallow fdescribe, describe.only, fit, and it.only in committed code',
    rationale: 'These are intended for temporary debugging only, so should never be committed',
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: ['true'],
    type: 'typescript',
    typescriptOnly: false,
  };

  public static FAILURE_STRING_FACTORY(fnName: string, messageAddition?: string) {
    return `'${fnName}' should only be used for troubleshooting, please restore to default name`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (TEST_FILE_REGEX.test(sourceFile.fileName)) {
      return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
  }
}

const BANNED_FUNCTIONS = ['fdescribe', 'fit'];
const FOCUS_METHOD_NAME_ALIAS = 'only';

function walk(ctx: Lint.WalkContext<string[]>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    switch (node.kind) {
      case ts.SyntaxKind.CallExpression: {
        const expression = (node as ts.CallExpression).expression;
        const fnName = expression.getText();
        if (BANNED_FUNCTIONS.indexOf(fnName) !== -1) {
          ctx.addFailureAtNode(expression, Rule.FAILURE_STRING_FACTORY(fnName));
        }
        break;
      }

      case ts.SyntaxKind.Identifier: {
        if (node.getText() === FOCUS_METHOD_NAME_ALIAS) {
          ctx.addFailureAtNode(node, Rule.FAILURE_STRING_FACTORY(FOCUS_METHOD_NAME_ALIAS));
        }
        break;
      }
    }

    return ts.forEachChild(node, cb);
  });
}
