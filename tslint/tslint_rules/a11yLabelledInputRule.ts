import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {JsxWalker} from './jsxWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new A11yLabelledInputWalker(sourceFile, this.getOptions()));
  }
}

class A11yLabelledInputWalker extends JsxWalker {
  public EMPTY_LABEL = tsml`It looks like you're adding an empty label element. Shouldn't this have some content?`;
  public MISSING_LABEL = tsml`Please double-check that this input field has an associated label. For more info, visit drl/accessibility-tests`;
  public MISSING_INPUT = tsml`Please double-check that this label has an associated input field. For more info, visit drl/accessibility-tests`;
  private ignoredInputTypes = ['submit', 'reset', 'button', 'hidden'];

  private isLabel(node: ts.Node): boolean {
    return this.getTagName(node) === 'label';
  }

  private isInputField(node: ts.Node): boolean {
    const tagName = this.getTagName(node);
    switch (tagName) {
      case 'textarea':
      case 'select':
        return true;
      case 'input':
        const attrMap = this.getAttributeMap(node);
        const inputType = attrMap['type'];
        // Check if string input type is special
        if (inputType && inputType.kind === ts.SyntaxKind.StringLiteral) {
          return this.ignoredInputTypes.indexOf((inputType as ts.StringLiteral).text) === -1;
        }
        // Assume non-string input types aren't special
        return true;
      default:
        return false;
    }
  }

  private hasWrapperLabel(node: ts.Node) {
    let currentNode = node.parent;
    while(currentNode && currentNode.kind === ts.SyntaxKind.JsxElement) {
      if (this.isLabel(currentNode)) {
        return true;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  private hasNestedInputField(node: ts.JsxElement) {
    const children = node.children;
    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      if (this.isInputField(child)) {
        return true;
      }
      if(this.isJsxElement(child) && this.hasNestedInputField((child as ts.JsxElement))) {
        return true;
      }
    }
    return false;
  }

  private checkLabel(node: ts.JsxElement) {
    const attrMap = this.getAttributeMap(node);
    // If the label has an htmlFor attribute, assume/hope it's referencing an input field ID.
    // Otherwise, check that the label has an input field nested inside it.
    // Note: In HTML, <label> should have `for` attribute, but in React it's `htmlFor`.
    // This linter assumes the majority of our TypeScript JSX code is written in React.
    if (!attrMap['htmlfor'] && !this.hasNestedInputField(node)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.MISSING_INPUT));
    }
  }

  private checkInputField(node: ts.Node) {
    const attrMap = this.getAttributeMap(node);
    // If the input field has an id, assume/hope it's referenced by a <label>.
    // If it has an aria-labelledby attribute, assume it references another element.
    // Otherwise, check for an ARIA label or an implicit parent label.
    if (!attrMap['id'] &&
        !attrMap['aria-labelledby'] &&
        !attrMap['aria-label'] &&
        !this.hasWrapperLabel(node)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.MISSING_LABEL));
    }
  }

  protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    if (this.isLabel(node)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), this.EMPTY_LABEL));
    } else if (this.isInputField(node)) {
      this.checkInputField(node);
    }
    super.visitJsxSelfClosingElement(node);
  }

  protected visitJsxElement(node: ts.JsxElement) {
    if (this.isLabel(node)) {
      this.checkLabel(node);
    } else if (this.isInputField(node)) {
      this.checkInputField(node);
    }
    super.visitJsxElement(node);
  }
}
