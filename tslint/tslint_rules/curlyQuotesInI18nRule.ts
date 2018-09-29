import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CurlyQuotesWalker(sourceFile, this.getOptions()));
  }
}


class CurlyQuotesWalker extends StringWithinI18nFunctionWalker {
  private SINGLE_QUOTE_MESSAGE = tsml`The straight quote character \' is not
    recommended in user-facing strings. If you are using it as a quotation mark,
    e.g. \'hello\', use the left curly single quote character \\u2018 (\u2018)
    on the left side, and the right curly single quote character \\u2019
    (\u2019) on the right side. If you are using it in an English contraction,
    e.g. isn\'t, use the right curly single quote character \\u2019 (\u2019)
    instead.`;

  private DOUBLE_QUOTE_MESSAGE = tsml`The straight double quote character \" is
    not recommended in user-facing strings. For quotations, e.g. \"hello\", use
    the left curly double quote character \\u201c (\u201c) on the left side, and
    the right curly double quote character \\u201d (\u201d) on the right side.`;

  public visitI18nString(node: ts.StringLiteral) {
    if (node.text.indexOf('\'') > -1) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.SINGLE_QUOTE_MESSAGE
      ));
    }

    if (node.text.indexOf('"') > -1) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.DOUBLE_QUOTE_MESSAGE
      ));
    }
  }
}

