import { Components, DELETE, GET, Path, PUT, Schema } from '@sleekify/sleekify';

class OrdersIdBaseResource {
  // Test inheritance with no request body or response
  @PUT({
    requestBody: {
      content: {}
    },
    responses: {
      200: {
        description: 'Empty response',
        content: {}
      }
    }
  })
  @Schema({
    $ref: '#/components/schemas/order'
  })
  updateOne () {
    return 'putV1OrdersId';
  }
}

@Components({
  schemas: {
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
    }
  }
})
@Path('/v1/orders')
export class OrdersResource {
  // Test no operations
}

@Path({
  path: '/v1/orders/{id}',
  parameters: [
    {
      $ref: '#/components/parameters/id'
    }
  ]
})
export class OrdersIdResource extends OrdersIdBaseResource {
  // Test async method
  @GET()
  @Schema({
    $ref: '#/components/schemas/order'
  })
  async getOne () {
    return 'getV1OrdersId';
  }

  // Test no schema
  @DELETE()
  deleteOne () {
    return 'deleteV1OrdersId';
  }
}
