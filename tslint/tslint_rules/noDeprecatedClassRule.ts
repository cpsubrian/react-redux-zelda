import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DeprecatedClassWalker(sourceFile, this.getOptions()));
  }
}

class DeprecatedClassWalker extends Lint.RuleWalker {
  private SICKINPUT_MESSAGE =
    'SickInput is deprecated. See https://paper.dropbox.com/doc/Alternatives-for-Deprecated-Classes-17jG8hLocISuzwKVZz0KH for alternatives.';

  protected visitNewExpression(node: ts.NewExpression) {
    if (node.expression.getText() === 'SickInput') {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.SICKINPUT_MESSAGE));
    }
  }
}
