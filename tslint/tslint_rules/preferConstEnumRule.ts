/**
 * NOTE: this warning is legit only when `preserveConstEnum` is true in tsconfig.json.
 */

import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "prefer-const-enum",
        description: "Requires that enum declarations use `const` modifier.",
        rationale: Lint.Utils.dedent`
            Const enums enable potential compiler inlining and keep interoperability with
            CoffeeScript / JavaScript code when \`preserveConstEnum\` is configured to be true.`,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: ["true"],
        type: "typescript",
        typescriptOnly: true,
    };

    public static FAILURE_STRING_FACTORY = (identifier: string) => {
        return `Declare \`const enum ${identifier}\` instead of \`enum ${identifier}\` to enable potential inlining.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferConstEnumWalker(sourceFile, this.getOptions()));
    }
}

class PreferConstEnumWalker extends Lint.RuleWalker {
    public visitEnumDeclaration(decl: ts.EnumDeclaration) {
        super.visitEnumDeclaration(decl);
        if (Lint.hasModifier(decl.modifiers, ts.SyntaxKind.ConstKeyword)) {
          return;
        }
        const failureString = Rule.FAILURE_STRING_FACTORY(decl.name.text);
        this.addFailure(this.createFailure(decl.getStart(), decl.getWidth(), failureString));
    }
}
