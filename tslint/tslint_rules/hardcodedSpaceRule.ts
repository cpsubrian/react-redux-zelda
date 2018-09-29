import * as ts from "typescript";
import * as Lint from "tslint";

const HARDCODED_SPACE_REGEX = /\b(\d+|\d{1,3}(,\d{3})*)\s*[TG]B\b/;

const TEST_FILE_PATH = /\.jest\.tsx?$/;

const WARNING_MESSAGE = 'Do not use hardcoded mentions of space. Please refer to https://paper.dropbox.com/doc/How-to-use-the-SkuContentClient-QPVPEUkflJaoP2IJjDsmZ for how to fetch space dynamically.';

// Please keep up to date with the space_linter in https://code.pp.dropbox.com/view/server/dropbox/python_linters/linters.py
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!TEST_FILE_PATH.test(sourceFile.fileName)) {
      return this.applyWithWalker(new HardcodedSpaceWalker(sourceFile, this.getOptions()));
    }
  }
}

class HardcodedSpaceWalker extends Lint.RuleWalker {
  public visitStringLiteral(node: ts.StringLiteral) {
    if (node.text.match(HARDCODED_SPACE_REGEX)) {
      this.addFailure(
        this.createFailure(node.getStart(), node.getWidth(), WARNING_MESSAGE)
      );
    }
    super.visitStringLiteral(node);
  }
}
