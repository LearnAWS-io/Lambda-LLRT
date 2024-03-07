import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LlrtFunction } from "cdk-lambda-llrt";
import { Construct } from "constructs";
import {
  Architecture,
  FunctionUrlAuthType,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

export class LambdaLlrtStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const llrtFn = new LlrtFunction(this, "llrt-demo-fn", {
      entry: "lambda/index.ts",
      architecture: Architecture.ARM_64,
    });

    const nodejsFn = new NodejsFunction(this, "nodejs-demo-fn", {
      entry: "lambda/index.ts",
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_20_X,
      bundling: {
        format: OutputFormat.ESM,
        minify: true,
      },
    });

    const s3Policy = new PolicyStatement({
      actions: ["s3:ListAllMyBuckets"],
      resources: ["*"],
    });

    llrtFn.addToRolePolicy(s3Policy);
    nodejsFn.addToRolePolicy(s3Policy);

    const llrtFnUrl = llrtFn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    const nodejsFnUrl = nodejsFn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "llrt-url", { value: llrtFnUrl.url });
    new CfnOutput(this, "nodejs-url", { value: nodejsFnUrl.url });
  }
}
