import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
} from "fs";
import { resolve, dirname } from "path";
import bundle from "@asyncapi/bundler";
import {
  TypeScriptFileGenerator,
  typeScriptDefaultEnumKeyConstraints,
  typeScriptDefaultPropertyKeyConstraints,
} from "@asyncapi/modelina";
import { load } from "js-yaml";
import { ucFirst } from "../common/runtime/utils/string/ucFirst";
import { lcFirst } from "../common/runtime/utils/string/lcFirst";
import type { ObjectStringKeyAnyValue } from "../common/runtime/types";
import { encodeValue } from "../common/runtime/utils/json/encodeValue";

const RESERVED_TYPESCRIPT_KEYWORDS = [
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "any",
  "boolean",
  "constructor",
  "declare",
  "get",
  "module",
  "require",
  "number",
  "set",
  "string",
  "symbol",
  // "type",
  "from",
  "of",
  // Strict mode reserved words
  "arguments",
  "as",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",
];

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((i) => i.isDirectory() && i.name.charAt(0) !== ".")
    .map((i) => i.name);

const schemaPath = "../../corpus-schema";
const schemaPathAbsolute = resolve(schemaPath);
const cliPathAbsolute = resolve(".");
const outputFolder = resolve("../common/runtime/api");
const outputFolderModels = resolve(outputFolder, "models");
const restSchemaName = "rest.yaml";
const wsSchemaName = "ws-asyncapi.yaml";

process.chdir(schemaPath);

