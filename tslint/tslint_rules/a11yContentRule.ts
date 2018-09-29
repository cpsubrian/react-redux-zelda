import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {JsxWalker} from './jsxWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new A11yContentWalker(sourceFile, this.getOptions()));
  }
}

class A11yContentWalker extends JsxWalker {
  public MESSAGE = tsml`This interactive element doesn't appear to have an accessible name!
    Screenreader users might not know what it does. Please add some content or give the
    element a translated aria-label. Check out drl/accessibility-tests for more info.`;
  private controlRoles = [
    'button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'option', 'radio', 'tab', 'treeitem',
  ];

  private isInsideReactFormat(node: ts.Node): boolean {
    // Controls passed into reactFormat don't have content, but we shouldn't throw a lint error
    // in this case because reactFormat is usually used to add translated content to them.
    // e.g. reactFormat(_('<a>go %(location)s</a>'), {a: <a href="/"/>, location: 'home'})
    // takes in a hyperlink without content and returns <a href="/">go home</a>, which is valid.
    if(node.parent && node.parent.kind === ts.SyntaxKind.PropertyAssignment) {
      let currentNode = node.parent.parent;
      while(currentNode) {
        if (currentNode.kind === ts.SyntaxKind.CallExpression) {
          return (currentNode as ts.CallExpression).expression.getText() === 'reactFormat';
        }
        currentNode = currentNode.parent;
      }
    }
    return false;
  }

  private isControl(node: ts.Node, attributes: {[key:string]:ts.Expression}): boolean {
    const tagName = this.getTagName(node);
    // Button
    if (tagName === 'button') {
      return true;
    }
    // Keyboard-actionable anchor
    if (tagName === 'a' &&
      Boolean(
        attributes['onclick'] ||
        attributes['href'] ||
        attributes['onkeydown'] ||
        attributes['onkeypress']
      )
    ) {
      return true;
    }
    // Interactive element
    if (this.isInteractiveRole(attributes['role'])) {
      return true;
    }

    return false;
  }

  private containsAriaLabel(attributes: {[key:string]:ts.Expression}): boolean {
    return Boolean(attributes['aria-label'] || attributes['aria-labelledby']);
  }

  private containsDangerouslySetInnerHTMLAttribute(attributes: {[key:string]:ts.Expression}) {
    return !!attributes['dangerouslySetInnerHTML'.toLowerCase()];
  }

  protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    const attributes = this.getAttributeMap(node);
    if (this.isControl(node, attributes) &&
        !this.containsAriaLabel(attributes) &&
        !this.containsDangerouslySetInnerHTMLAttribute(attributes) &&
        !this.isInsideReactFormat(node)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.MESSAGE));
    }
    super.visitJsxSelfClosingElement(node);
  }

  protected visitJsxElement(node: ts.JsxElement) {
    const attributes = this.getAttributeMap(node);
    if (this.isControl(node, attributes) &&
        node.children.length === 0 &&
        !this.containsAriaLabel(attributes) &&
        !this.containsDangerouslySetInnerHTMLAttribute(attributes) &&
        !this.isInsideReactFormat(node)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.MESSAGE));
    }
    super.visitJsxElement(node);
  }
}
