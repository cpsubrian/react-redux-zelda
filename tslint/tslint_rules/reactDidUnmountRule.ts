import * as ts from "typescript";
import * as Lint from "tslint";

import {tsml} from './tsml';


export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ReactDidUnmountWalker(sourceFile, this.getOptions()));
  }
}


class ReactDidUnmountWalker extends Lint.RuleWalker {
  private REACT_DID_UNMOUNT_MESSAGE = tsml` \`componentDidUnmount\` is not a
  valid React lifecycle method. You probably meant \`componentWillUnmount\`.`;
  private COMPONENT_DID_UNMOUNT_NAME = 'componentDidUnmount';

  protected visitClassDeclaration(node: ts.ClassDeclaration) {
    if (this.classInheritsFromReactComponent(node)) {
      this.validateClassMethods(this.getClassMethods(node));
    }
  }

  protected visitClassExpression(node: ts.ClassExpression) {
    if (this.classInheritsFromReactComponent(node)) {
      this.validateClassMethods(this.getClassMethods(node));
    }
  }

  protected visitCallExpression(node: ts.CallExpression) {
    if (node.expression.getText() === 'React.createClass') {
      if (node.arguments.length > 0) {
        if (node.arguments[0].kind === ts.SyntaxKind.ObjectLiteralExpression) {
          const nodeArguments = node.arguments[0] as ts.ObjectLiteralExpression;
          this.validateObjectMethods(nodeArguments.properties);
        }
      }
    }
  }

  private classInheritsFromReactComponent(node: ts.ClassDeclaration | ts.ClassExpression) {
    const heritageClauses = node.heritageClauses;
    if (heritageClauses) {
      return heritageClauses.some(clause => clause.getText().indexOf("React.Component") > -1);
    }
    return false;
  }

  private getClassMethods (node: ts.ClassDeclaration | ts.ClassExpression) : ts.MethodDeclaration[] {
    if (!node.members) {
      return [];
    }
    return node.members.filter(m => m.kind === ts.SyntaxKind.MethodDeclaration) as ts.MethodDeclaration[];
  }

  private validateClassMethods (classMethods: ts.MethodDeclaration[]) {
    classMethods.forEach((classMethod: ts.MethodDeclaration) => {
      if (classMethod.name.getText() === this.COMPONENT_DID_UNMOUNT_NAME) {
        this.addFailure(this.createFailure(
          classMethod.getStart(), classMethod.getWidth(), this.REACT_DID_UNMOUNT_MESSAGE
        ));
      }
    });
  }

  private validateObjectMethods(objectProperties: ts.ObjectLiteralElement[]) {
    objectProperties.forEach((property: ts.ObjectLiteralElement) => {
      if (
        property.kind === ts.SyntaxKind.PropertyAssignment &&
        (property as ts.PropertyAssignment).initializer.kind === ts.SyntaxKind.FunctionExpression &&
        property.name.getText() === this.COMPONENT_DID_UNMOUNT_NAME
      ) {
        this.addFailure(this.createFailure(
          property.getStart(), property.getWidth(), this.REACT_DID_UNMOUNT_MESSAGE
        ));
      }
    });
  }

}
