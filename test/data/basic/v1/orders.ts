import { Components, DELETE, GET, Path, Schema } from '@sleekify/sleekify';

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
export class OrdersIdResource {
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
