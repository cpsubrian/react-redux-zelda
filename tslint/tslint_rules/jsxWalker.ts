import * as ts from "typescript";
import * as Lint from "tslint";

/**
 * Utility class meant to be extended by more specialized JSX element walkers.
 * Provides various utility functions for getting information about a JSX element,
 * such as its tag name and attributes.
 */
export class JsxWalker extends Lint.RuleWalker {
  // ARIA roles commonly used for interactive elements (form fields, buttons, menu items, etc.)
  // when semantic HTML elements aren't used.
  private interactiveAriaRoles = ['button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'slider', 'tab', 'textbox', 'treeitem'];

  protected isJsxElement(node: ts.Node): node is ts.JsxElement {
    return node.kind === ts.SyntaxKind.JsxElement;
  }

  protected isJsxSelfClosingElement(node: ts.Node): node is ts.JsxSelfClosingElement {
    return node.kind === ts.SyntaxKind.JsxSelfClosingElement;
  }

  protected isJsxOpeningElement(node: ts.Node): node is ts.JsxOpeningElement {
    return node.kind === ts.SyntaxKind.JsxOpeningElement;
  }

  /* Checks if the provided value definitely matches any interactive ARIA roles */
  protected isInteractiveRole(role: ts.StringLiteral | ts.Expression) {
    if (role && role.kind === ts.SyntaxKind.StringLiteral) {
      return this.interactiveAriaRoles.indexOf((role as ts.StringLiteral).text) > -1;
    }
    return false;
  }

  /* Returns a map of lowercase attribute names to attributes for the given node.
     Note that this ignores any JSX spread attributes. */
  protected getAttributeMap(node: ts.Node): {[key:string]:ts.Expression} {
    let attrMap: {[attr: string]: ts.Expression} = {};
    let attributes = [];

    if(this.isJsxOpeningElement(node) || this.isJsxSelfClosingElement(node)) {
      attributes = node.attributes;
    } else if(this.isJsxElement(node)) {
      attributes = node.openingElement.attributes;
    } else {
       return null;
    }

    // TODO (stacey): Remove after tslint 5.7 is part of the drbe package
    // For backwards compatibility when we upgrade the linter, check whether attributes is
    // an array
    if (attributes.constructor !== Array) {
      attributes = attributes.properties;
    }

    attributes.forEach(attr => {
      // TODO(@cordelia): Currently this skips over attributes of type JsxSpreadAttribute,
      // so it only returns attributes of type JsxAttribute. Need to eventually support both.
      if (attr.kind === ts.SyntaxKind.JsxAttribute) {
        attr = (attr as ts.JsxAttribute);
        attrMap[attr.name.text.toLowerCase()] = attr.initializer;
      }
    });
    return attrMap;
  }

  /* Returns this element's tag name in lowercase */
  protected getTagName(node: ts.Node): string {
    if(this.isJsxOpeningElement(node) || this.isJsxSelfClosingElement(node)) {
      return node.tagName.getText().toLowerCase();
    }
    if(this.isJsxElement(node)) {
      return node.openingElement.tagName.getText().toLowerCase();
    }
    return null;
  }

}
