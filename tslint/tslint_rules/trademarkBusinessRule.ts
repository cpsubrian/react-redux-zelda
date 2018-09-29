import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';
import {StringWithinI18nFunctionWalker} from './i18nStringParamWalker';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new TrademarkWalker(sourceFile, this.getOptions()));
  }
}


class TrademarkWalker extends StringWithinI18nFunctionWalker {
  private TRADEMARK_BUSINESS_MESSAGE = tsml`Use the TRADEMARK_BUSINESS constant
    in \`modules/constants/trademark\` when referring to the name of the business
    product. Include it in your string with a placeholder, e.g.
    \`_('%(trademark_business)s').format({trademark_business:
    TRADEMARK_BUSINESS})\``;

  private DROPBOX_ENTERPRISE_MESSAGE = tsml`Use the DROPBOX_ENTERPRISE
    constant in \`modules/constants/trademark\` when referring to the name of the
    enterprise product. Include it in your string with a placeholder, e.g.
    \`_('%(dropbox_enterprise)s').format({dropbox_enterprise:
    DROPBOX_ENTERPRISE})\``;

  private trademarkBusinessRegex = /dropbox( |for| for )?business/i;

  private dropboxEnterpriseRegex = /dropbox( |for| for )?enterprise/i;

  public visitI18nString(node: ts.StringLiteral) {
    if (node.getText().match(this.trademarkBusinessRegex)) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.TRADEMARK_BUSINESS_MESSAGE
      ));
    }
    if (node.getText().match(this.dropboxEnterpriseRegex)) {
      this.addFailure(this.createFailure(
        node.getStart(), node.getWidth(), this.DROPBOX_ENTERPRISE_MESSAGE
      ));
    }
  }
}
