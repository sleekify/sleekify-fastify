import { type FastifyReply, type FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { Annotation, Components, type ComponentsObject, Consumes, DELETE, GET, HEAD, type MediaTypeObject, type OpenAPIObject, type OperationObject, OPTIONS, PATCH, Path, type PathItemObject, POST, Produces, PUT, type ReferenceObject, type RequestBodyObject, type ResponseObject, Schema, TRACE } from '@sleekify/sleekify';
import { dynamicImport } from 'tsimportlib';
import _ from 'lodash';

const methodMapArray = [
  {
    decorator: DELETE,
    key: 'delete'
  },
  {
    decorator: GET,
    key: 'get'
  },
  {
    decorator: HEAD,
    key: 'head'
  },
  {
    decorator: OPTIONS,
    key: 'options'
  },
  {
    decorator: PATCH,
    key: 'patch'
  },
  {
    decorator: POST,
    key: 'post'
  },
  {
    decorator: PUT,
    key: 'put'
  },
  {
    decorator: TRACE,
    key: 'trace'
  }
] as const;

/**
 * This class provides the Sleekify integration for Fastify.
 */
export class Sleekify {
  private readonly classArray: Array<new (...args: any[]) => any>;
  private readonly specification: OpenAPIObject;
  private serviceHandlers?: Record<string, (request: FastifyRequest, reply: FastifyReply) => Promise<any>>;
  private plugin?: any;

  /**
   * Creates a new Sleekify instance.
   *
   * @param specification The OpenAPI base specification
   * @param classArray The resource classes to include in the OpenAPI specification
   */
  constructor (specification: OpenAPIObject, classArray: any[]) {
    this.classArray = classArray;
    this.specification = JSON.parse(JSON.stringify(specification));
  }

  /**
   * Get a Fastify plugin which you can register.
   */
  getPlugin (): (fastify: any, options: any) => Promise<any> {
    this.initialize();

    if (this.plugin !== undefined) {
      return this.plugin;
    }

    const plugin = async (fastify: any, options: any): Promise<void> => {
      /* This is an ES module so we must import it dynamically */
      const { fastifyOpenapiGlue } = (await dynamicImport('fastify-openapi-glue', module));

      await fastifyOpenapiGlue(fastify, {
        ...options,
        specification: this.getSpecification(),
        serviceHandlers: this.serviceHandlers
      });
    };

    this.plugin = fastifyPlugin(plugin, {
      fastify: '>=4.0.0',
      name: '@sleekify/sleekify-fastify'
    });

    return this.plugin;
  }

  /**
   * Get the OpenAPI specification which may be passed to Fastify OpenAPI glue.
   * @param options The options
   * @param options.pretty Sort the specification path's etc.
   */
  getSpecification (options?: { pretty?: boolean }): OpenAPIObject {
    this.initialize();

    const result = JSON.parse(JSON.stringify(this.specification));

    if (options?.pretty === true) {
      this.sortObject(result, 'paths');
      this.sortObject(result, 'webhooks');
      this.sortObject(result, 'components');

      const components = [
        'callbacks',
        'examples',
        'links',
        'parameters',
        'pathItems',
        'requestBodies',
        'responses',
        'schemas',
        'securitySchemes'
      ];

      for (const key of components) {
        this.sortObject(result, `components.${key}`);
      }
    }

    return result;
  }

  /**
   * Get the service handlers which may be passed to Fastify OpenAPI glue.
   */
  getServiceHandlers (): Record<string, (request: FastifyRequest, reply: FastifyReply) => Promise<any>> {
    this.initialize();

    return this.serviceHandlers!;
  }

  private initialize (): void {
    if (this.serviceHandlers !== undefined) {
      /* already initialized */
      return;
    }

    this.serviceHandlers = {};

    for (const clazz of this.classArray) {
      const Clazz = clazz;
      const classInstance = new Clazz();
      const componentsObject: ComponentsObject | undefined = Annotation.get(clazz, undefined, Components);
      const pathItemObject: PathItemObject | undefined = Annotation.get(clazz, undefined, Path);

      if (componentsObject !== undefined) {
        this.addComponents(clazz, componentsObject);
      }

      if (pathItemObject !== undefined) {
        this.addServiceHandlers(clazz, classInstance, pathItemObject);
      }
    }

    // TODO - sort specification?
  }

  private addComponents (clazz: new (...args: any[]) => any, componentsObject: ComponentsObject): void {
    if (this.specification.components === undefined) {
      this.specification.components = {};
    }

    const propertyNameArray: ReadonlyArray<keyof ComponentsObject> = [
      'schemas',
      'responses',
      'parameters',
      'examples',
      'requestBodies',
      'headers',
      'securitySchemes',
      'links',
      'callbacks',
      'pathItems'
    ] as const;

    for (const propertyName of propertyNameArray) {
      if (componentsObject[propertyName] === undefined) {
        continue;
      }

      let componentsSection = this.specification.components[propertyName];

      if (componentsSection === undefined) {
        componentsSection = this.specification.components[propertyName] = {};
      }

      Object.assign(componentsSection, componentsObject[propertyName]);
    }
  }

  private addPath (path: string, pathItemObject: PathItemObject, operationMap: Record<string, OperationObject>): void {
    if (_.isEmpty(operationMap)) {
      return;
    }

    if (this.specification.paths === undefined) {
      this.specification.paths = {};
    }

    if (this.specification.paths[path] === undefined) {
      this.specification.paths[path] = {
        ..._.omit(pathItemObject, 'path'),
        ...operationMap
      };
    }
  }

  private addRequestBody (operationObject: OperationObject, resolvedConsumes: string[], resolvedSchema: any): void {
    if (operationObject.requestBody === undefined) {
      operationObject.requestBody = {};
    }

    const referenceObject = operationObject.requestBody as ReferenceObject;
    const requestBody: Exclude<RequestBodyObject, ReferenceObject> = operationObject.requestBody;

    if (referenceObject.$ref === undefined && requestBody.content === undefined) {
      operationObject.requestBody = {
        content: resolvedConsumes.reduce((content: Record<string, MediaTypeObject>, mediaType) => {
          content[mediaType] = {
            schema: resolvedSchema
          };
          return content;
        }, {})
      };
    }
  }

  private addResponses (operationObject: OperationObject, resolvedProduces: string[], resolvedSchema: any, resolvedStatusCodes: number[]): void {
    if (resolvedStatusCodes.length === 0) {
      return;
    }

    if (operationObject.responses === undefined) {
      operationObject.responses = {};
    }

    for (const resolvedStatusCode of resolvedStatusCodes) {
      if (operationObject.responses[resolvedStatusCode] === undefined) {
        /* add a new response object */
        operationObject.responses[resolvedStatusCode] = {
          description: 'Successful response',
          content: resolvedProduces.reduce((content: Record<string, MediaTypeObject>, mediaType) => {
            content[mediaType] = {
              schema: resolvedSchema
            };
            return content;
          }, {})
        };
      } else {
        const referenceOrResponse: any = operationObject.responses[resolvedStatusCode];

        if (referenceOrResponse.$ref === undefined && referenceOrResponse.content === undefined) {
          const responseObject = operationObject.responses[resolvedStatusCode] as Exclude<ResponseObject, ReferenceObject>;

          /* add content to an existing response object */
          responseObject.content = resolvedProduces.reduce((content: Record<string, MediaTypeObject>, mediaType) => {
            content[mediaType] = {
              schema: resolvedSchema
            };
            return content;
          }, {});
        }
      }
    }
  }

  private addSchemas (clazz: new (...args: any[]) => any, propertyName: string, operationObject: OperationObject, methodKey: string): void {
    const classConsumes = Annotation.get(clazz, undefined, Consumes);
    const classProduces = Annotation.get(clazz, undefined, Produces);
    const classSchema = Annotation.get(clazz, undefined, Schema);
    const methodConsumes = Annotation.get(clazz, propertyName, Consumes);
    const methodProduces = Annotation.get(clazz, propertyName, Produces);
    const methodSchema = Annotation.get(clazz, propertyName, Schema);
    const resolvedConsumes: string[] = methodConsumes ?? classConsumes ?? ['application/json'];
    const resolvedProduces: string[] = methodProduces ?? classProduces ?? ['application/json'];
    const resolvedSchema = methodSchema ?? classSchema;

    if (resolvedSchema === undefined) {
      return;
    }

    if (['patch', 'post', 'put'].includes(methodKey)) {
      this.addRequestBody(operationObject, resolvedConsumes, resolvedSchema);
    }

    const resolvedStatusCodes = this.getSuccessStatusCodes(operationObject);

    this.addResponses(operationObject, resolvedProduces, resolvedSchema, resolvedStatusCodes);
  }

  private addServiceHandlers (clazz: new (...args: any[]) => any, classInstance: Record<string, any>, pathItemObject: PathItemObject): void {
    const path = (pathItemObject as any).path;
    const operationMap: Record<string, OperationObject> = {};

    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(classInstance))) {
      const propertyValue = classInstance[propertyName];
      if (['constructor', 'function'].includes(propertyName) || !_.isFunction(propertyValue)) {
        continue;
      }

      for (const methodMap of methodMapArray) {
        const decorator = methodMap.decorator;

        if (!Annotation.exists(clazz, propertyName, decorator)) {
          continue;
        }

        const methodKey = methodMap.key;
        const operationObject = _.cloneDeep(Annotation.get(clazz, propertyName, decorator) ?? {});

        operationMap[methodKey] = operationObject;

        if (operationObject.operationId === undefined) {
          operationObject.operationId = _.camelCase(`${methodKey}${path}`.replace(/\//g, '_').replace(/{/g, '').replace(/}/g, ''));
        }

        this.addSchemas(clazz, propertyName, operationObject, methodKey);

        this.serviceHandlers![operationObject.operationId] = async (request: FastifyRequest, reply: FastifyReply) => {
          const result = classInstance[propertyName](request, reply);

          return result instanceof Promise ? await result : result;
        };
      }
    }

    this.addPath(path, pathItemObject, operationMap);
  }

  private getSuccessStatusCodes (operationObject: OperationObject): number[] {
    const successStatusCodes: number[] = [];

    if (operationObject.responses !== undefined) {
      for (const responseKey in operationObject.responses) {
        const statusCode = Number.parseInt(responseKey);

        if (!Number.isNaN(statusCode) && statusCode >= 200 && statusCode < 300) {
          successStatusCodes.push(statusCode);
        }
      }
    }

    const resolvedStatusCodes: number[] = [];

    if (successStatusCodes.length > 0) {
      for (const statusCode of [200, 201]) {
        if (successStatusCodes.includes(statusCode)) {
          resolvedStatusCodes.push(statusCode);
        }
      }
    } else {
      resolvedStatusCodes.push(200);
    }

    return resolvedStatusCodes;
  }

  private sortObject (root: Record<string, any>, path: string): void {
    const object = _.get(root, path);

    if (object === undefined) {
      return;
    }

    const result: Record<string, any> = {};
    const sortedKeys = Object.keys(object).sort();

    for (const key of sortedKeys) {
      result[key] = object[key];
    }

    _.set(root, path, result);
  }
}
