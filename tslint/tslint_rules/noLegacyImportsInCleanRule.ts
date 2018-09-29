import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoDropboxJsImportWalker(sourceFile, this.getOptions()));
  }
}


class NoDropboxJsImportWalker extends Lint.RuleWalker {
  private NO_DROPBOX_JS_MESSAGE = tsml`Importing legacy_js AKA dropbox.js is strictly verboten!
  You should extract out only the parts you need so you don't pull in a bloated and slow 2MB
  dependency. This will make your page BLOATED and SLOW and your users will complain in the
  forums and a PLAGUE of LOCUSTS will destroy your next year's harvest. (If you are seeing this
  message, the build will fail and this diff will be blocked in the commit queue. Please take
  the time to fix your dropbox.js dependency NOW.)`;

  private NO_DIRTY_IMPORTS_MESSAGE = tsml`It is illegal for a module to import any module in
  modules/dirty while not being in modules/dirty itself. Every module in modules/clean is free of
  the transitive dependency on the dropbox bundle (legacy_js) \u2002 committing this module would
  introduce that dependency. This will make your page BLOATED and SLOW and your users will
  complain in the forums and a PLAGUE of LOCUSTS will destroy your next year's harvest. (If you
  are seeing this message, the build will fail and this diff will be blocked in the commit queue.
  Please take the time to fix your dropbox.js dependency NOW, or move this module to where it=
  belongs.)`;

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
      const importedModulePath = (node.moduleSpecifier as ts.StringLiteral).text;
      const currentModulePath = this.getSourceFile().fileName;
      if (importedModulePath === 'dropbox') {
        this.addFailure(this.createFailure(
          node.getStart(), node.getWidth(), this.NO_DROPBOX_JS_MESSAGE
        ));
      } else if (
        importedModulePath.match(/^modules\/dirty/) &&
        !currentModulePath.match(/js\/modules\/dirty/) &&
        !currentModulePath.match(/js\/tests/)
      ) {
        this.addFailure(this.createFailure(
          node.getStart(), node.getWidth(), this.NO_DIRTY_IMPORTS_MESSAGE
        ));
      }
    }
  }
}
