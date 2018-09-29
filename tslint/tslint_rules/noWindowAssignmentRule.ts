import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoWindowAssignmentWalker(sourceFile, this.getOptions()));
  }
}


class NoWindowAssignmentWalker extends Lint.RuleWalker {
  private NO_WINDOW_ASSIGNMENT_MESSAGE = tsml`Don't assign to properties on the window object. Assignment to properties on the window object is essentially assignment to global variables, which break modularity and can cause confusing
  behavior.`;

  protected visitBinaryExpression(node: ts.BinaryExpression) {
    if (
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      (
        node.left.kind === ts.SyntaxKind.PropertyAccessExpression ||
        node.left.kind === ts.SyntaxKind.ElementAccessExpression
      ) &&
      this.getPropertyAccessBaseText(node.left) === 'window'
    ) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.NO_WINDOW_ASSIGNMENT_MESSAGE
      ));
    }
  }

  private getPropertyAccessBaseText(e: ts.Expression): string {
    if (e.kind === ts.SyntaxKind.Identifier) {
      return (e as ts.Identifier).text;
    } else if (e.kind === ts.SyntaxKind.PropertyAccessExpression) {
      return this.getPropertyAccessBaseText((e as ts.PropertyAccessExpression).expression);
    } else if (e.kind === ts.SyntaxKind.ElementAccessExpression) {
      return this.getPropertyAccessBaseText((e as ts.ElementAccessExpression).expression);
    }
    return null;
  }
}
