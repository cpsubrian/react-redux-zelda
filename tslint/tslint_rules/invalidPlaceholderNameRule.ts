import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new InvalidPlaceholderNameWalker(sourceFile, this.getOptions())
    );
  }
}


class InvalidPlaceholderNameWalker extends StringWithinI18nFunctionWalker {
  private INVALID_PLACEHOLDER_NAME_MESSAGE = tsml`Placeholder names can only
    contain lowercase letters, digits, and underscores, i.e. you must use
    snake_case instead of camelCase for placeholder names.`;

  private INVALID_PLACEHOLDER_SUFFIX_MESSAGE = tsml`This placeholder is either
    lacking a suffix or has an invalid suffix. Named placeholders for use with
    String.prototype.format must be of the form \`%(placeholder_name)s\` for
    strings, \`%(placeholder_name)d\` for integers, or \`%(placeholder_name)f\`
    for floats, i.e. the only valid suffixes are s, d, and f.`;

  private allNamedPlaceholderRegex = /%\(([^\)]*)\)[sdf]/g;

  private validPlaceholderNameRegex = /^[a-z0-9_]+$/;

  private invalidNamedPlaceholderSuffixRegex = /%\([^\)]*\)([^sdf]|$)/;

  public visitI18nString(node: ts.StringLiteral) {
    if (node.getText().match(this.invalidNamedPlaceholderSuffixRegex)) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.INVALID_PLACEHOLDER_SUFFIX_MESSAGE
      ));
    }
    let match = this.allNamedPlaceholderRegex.exec(node.getText());
    while (match != null) {
      const placeholderName = match[1];
      if (!placeholderName.match(this.validPlaceholderNameRegex)) {
        this.addFailure(this.createFailure(
          node.getStart(), node.getWidth(), this.INVALID_PLACEHOLDER_NAME_MESSAGE
        ));
      }
      match = this.allNamedPlaceholderRegex.exec(node.getText());
    }
  }
}
