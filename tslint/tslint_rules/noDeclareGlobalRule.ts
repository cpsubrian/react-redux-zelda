/**
 * Ban the use of `declare global` in non-ambient-declaration TypeScript source files.
 */

import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-declare-global",
        description: "Disallows the use `declare global { ... }`",
        rationale: Lint.Utils.dedent`
            Using \`declare global { ... }\` would inject the types to the global namespace,
            infecting all TypeScript files in the project.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };

    public static FAILURE_STRING = Lint.Utils.dedent`
        \`declare global\` would pollute the global namespace.
        Consider use type cast or helper functions for local type augmentation.`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDeclareGlobalWalker(sourceFile, this.getOptions()));
    }
}

class NoDeclareGlobalWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile) {
        // Ignore all .d.ts files by returning and not walking their ASTs.
        if (node.fileName.match(/\.d\.ts$/)) {
            return;
        }
        this.walkChildren(node);
    }

    public visitModuleDeclaration(decl: ts.ModuleDeclaration) {
        super.visitModuleDeclaration(decl);

        if (decl.name.kind !== ts.SyntaxKind.Identifier || decl.name.text !== "global") {
            return;
        }

        this.addFailure(this.createFailure(decl.getStart(), decl.getWidth(), Rule.FAILURE_STRING));
    }
}
