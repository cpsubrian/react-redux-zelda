/**
 * Based on tslint's `no-reference` rule.
 */

import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-amd-dependency",
        description: "Disallows `/// <amd-dependency ...>` imports (use ES6-style imports instead).",
        rationale: Lint.Utils.dedent`
            Using \`/// <amd-dependency ...>\` comments to load other modules is outdated.
            Use ES6-style imports to load other modules.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };

    public static FAILURE_STRING = "<amd-dependency> is not allowed, use imports";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoAmdDependencyWalker(sourceFile, this.getOptions()));
    }
}

class NoAmdDependencyWalker extends Lint.RuleWalker {
    // It is unfortunate that TypeScript does not emit AST with AMD dependencies' position.
    // So we have to emulate what the parser does, plus calculating the positions.
    private getAmdDependencyPositions(sourceText: string) {
        // Regexp taken from TypeScript's parser
        const amdDependencyRegEx = /^\/\/\/\s*<amd-dependency\s/gim;
        const lines = sourceText.split("\n").map(s => s.trim());
        return lines
            .map((s, i) => ({s, i}))
            .filter(({s, i}) => amdDependencyRegEx.exec(s))
            .map(x => ({pos: x.i, width: x.s.length}));
    }

    public visitSourceFile(node: ts.SourceFile) {
        this.getAmdDependencyPositions(node.text).forEach(({pos, width}) => {
            this.addFailure(this.createFailure(pos, width, Rule.FAILURE_STRING));
        });
    }
}
