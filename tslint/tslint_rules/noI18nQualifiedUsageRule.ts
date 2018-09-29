import * as ts from "typescript";
import * as Lint from "tslint";

import { tsml } from "./tsml";

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoI18nQualifiedUsageWalker(sourceFile, this.getOptions())
    );
  }
}

class NoI18nQualifiedUsageWalker extends Lint.RuleWalker {
  private NO_I18N_QUALIFIED_USAGE_MESSAGE = tsml`I18n functions cannot be
    imported and used in a "qualified" style, i.e. the function called is a
    property access on the i18n module object. For example, you may not \`import
    * as I18n from 'modules/core/i18n'; I18n._('my string')\`. The TypeScript
    i18n string extractor will not extract these strings. Instead, please use
    destructuring import syntax: \`import {_} from 'modules/core/i18n'; _('my
    string')\`.`;

  private isQualifiedI18nFunctionNode(
    node: ts.PropertyAccessExpression
  ): boolean {
    const i18nFunctions = ["_", "N_", "ungettext", "R_", "RP_"];
    return i18nFunctions.indexOf(node.name.text) > -1;
  }

  protected visitCallExpression(node: ts.CallExpression) {
    // Don't give any lint warnings unless the function expression is a property
    // access expression, because the problematic qualified usages are all
    // function calls with `PropertyAccessExpression`s in the TS AST. If
    // node.expression.kind is a regular `Identifier`, it's likely to be valid.
    if (node.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
      return;
    }

    if (
      this.isQualifiedI18nFunctionNode(
        node.expression as ts.PropertyAccessExpression
      )
    ) {
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          this.NO_I18N_QUALIFIED_USAGE_MESSAGE
        )
      );
    }
  }
}
