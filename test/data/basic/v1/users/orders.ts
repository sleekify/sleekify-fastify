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
      202: {
        description: 'Order in progress'
      }
    }
  })
  @Schema({
    $ref: '#/components/schemas/order'
  })
  createOne () {
    return 'postV1UsersIdOrders';
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/order'
    }
  })
  getMany () {
    return 'getV1UsersIdOrders';
  }
}
