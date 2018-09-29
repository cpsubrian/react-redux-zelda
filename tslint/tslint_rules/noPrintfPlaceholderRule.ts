import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoPrintfPlaceholderWalker(sourceFile, this.getOptions()));
  }
}


class NoPrintfPlaceholderWalker extends StringWithinI18nFunctionWalker {
  private NO_PRINTF_PLACEHOLDER_MESSAGE = tsml`Printf-style placeholders like
    \`%s\` are deprecated. Please use named placeholders, like \`%(name)s\`,
    instead.`;

  private printfPlaceholderRegex = /%[^\(\s%sdfir]*[sdfir]/;

  public visitI18nString(node: ts.StringLiteral) {
    if (node.getText().match(this.printfPlaceholderRegex)) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.NO_PRINTF_PLACEHOLDER_MESSAGE
      ));
    }
  }
}
