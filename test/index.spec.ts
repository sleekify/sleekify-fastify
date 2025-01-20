import { Annotation, type OpenAPIObject, Path } from '@sleekify/sleekify';
import _ from 'lodash';
import { Sleekify } from '../src';
import Fastify from 'fastify';

describe('sleekify', () => {
  describe('getPlugin', () => {
    it('When accessing the Fastify plugin, the plugin can be registered', async () => {
      // Given
      const { specification } = await import('./data/basic/openapi');
      const classArray = await Annotation.getClassesAnnotatedWith('./data', Path);
      const sleekify = new Sleekify(specification, classArray);
      const fastify = Fastify({
        logger: false
      });

      // When
      const result1 = sleekify.getPlugin();

      // Then
      expect(typeof (result1)).toBe('function');

      // When
      const result2 = sleekify.getPlugin();

      // Then
      expect(result1).toBe(result2);

      // Expect
      await fastify.register(result1);
    });
  });

  describe('getSpecification', () => {
    it('When accessing the OpenAPI specification, it contains the annotated resource metadata', async () => {
      // Given
      const { specification } = await import('./data/basic/openapi');
      const classArray = await Annotation.getClassesAnnotatedWith('./data', Path);
      const responses = {
        400: {
          $ref: '#/components/responses/400'
        },
        401: {
          $ref: '#/components/responses/401'
        },
        403: {
          $ref: '#/components/responses/403'
        },
        404: {
          $ref: '#/components/responses/404'
        },
        500: {
          $ref: '#/components/responses/500'
        }
      };
      const annotatedComponents = {
        parameters: {
          id: {
            description: 'The identifier of the resource',
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              $ref: '#/components/schemas/id'
            }
          }
        },
        schemas: {
          id: {
            description: 'The id path parameter schema',
            type: [
              'integer'
            ]
          },
          order: {
            type: ['object'],
            properties: {
              id: {
                type: ['number']
              },
              productId: {
                type: ['number']
              },
              userId: {
                type: ['number']
              },
              quantity: {
                type: ['number']
              }
            }
          },
          product: {
            type: ['object'],
            properties: {
              id: {
                type: ['number']
              },
              name: {
                type: ['string']
              }
            }
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
      };
      const getCollectionContent = (reference: string) => {
        return {
          'application/json': {
            schema: {
              items: {
                $ref: reference
              },
              type: ['array']
            }
          }
        };
      };
      const getSingleContent = (reference: string) => {
        return {
          'application/json': {
            schema: {
              $ref: reference
            }
          }
        };
      };
      const annotatedPaths = {
        '/v1/orders/{id}': {
          delete: {
            operationId: 'deleteV1OrdersId'
          },
          get: {
            operationId: 'getV1OrdersId',
            responses: {
              200: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/order')
              }
            }
          },
          parameters: [
            {
              $ref: '#/components/parameters/id'
            }
          ]
        },
        '/v1/products': {
          get: {
            operationId: 'getV1Products',
            responses: {
              200: {
                description: 'Successful response',
                content: getCollectionContent('#/components/schemas/product')
              },
              ...responses
            }
          },
          post: {
            operationId: 'postV1Products',
            requestBody: {
              content: getSingleContent('#/components/schemas/product')
            },
            responses: {
              201: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/product')
              },
              ...responses
            }
          }
        },
        '/v1/products/{id}': {
          delete: {
            operationId: 'deleteV1ProductsId',
            responses: {
              204: {
                description: 'Successful response'
              },
              ...responses
            }
          },
          get: {
            operationId: 'getV1ProductsId',
            responses: {
              200: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/product')
              },
              ...responses
            }
          },
          parameters: [
            {
              $ref: '#/components/parameters/id'
            }
          ],
          put: {
            operationId: 'putV1ProductsId',
            requestBody: {
              content: getSingleContent('#/components/schemas/product')
            },
            responses: {
              200: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/product')
              },
              ...responses
            }
          }
        },
        '/v1/users': {
          get: {
            operationId: 'getV1Users',
            responses: {
              200: {
                description: 'Successful response',
                content: getCollectionContent('#/components/schemas/user')
              },
              ...responses
            }
          },
          post: {
            operationId: 'postV1Users',
            requestBody: {
              content: getSingleContent('#/components/schemas/user')
            },
            responses: {
              201: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/user')
              },
              ...responses
            }
          }
        },
        '/v1/users/{id}': {
          delete: {
            operationId: 'deleteV1UsersId',
            responses: {
              204: {
                description: 'Successful response'
              },
              ...responses
            }
          },
          get: {
            operationId: 'getV1UsersId',
            responses: {
              200: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/user')
              },
              ...responses
            }
          },
          parameters: [
            {
              $ref: '#/components/parameters/id'
            }
          ],
          put: {
            operationId: 'putV1UsersId',
            requestBody: {
              content: getSingleContent('#/components/schemas/user')
            },
            responses: {
              200: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/user')
              },
              ...responses
            }
          }
        },
        '/v1/users/{id}/orders': {
          get: {
            operationId: 'getV1UsersIdOrders',
            responses: {
              200: {
                description: 'Successful response',
                content: getCollectionContent('#/components/schemas/order')
              },
              ...responses
            }
          },
          parameters: [
            {
              $ref: '#/components/parameters/id'
            }
          ],
          post: {
            operationId: 'postV1UsersIdOrders',
            requestBody: {
              content: getSingleContent('#/components/schemas/order')
            },
            responses: {
              201: {
                description: 'Successful response',
                content: getSingleContent('#/components/schemas/order')
              },
              202: {
                description: 'Order in progress'
              },
              ...responses
            }
          }
        }
      };

      // When
      const sleekify1 = new Sleekify(specification, classArray);
      const result1 = sleekify1.getSpecification();

      // Then
      expect(result1).toStrictEqual({
        ...specification,
        components: {
          ...specification.components,
          ...annotatedComponents
        },
        paths: annotatedPaths
      });

      // When
      const specificationWithoutComponents = _.omit(specification, 'components');
      const sleekify2 = new Sleekify(specificationWithoutComponents as any, classArray);
      const result2 = sleekify2.getSpecification();

      // Then
      expect(result2).toStrictEqual({
        ...specificationWithoutComponents,
        components: {
          ...annotatedComponents
        },
        paths: annotatedPaths
      });
    });

    it('When accessing the OpenAPI specification with the pretty option, then its data is sorted', async () => {
      // Given
      const specification: OpenAPIObject = {
        openapi: '3.1.1',
        info: {
          title: 'my title',
          version: '1.0.0'
        },
        paths: {
          '/users': {},
          '/products': {}
        },
        webhooks: {
          webhook2: {},
          webhook1: {}
        },
        components: {
          securitySchemes: {
            securityScheme2: {
              type: 'http',
              scheme: 'basic'
            },
            securityScheme1: {
              type: 'http',
              scheme: 'basic'
            }
          },
          schemas: {
            schema2: {},
            schema1: {}
          },
          responses: {
            201: {
              description: '201'
            },
            200: {
              description: '200'
            }
          },
          requestBodies: {
            requestBody2: {},
            requestBody1: {}
          },
          pathItems: {
            pathItem2: {},
            pathItem1: {}
          },
          parameters: {
            parameter2: {
              name: 'parameter2',
              in: 'query'
            },
            parameter1: {
              name: 'parameter1',
              in: 'query'
            }
          },
          links: {
            link2: {},
            link1: {}
          },
          examples: {
            example2: {},
            example1: {}
          },
          callbacks: {
            callback2: {},
            callback1: {}
          }
        }
      };

      // When
      const sleekify = new Sleekify(specification, []);
      const result = sleekify.getSpecification({ pretty: true });

      // Then
      expect(Object.keys(result.paths ?? {})).toStrictEqual(['/products', '/users']);
      expect(Object.keys(result.webhooks ?? {})).toStrictEqual(['webhook1', 'webhook2']);
      expect(Object.keys(result.components ?? {})).toStrictEqual([
        'callbacks',
        'examples',
        'links',
        'parameters',
        'pathItems',
        'requestBodies',
        'responses',
        'schemas',
        'securitySchemes'
      ]);
      expect(Object.keys(result.components?.callbacks ?? {})).toStrictEqual(['callback1', 'callback2']);
      expect(Object.keys(result.components?.examples ?? {})).toStrictEqual(['example1', 'example2']);
      expect(Object.keys(result.components?.links ?? {})).toStrictEqual(['link1', 'link2']);
      expect(Object.keys(result.components?.parameters ?? {})).toStrictEqual(['parameter1', 'parameter2']);
      expect(Object.keys(result.components?.pathItems ?? {})).toStrictEqual(['pathItem1', 'pathItem2']);
      expect(Object.keys(result.components?.requestBodies ?? {})).toStrictEqual(['requestBody1', 'requestBody2']);
      expect(Object.keys(result.components?.responses ?? {})).toStrictEqual(['200', '201']);
      expect(Object.keys(result.components?.schemas ?? {})).toStrictEqual(['schema1', 'schema2']);
      expect(Object.keys(result.components?.securitySchemes ?? {})).toStrictEqual(['securityScheme1', 'securityScheme2']);
    });

    it('When accessing the OpenAPI specification with the pretty option, then missing paths are not sorted', async () => {
      // Given
      const specification: OpenAPIObject = {
        openapi: '3.1.1',
        info: {
          title: 'my title',
          version: '1.0.0'
        }
      };

      // When
      const sleekify = new Sleekify(specification, []);
      const result = sleekify.getSpecification({ pretty: true });

      // Then
      expect(result).toStrictEqual(specification);
    });
  });

  describe('getServiceHandlers', () => {
    it('When accessing the service handlers, those handlers reference the annotated resources', async () => {
      // Given
      const { specification } = await import('./data/basic/openapi');
      const classArray = await Annotation.getClassesAnnotatedWith('./data', Path);
      const sleekify = new Sleekify(specification, classArray);

      // When
      const result = sleekify.getServiceHandlers();

      // Then
      expect(Object.keys(result).sort()).toStrictEqual([
        'deleteV1OrdersId',
        'deleteV1ProductsId',
        'deleteV1UsersId',
        'getV1OrdersId',
        'getV1Products',
        'getV1ProductsId',
        'getV1Users',
        'getV1UsersId',
        'getV1UsersIdOrders',
        'postV1Products',
        'postV1Users',
        'postV1UsersIdOrders',
        'putV1ProductsId',
        'putV1UsersId'
      ]);
      expect(Object.values(result).every((v: any) => typeof (v) === 'function')).toBe(true);
      for (const operationId in result) {
        const handler: any = result[operationId];

        expect(await handler()).toBe(operationId);
      }
    });
  });
});
