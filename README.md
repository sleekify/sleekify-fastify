# <img src="https://github.com/sleekify/assets/blob/main/resources/sleekify.png" height="27"> Sleekify Fastify Integration

This project integrates [Sleekify](https://github.com/sleekify/sleekify) with [Fastify](https://fastify.dev/).
Sleekify lets you apply decorators to your resource classes to identify your REST resources and associate them with OpenAPI definitions.
This integration turns those resource classes into Fastify routes and generates your OpenAPI specification from them.
See the [Sleekify README](https://github.com/sleekify/sleekify) for an overview of the decorators and the full API reference.

## Versions

| Sleekify | Fastify | Node.js | OpenAPI Specification | TypeScript | TypeScript Config                 | Decorator Type      |
| -------- | ------- | ------- | --------------------- | ---------- | --------------------------------- | ------------------- |
| 2.0.0+   | 5.0.0+  | 24      | 3.1.1                 | 5.9+       | `"experimentalDecorators": false` | Standard ES/TC39    |
| 1.0.0+   | 5.0.0+  | 20      | 3.1.1                 | 5.0+       | `"experimentalDecorators": true`  | Legacy experimental |

Use the same major version of Sleekify and the Fastify integration.
To decide which version is right for your project, see [Choosing a Version](https://github.com/sleekify/sleekify#choosing-a-version) in the Sleekify README.

## Getting Started

1. Install Fastify, Sleekify, and the Fastify integration.
   ```bash
   npm install fastify @sleekify/sleekify @sleekify/sleekify-fastify
   ```

1. Configure your `tsconfig.json` for the decorators used by your Sleekify version.
   For 2.0.0+, make sure the legacy experimental decorators are turned off:
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": false,
       "emitDecoratorMetadata": false
     }
   }
   ```
   See [Getting Started](https://github.com/sleekify/sleekify#getting-started) in the Sleekify README for more details.

1. Create REST resources using the provided decorators.
   <br/><sub>_src/v1/users.ts_</sub>
   ```TypeScript
   import { type FastifyReply, type FastifyRequest } from 'fastify';
   import { DELETE, GET, NotFoundError, Path, POST, PUT, Schema } from '@sleekify/sleekify';

   @Path('/v1/users')
   export class UsersResource {
     @POST()
     async createOne (request: FastifyRequest, reply: FastifyReply) {
       // TODO: your create user code here
     }

     @GET()
     async getMany (request: FastifyRequest, reply: FastifyReply) {
       // TODO: your query users code here
     }
   }

   @Path({
     path: '/v1/users/{id}',
     parameters: [
       {
         $ref: '#/components/parameters/id'
       }
     ]
   })
   @Schema({
     $ref: '#/components/schemas/user'
   })
   export class UsersIdResource {
     @GET()
     async getOne (request: FastifyRequest, reply: FastifyReply) {
       const user: object | undefined = undefined; // TODO: look up the user here

       if (user === undefined) {
         throw new NotFoundError('The user was not found');
       }

       return user;
     }

     @PUT()
     async updateOne (request: FastifyRequest, reply: FastifyReply) {
       // TODO: your update user code here
     }

     @DELETE()
     async deleteOne (request: FastifyRequest, reply: FastifyReply) {
       // TODO: your delete user code here
     }
   }
   ```

1. Create your base OpenAPI specification.
   <br/><sub>_src/openapi.ts_</sub>
   ```TypeScript
   import { type OpenAPIObject } from '@sleekify/sleekify';

   export const specification: OpenAPIObject = {
     openapi: '3.1.1',
     info: {
       title: 'My API',
       version: '1.0.0'
     },
     components: {
       parameters: {
         id: {
           description: 'The identifier of the resource',
           name: 'id',
           in: 'path',
           required: true,
           schema: {
             $ref: '#/components/schemas/id'
           }
         }
       },
       schemas: {
         id: {
           description: 'The id path parameter schema',
           type: ['integer']
         },
         user: {
           type: ['object'],
           properties: {
             id: {
               type: ['number']
             },
             name: {
               type: ['string']
             }
           }
         }
       }
     }
   };
   ```

1. Register your OpenAPI specification and resources with Fastify.
   <br/><sub>_src/index.ts_</sub>
   ```TypeScript
   import Fastify from 'fastify';
   import { Annotation, Path } from '@sleekify/sleekify';
   import { Sleekify } from '@sleekify/sleekify-fastify';
   import { specification } from './openapi';

   const fastify = Fastify({
     logger: true
   });

   async function run () {
     // 1. Find all of your resource classes
     const classList = await Annotation.getClassesAnnotatedWith('./v1', Path);
     // 2. Create a Sleekify instance
     const sleekify = new Sleekify(specification, classList);

     // 3. Register Sleekify with Fastify
     await fastify.register(sleekify.getPlugin());

     fastify.listen({ port: 3000 }, function (error) {
       if (error != null) {
         fastify.log.error(error);
         process.exit(1);
       }
     });
   }

   void run();
   ```

## How It Works

### Resource Methods

Each resource method decorated with an HTTP method decorator such as `@GET` becomes a Fastify route handler.
The method receives Fastify's `request` and `reply` objects, and the value it returns is sent as the response body.
You may also use `reply` directly when you need to set headers or a custom status code.

If a resource method throws one of Sleekify's [web application errors](https://github.com/sleekify/sleekify#web-application-errors), such as `NotFoundError`, Fastify responds with the error's HTTP status code.
You may use Fastify's [`setErrorHandler`](https://fastify.dev/docs/latest/Reference/Server/#seterrorhandler) to customize how errors are serialized into responses.

### Request Validation

Routing and request validation are provided by [fastify-openapi-glue](https://github.com/seriousme/fastify-openapi-glue).
Requests are validated against the parameters and request bodies in your generated OpenAPI specification before your resource methods are called.
Any options you pass when registering the plugin are forwarded to fastify-openapi-glue:

```TypeScript
await fastify.register(sleekify.getPlugin(), {
  prefix: '/api'
});
```

### Operation IDs

Every operation needs an `operationId` to connect it to its resource method.
If you don't provide one, it's generated from the HTTP method and path in camel case.
For example, `GET /v1/users/{id}` gets the operation ID `getV1UsersId`.
You may set your own operation ID in the decorator, e.g. `@GET({ operationId: 'getUser' })`.

## API Reference

### The Sleekify Class

| Method | Description |
| - | - |
| new Sleekify(specification, classList) | Creates a new instance from your base OpenAPI specification and your resource classes. |
| getPlugin() | Gets a Fastify plugin which you can register with `fastify.register`. |
| getSpecification(options?) | Gets the generated OpenAPI specification.  Pass `{ pretty: true }` to sort the paths, components, responses, servers, and tags.  This is useful for serving your API documentation or saving it to a file. |
| getServiceHandlers() | Gets the service handlers keyed by operation ID.  This is only needed if you want to register fastify-openapi-glue yourself instead of using `getPlugin()`. |

For example, to serve your generated OpenAPI specification:

```TypeScript
const openApiDocument = sleekify.getSpecification({ pretty: true });

fastify.get('/openapi.json', async () => openApiDocument);
```

For more information on the provided decorators, OpenAPI types, and web application errors see the [Sleekify API Reference](https://github.com/sleekify/sleekify#api-reference).

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our code of conduct.

## Security

To report a security vulnerability, see [SECURITY.md](SECURITY.md).

## License

Sleekify Fastify Integration is licensed under the [Apache License 2.0](LICENSE).
