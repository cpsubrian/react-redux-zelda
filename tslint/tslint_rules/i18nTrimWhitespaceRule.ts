import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new I18nTrimWhitespaceWalker(sourceFile, this.getOptions())
    );
  }
}


class I18nTrimWhitespaceWalker extends StringWithinI18nFunctionWalker {
  private TRIM_WHITESPACE_MESSAGE = tsml`This string has leading or trailing
    whitespace, which is generally bad, because it may not be respected by the
    translators. Please refactor if you need this extra space for formatting
    (e.g. use a placeholder).`;

  private leadingOrTrailingWhitespaceRegex = /(^\s+)|(\s+$)/;

  public visitI18nString(node: ts.StringLiteral) {
    if (node.text.match(this.leadingOrTrailingWhitespaceRegex)) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.TRIM_WHITESPACE_MESSAGE
      ));
    }
  }
}
