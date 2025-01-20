import { Components, DELETE, GET, PUT } from '@sleekify/sleekify';

/**
 * An abstract resource for interacting with a single data item.
 */
@Components({
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
    }
  }
})
export abstract class AbstractSingleResource {
  @GET({
    responses: {
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
    }
  })
  getOne () {}

  @PUT({
    responses: {
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
    }
  })
  updateOne () {}

  @DELETE({
    responses: {
      204: {
        description: 'Successful response'
      },
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
    }
  })
  deleteOne () {}
}
