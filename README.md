# <img src="https://github.com/sleekify/assets/blob/main/resources/sleekify.png" height="27"> Sleekify Fastify Integration

This project's goal is to simplify the development of REST web services in NodeJS by bringing the best of the Java API for RESTful Web Services (JAX-RS) to TypeScript.
This is possible since TypeScript decorators may be used in a manner similar to Java annotations.
This project allows you to apply decorators to your resource classes to identify your REST resources and associate them with OpenAPI definitions.
This allows you to maintain your API documentation alongside your code using typed definitions.
If you ever had to maintain a large OpenAPI specification by hand, this should grab your attention.
Your API documentation will both match the OpenAPI specification's schema and be generated from your code.

## Versions

| Sleekify | Fastify | Node.js | OpenAPI Specification |
| -------- | ------- | ------- | --------------------- |
| 1.0.0+   | 5.0.0+  | 20      | 3.1.1                 |

## Getting Started

1. First, install Sleekify and the Fastify integration
   ```bash
   npm install @sleekify/sleekify
   npm install @sleekify/sleekify-fastify
   ```

2. Create REST resources using the provided decorators
   <br/><sub>_src/v1/users.ts_</sub>
   ```TypeScript
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
     async getOne () {
       // TODO: your read user code here
     }
   
     @PUT()
     async updateOne () {
       // TODO: your update user code here
     }
   
     @DELETE()
     async deleteOne () {
       // TODO: your delete user code here
     }
   }
   ```

2. Create your base OpenAPI specification
   <br/><sub>_src/openapi.ts_</sub>
   ```TypeScript
   import { OpenAPIObject } from '@sleekify/sleekify';
   
   export const specification: OpenAPIObject = {
     openapi: '3.1.1',
     info: {
       title: 'Test API',
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

4. Register your OpenAPI specification and resources with Fastify
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

## API Documentation

For more information on the provided decorators, OpenAPI types, and web application errors see the [Sleekify API Reference](https://github.com/sleekify/sleekify).