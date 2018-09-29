import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ReactEs6ClassesWalker(sourceFile, this.getOptions()));
  }
}


class ReactEs6ClassesWalker extends Lint.RuleWalker {
  private REACT_ES6_CLASSES_MESSAGE = tsml` Please use
  ES6 \`class\` syntax instead of \`React.createClass\`. See
  https://facebook.github.io/react/docs/reusable-components.html#es6-classes
  for more details. Your class should extend from \`React.Component\`.`;

  protected visitCallExpression(node: ts.CallExpression) {
    if (node.expression.getText() === 'React.createClass') {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.REACT_ES6_CLASSES_MESSAGE
      ));
    }
  }
}
