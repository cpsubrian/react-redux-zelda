import * as ts from "typescript";
import * as Lint from "tslint";

const DROPBOX_TYPO_REGEX = /droopbox|drpbox|droxbox|drobox|droobox|dropbxo|dropxbo|drobpox|droppox|drobbox|dropox/i;

const WARNING_MESSAGE = 'Was this a typo of "Dropbox"? If so, please fix!';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new MisspelledDropboxWalker(sourceFile, this.getOptions()));
  }
}

class MisspelledDropboxWalker extends Lint.RuleWalker {
  public visitStringLiteral(node: ts.StringLiteral) {
    if (node.text.match(DROPBOX_TYPO_REGEX)) {
      this.addFailure(
        this.createFailure(node.getStart(), node.getWidth(), WARNING_MESSAGE)
      );
    }
    super.visitStringLiteral(node);
  }
}
