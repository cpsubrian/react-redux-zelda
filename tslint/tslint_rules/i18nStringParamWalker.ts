import * as ts from 'typescript';
import * as Lint from 'tslint';

import {tsml} from './tsml';

/**
 * This class performs a walk over all string literal nodes that will be sent
 * for translation by being passed to i18n translation functions. The visitor
 * function visitI18nString will be called once for every of these string
 * literal nodes -- subclasses may override this function to implement custom
 * linting logic on these string nodes.
 *
 * If the instance variable `shouldAddParamTypeLintErrors` is set to true, this
 * walker will also emit lint errors for malformed parameters to the i18n
 * translation functions, in cases where not enough parameters are specified or
 * non-string-literals were expected but not given. This variable is false by
 * default.
 */
export class StringWithinI18nFunctionWalker extends Lint.RuleWalker {
  private NON_STRING_LITERAL_PARAM_MESSAGE = tsml`This i18n function parameter
    was expected to be a string literal, but is instead some other sort of AST
    node. You may only pass a plain string parameter here.`;

  private MISSING_STRING_PARAM_MESSAGE = tsml`This i18n function call requires
    a string literal to be passed, and you didn\'t pass a sufficient number of
    parameters.`;

  private TEMPLATE_SUBSTITUTION_MESSAGE = tsml`ES6 template string expressions
    with variable substitution/interpolation are not allowed inside i18n
    translation functions, because it is not possible to look up translations
    for these strings in the langpack.`;

  private TAGGED_TEMPLATE_MESSAGE = tsml`ES6 template string expressions
    with tags are not allowed inside i18n translation functions, because these
    strings will not be extracted correctly to be sent for translation. If you
    need to fit a long string within our 100-char length limit lines, you can
    use a non-tagged backtick string with backslashes before the line breaks to
    suppress newline character insertion.`;

  public shouldAddParamTypeLintErrors = false;

  protected visitI18nString(node: ts.StringLiteral) {}

  protected visitCallExpression(node: ts.CallExpression) {
    const functionNameToStringParamIndexMap: Map<string, number[]> = new Map([
      ['_', [0]],
      ['N_', [0]],
      ['ungettext', [0, 1]],
      ['R_', [1]],
      ['RP_', [1, 2]],
    ]);

    const functionName: string = node.expression.getText();
    const stringParamIndices: number[] = functionNameToStringParamIndexMap.get(functionName);

    if (stringParamIndices) {
      let paramNodes: ts.Expression[] = [];

      stringParamIndices.forEach(i => {
        if (node.arguments[i]) {
          paramNodes.push(node.arguments[i]);
        } else if (this.shouldAddParamTypeLintErrors) {
          this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), this.MISSING_STRING_PARAM_MESSAGE)
          );
        }
      });

      paramNodes.forEach(paramNode => {
        if (
          paramNode.kind === ts.SyntaxKind.StringLiteral ||
          paramNode.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral
        ) {
          this.visitI18nString(paramNode as ts.StringLiteral);
        } else if (this.shouldAddParamTypeLintErrors) {
          if (paramNode.kind === ts.SyntaxKind.TemplateExpression) {
            this.addFailure(
              this.createFailure(
                paramNode.getStart(),
                paramNode.getWidth(),
                this.TEMPLATE_SUBSTITUTION_MESSAGE
              )
            );
          } else if (paramNode.kind === ts.SyntaxKind.TaggedTemplateExpression) {
            this.addFailure(
              this.createFailure(
                paramNode.getStart(),
                paramNode.getWidth(),
                this.TAGGED_TEMPLATE_MESSAGE
              )
            );
          } else {
            this.addFailure(
              this.createFailure(
                paramNode.getStart(),
                paramNode.getWidth(),
                this.NON_STRING_LITERAL_PARAM_MESSAGE
              )
            );
          }
        }
      });
    }

    super.visitCallExpression(node);
  }
}
