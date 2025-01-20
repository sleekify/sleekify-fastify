import { Components, DELETE, GET, Path, POST, PUT, Schema } from '@sleekify/sleekify';
import { AbstractSingleResource } from '../AbstractSingleResource';
import { AbstractCollectionResource } from '../AbstractCollectionResource';

@Components({
  schemas: {
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
})
@Path('/v1/users')
export class UsersResource extends AbstractCollectionResource {
  @POST()
  @Schema({
    $ref: '#/components/schemas/user'
  })
  createOne () {
    return 'postV1Users';
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/user'
    }
  })
  getMany () {
    return 'getV1Users';
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
export class UsersIdResource extends AbstractSingleResource {
  @GET()
  getOne () {
    return 'getV1UsersId';
  }

  @PUT()
  updateOne () {
    return 'putV1UsersId';
  }

  @DELETE()
  deleteOne () {
    return 'deleteV1UsersId';
  }
}
