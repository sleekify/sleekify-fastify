import { GET, Path, POST, Schema } from '@sleekify/sleekify';
import { AbstractCollectionResource } from '../../AbstractCollectionResource';

@Path({
  path: '/v1/users/{id}/orders',
  parameters: [
    {
      $ref: '#/components/parameters/id'
    }
  ]
})
export class UsersOrdersResource extends AbstractCollectionResource {
  // Test multiple success responses
  @POST({
    responses: {
      201: {
        $ref: '#/components/responses/201'
      },
      202: {
        description: 'Order in progress'
      },
    }
  })
  @Schema({
    $ref: '#/components/schemas/order'
  })
  createOne () {
    return 'postV1UsersIdOrders';
  }

  // Test a custom operation ID
  @GET({
    operationId: 'userOrdersGetOperationId',
  })
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/order'
    }
  })
  getMany () {
    return 'userOrdersGetOperationId';
  }
}
