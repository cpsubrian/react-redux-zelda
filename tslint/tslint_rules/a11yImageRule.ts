import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {JsxWalker} from './jsxWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new A11yImageWalker(sourceFile, this.getOptions()));
  }
}

class A11yImageWalker extends JsxWalker {
  public MISSING_ALT = tsml`Every image needs an alt attribute to convey its meaning to people who may not be able
    to see it. For images that are redundant to text next to them, or used for purely decorative purposes, use alt="".
    For informational images, provide a short, internationalized string. For more info, visit drl/accessibility-tests`;
  public UNTRANSLATED_ALT = tsml`For user-facing features, alt text should be translated, just like the visible text on the page.`;

  private ignoredRoles = ['presentation', 'none'];

  private isValidRole(expression: ts.Expression): boolean {
    if (expression == null || expression.kind !== ts.SyntaxKind.StringLiteral) {
      return false;
    }
    return this.ignoredRoles.indexOf((expression as ts.StringLiteral).text) > -1;
  }

  private isAriaHidden(expression: ts.Expression): boolean {
    if (expression == null || expression.kind !== ts.SyntaxKind.StringLiteral) {
      return false;
    }
    return (expression as ts.StringLiteral).text === 'true';
  }

  protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    const tagName = this.getTagName(node);
    if (tagName === 'img' || tagName === 'sprite') {
      const attrMap = this.getAttributeMap(node);
      const alt = attrMap['alt'];
      if(alt == null) {
        if(!this.isValidRole(attrMap['role']) && !this.isAriaHidden(attrMap['aria-hidden'])) {
          this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.MISSING_ALT));
        }
      } else if (alt.kind === ts.SyntaxKind.StringLiteral) {
        if (!((alt as ts.StringLiteral).text.trim() === '')) {
          this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.UNTRANSLATED_ALT));
        }
      }
    }
    super.visitJsxSelfClosingElement(node);
  }
}