const main = async () => {
  const apis = getDirectories(resolve("."))
    .filter((a) => {
      return readdirSync(resolve(a), { withFileTypes: true }).some(
        (i) => i.name === restSchemaName,
      );
    })
    .filter((d) => !["reports", "msg-sender"].includes(d));

  const fileGenerator = new TypeScriptFileGenerator({
    modelType: "interface",
    processorOptions: {
      interpreter: {
        ignoreAdditionalProperties: true,
      },
    },
    constraints: {
      propertyKey: typeScriptDefaultPropertyKeyConstraints({
        NO_RESERVED_KEYWORDS: (name) => {
          if (RESERVED_TYPESCRIPT_KEYWORDS.includes(name)) {
            throw Error(`${name} is reserver word`);
          }
          return name;
        },
      }),
      enumKey: typeScriptDefaultEnumKeyConstraints({
        NO_RESERVED_KEYWORDS: (name) => {
          if (RESERVED_TYPESCRIPT_KEYWORDS.includes(name)) {
            throw Error(`${name} is reserver word`);
          }
          return name;
        },
      }),
    },
  });

  const adminMethods: string[] = [];

  const devProxy: { [key: string]: string } = {};
  for (const api of apis) {
    let fileContent = `
    import {useApiRest} from "#runtime/composables/useApiRest"
    `;
    let importModels: string[] = [];
    process.chdir(resolve(schemaPathAbsolute, api));
    const originalSchemaFileJson = load(
      readFileSync(resolve(restSchemaName), "utf-8"),
    );

    Object.keys(originalSchemaFileJson.paths).forEach((path) => {
      const newPath = path
        .split("/")
        .map((p) => ucFirst(p))
        .join("/");
      originalSchemaFileJson.paths[newPath] =
        originalSchemaFileJson.paths[path];

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete originalSchemaFileJson.paths[path];

      for (const method in originalSchemaFileJson.paths[newPath]) {
        if (!["post", "get"].includes(method)) {
          continue;
        }

        const { operationId, responses, requestBody } =
          originalSchemaFileJson.paths[newPath][method];

        if (requestBody?.content && Object.keys(requestBody.content).length) {
          const ref =
            requestBody.content[Object.keys(requestBody.content)[0]].schema
              .$ref;

          if (ref) {
            requestBody.content[
              Object.keys(requestBody.content)[0]
            ].schema.$id = ref.split("/").slice(-1)[0];
          } else {
            requestBody.content[
              Object.keys(requestBody.content)[0]
            ].schema.$id = ucFirst(`${operationId}Request`);
          }

          requestBody.content[Object.keys(requestBody.content)[0]].schema.$id =
            requestBody.content[
              Object.keys(requestBody.content)[0]
            ].schema.$id.replace(".yaml", "");
        }

        if (
          responses?.["200"]?.content &&
          Object.keys(responses["200"]?.content).length
        ) {
          const ref =
            responses["200"].content[Object.keys(responses["200"].content)[0]]
              .schema.$ref;

          if (ref) {
            responses["200"].content[
              Object.keys(responses["200"].content)[0]
            ].schema.$id = ref.split("/").splice(-1)[0];
          } else {
            responses["200"].content[
              Object.keys(responses["200"].content)[0]
            ].schema.$id = ucFirst(`${operationId}Response`);
          }

          responses["200"].content[
            Object.keys(responses["200"].content)[0]
          ].schema.$id = responses["200"].content[
            Object.keys(responses["200"].content)[0]
          ].schema.$id.replace(".yaml", "");
        }
      }
    });

    const document = await bundle([originalSchemaFileJson], {
      referenceIntoComponents: true,
    });

    const tmpSchemaFile = `${cliPathAbsolute}/tmp/${restSchemaName}`;
    mkdirSync(dirname(tmpSchemaFile), { recursive: true });
    writeFileSync(tmpSchemaFile, document.yml());

    const documentBundled = load(readFileSync(tmpSchemaFile, "utf8"));

    if (documentBundled?.servers?.length) {
      const firstServer = documentBundled.servers[0];
      devProxy[`/api/${api}`] = firstServer.url;
    }

    const models = await fileGenerator.generateToFiles(
      documentBundled,
      outputFolderModels,
      { exportType: "named" },
    );
    console.log(`Models has been written to files 👌`);
    for (const _ of models) {
      // console.log(model.result);
    }

    // methods
    const paths = documentBundled.paths;
    for (const path in paths) {
      for (const method in paths[path]) {
        if (!["post", "get"].includes(method)) {
          continue;
        }

        const { operationId, responses, requestBody, description } =
          paths[path][method];

        let requestModelName = "";
        if (requestBody?.content && Object.keys(requestBody.content).length) {
          requestModelName =
            requestBody.content[Object.keys(requestBody.content)[0]].schema.$id;

          importModels.push(requestModelName);
        }

        let response200ModelName = "";
        if (
          responses?.["200"]?.content &&
          Object.keys(responses["200"]?.content).length
        ) {
          response200ModelName =
            responses["200"]?.content[Object.keys(responses["200"]?.content)[0]]
              .schema.$id;

          importModels.push(response200ModelName);
        }

        const methodPath = `/${api}${path
          .split("/")
          .map((p) => lcFirst(p))
          .join("/")}`;

        fileContent += `
/*
${description}
*/
                  export const ${operationId} = (
                    ${requestModelName ? `body: ${requestModelName}` : ""}
                  ) => useApiRest${response200ModelName ? `<${response200ModelName}>` : ""
          }(
                      "/api${methodPath}",
                      { method: "${method}" ${requestModelName ? ", body" : ""
          } }
                    );
                `;

        const roles = paths[path][method]["x-roles"] || [];
        if (roles.includes("admin")) {
          adminMethods.push(methodPath);
        }
      }
    }

    importModels = [...new Set(importModels)];

    const importContent = importModels
      .map((i) => `import {${i}} from "./models/${i}";`)
      .join("\n");
    fileContent = importContent + fileContent;

    writeFileSync(`${outputFolder}/${api}.ts`, fileContent);
    console.log(`REST API "${api}" has been written to file 👌`);
  }

  // WS

  //   process.chdir(resolve(schemaPathAbsolute, "websocket"));
  //   const originalSchemaFileJson = load(
  //     readFileSync(resolve(wsSchemaName), "utf-8"),
  //   );

  //   Object.keys(originalSchemaFileJson.channels).forEach((channel) => {
  //     const messages = {
  //       publish: originalSchemaFileJson.channels[channel].publish,
  //       subscribe: originalSchemaFileJson.channels[channel].subscribe,
  //     };

  //     for (const message in messages) {
  //       if (!messages[message]) {
  //         continue;
  //       }

  //       const { messageId, payload } =
  //         originalSchemaFileJson.channels[channel][message]?.message || {};

  //       if (payload?.$ref) {
  //         originalSchemaFileJson.channels[channel][message].message.messageId =
  //           payload.$ref.split("/").slice(-1)[0].replace(".yaml", "");
  //       } else if (messageId) {
  //         originalSchemaFileJson.channels[channel][message].message.payload.$id =
  //           messageId;
  //       }
  //     }
  //   });

  //   const document = await bundle([originalSchemaFileJson], {
  //     referenceIntoComponents: true,
  //   });

  //   const tmpSchemaFile = `${cliPathAbsolute}/tmp/${wsSchemaName}`;
  //   mkdirSync(dirname(tmpSchemaFile), { recursive: true });
  //   writeFileSync(tmpSchemaFile, document.yml());

  //   const documentBundled = load(readFileSync(tmpSchemaFile, "utf8"));

  //   await fileGenerator.generateToFiles(documentBundled, outputFolderModels, {
  //     exportType: "named",
  //   });

  //   const channels: ObjectStringKeyAnyValue = documentBundled.channels || {};

  //   let fileContent = `
  //     import {useApiWs} from "#runtime/composables/useApiWs"
  //     `;
  //   let importModels: string[] = [];

  //   for (const channel in channels) {
  //     let publishMessageId = channels[channel].publish?.message?.messageId;
  //     publishMessageId = publishMessageId
  //       ? ucFirst(publishMessageId)
  //       : publishMessageId;

  //     let subscribeMessageId = channels[channel].subscribe?.message?.messageId;
  //     subscribeMessageId = subscribeMessageId
  //       ? ucFirst(subscribeMessageId)
  //       : subscribeMessageId;

  //     // console.log({ channel, publishMessageId, subscribeMessageId });

  //     if (publishMessageId) {
  //       importModels.push(publishMessageId);
  //     }
  //     if (subscribeMessageId) {
  //       importModels.push(subscribeMessageId);
  //     }

  //     const wsName = channel
  //       .split("/")
  //       .map((p) => ucFirst(p))
  //       .join("");

  //     const params: string[] = [
  //       `onMessage?: (${
  //         subscribeMessageId ? `payload?: ${subscribeMessageId}` : ""
  //       }) => void | Promise<void>`,
  //       "immediately?: boolean",
  //       "noLifecycleHooks?: boolean",
  //       "onBeforeUnmountAnyway?: boolean",
  //     ];
  //     if (publishMessageId) {
  //       params.push(`request:${publishMessageId}`);
  //     }

  //     const options = `options?: {${params.join(",")}}`;

  //     fileContent += `
  //     export const useApiWs${wsName} = (${options}) => useApiWs<${
  //       publishMessageId ? publishMessageId : "undefined"
  //     },${
  //       subscribeMessageId ? subscribeMessageId : "undefined"
  //     }>("${channel}", options);
  //     `;
  //   }
  //   importModels = [...new Set(importModels)];

  //   const importContent = importModels
  //     .map((i) => `import {${i}} from "./models/${i}";`)
  //     .join("\n");
  //   fileContent = importContent + fileContent;

  //   // console.log(fileContent);
  //   writeFileSync(`${outputFolder}/ws.ts`, fileContent);
  //   console.log(`WS API has been written to file 👌`);

  // devProxy
  const devProxyFile = resolve(`${cliPathAbsolute}/../common/devProxy.ts`);
  writeFileSync(
    devProxyFile,
    `export const devProxy = ${encodeValue(devProxy)}`,
  );

  process.chdir(outputFolderModels);
  const models = readdirSync(".", { withFileTypes: true })
    .filter((i) => !i.isDirectory() && i.name.charAt(0) !== ".")
    .map((i) => i.name);

  models.forEach((modelFile) => {
    const file = readFileSync(resolve(modelFile), "utf-8");
    const hasInterface = file.search("interface ") !== -1;
    if (hasInterface) {
      const rightFile = file.replace("export { ", "export { type ");
      writeFileSync(resolve(modelFile), rightFile, "utf-8");
    }
  });

  //   try {
  //     unlinkSync(resolve(outputFolder, "frontend.ts"));
  //   } catch (e) {
  //     /* empty */
  //   }

  //   let adminMethodsEnumString = "";

  //   adminMethods.forEach((m) => {
  //     adminMethodsEnumString += `${m
  //       .split("/")
  //       .filter((i) => !!i)
  //       .map((i) => i.toUpperCase())
  //       .join("_")}="${m}",`;
  //   });

  //   // adminMethods
  //   const adminMethodsFile = resolve(
  //     `${cliPathAbsolute}/../common/runtime/api/models/AdminMethods.ts`,
  //   );
  //   writeFileSync(
  //     adminMethodsFile,
  //     `enum AdminMethods {
  //     ${adminMethodsEnumString}
  // };
  // export { AdminMethods };`,
  //   );
};

main();
