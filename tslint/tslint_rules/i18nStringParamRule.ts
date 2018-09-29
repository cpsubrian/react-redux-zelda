import * as ts from "typescript";
import * as Lint from "tslint";

import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    // Do not lint modules/core/i18n, because it contains the implementation of several i18n functions that call other
    // i18n functions in "non-kosher" ways (i.e. with non-string-constant parameters). This is completely okay and
    // changes to modules/core/i18n as such should not be flagged by our linter.
    if (sourceFile.fileName.match(/modules\/core\/i18n\.ts$/)) {
      return [];
    }
    const walker = new StringWithinI18nFunctionWalker(sourceFile, this.getOptions());
    walker.shouldAddParamTypeLintErrors = true;
    return this.applyWithWalker(walker);
  }
}
