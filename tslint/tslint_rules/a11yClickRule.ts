import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {JsxWalker} from './jsxWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new A11yClickWalker(sourceFile, this.getOptions()));
  }
}

class A11yClickWalker extends JsxWalker {
  public MESSAGE = tsml`This clickable element may not be accessible to users navigating with a keyboard.
    Please double-check and consider using a natively interactive HTML element, such as a button. If there
    are no natively interactive HTML elements that make sense for your use case, visit drl/accessibility-tests
    for more info on making this element's interactions available for all users.`;
  public ANCHOR_MESSAGE = tsml`A click event on an anchor without an href is not accessible via keyboard.
    Could you use a <button> instead? If not, visit drl/accessibility-tests for more info on making this
    element's interactions available for all users.`;

  private nonInteractiveTags = ['address', 'article', 'aside', 'canvas', 'caption', 'col', 'colgroup', 'datalist',
    'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'hgroup', 'hr', 'label', 'legend', 'li', 'main', 'nav', 'ol', 'optgroup', 'p', 'pre', 'progress',
    'section', 'span', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

  private isNativelyInteractive(node: ts.Node, attributes: {[key:string]:ts.Expression}): boolean {
    const tagName = this.getTagName(node);

    if (this.nonInteractiveTags.indexOf(tagName) > -1) {
      return false;
    }
    if ('a' === tagName) {
      return Boolean(attributes['href']);
    }

    return true;
  }

  private checkAccessibleClickEvent(node: ts.Node) {
    const attrMap = this.getAttributeMap(node);
    const hasMouseEvent = Boolean((attrMap['onclick'] || attrMap['onmousedown']));

    if (hasMouseEvent && !this.isNativelyInteractive(node, attrMap)) {
      const hasKeyEvent = Boolean(attrMap['onkeydown'] || attrMap['onkeypress']);
      const hasTabIndex = Boolean(attrMap['tabindex']);
      const hasAppropriateRole = this.isInteractiveRole(attrMap['role']);

      if (!hasKeyEvent || !hasTabIndex || !hasAppropriateRole) {
        const message = this.getTagName(node) === 'a' ? this.ANCHOR_MESSAGE : this.MESSAGE;
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
      }
    }
  }

  protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    this.checkAccessibleClickEvent(node);
    super.visitJsxSelfClosingElement(node);
  }

  protected visitJsxElement(node: ts.JsxElement) {
    this.checkAccessibleClickEvent(node.openingElement);
    super.visitJsxElement(node);
  }
}
