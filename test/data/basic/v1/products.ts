import { Components, DELETE, GET, Path, POST, PUT, Schema } from '@sleekify/sleekify';
import { AbstractCollectionResource } from '../AbstractCollectionResource';
import { AbstractSingleResource } from '../AbstractSingleResource';

@Components({
  schemas: {
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
    }
  }
})
@Path('/v1/products')
export class ProductsResource extends AbstractCollectionResource {
  @POST()
  @Schema({
    $ref: '#/components/schemas/product'
  })
  createOne () {
    return 'postV1Products';
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/product'
    }
  })
  getMany () {
    return 'getV1Products';
  }
}

@Path({
  path: '/v1/products/{id}',
  parameters: [
    {
      $ref: '#/components/parameters/id'
    }
  ]
})
@Schema({
  $ref: '#/components/schemas/product'
})
export class ProductsIdResource extends AbstractSingleResource {
  @GET()
  getOne () {
    return 'getV1ProductsId';
  }

  @PUT()
  updateOne () {
    return 'putV1ProductsId';
  }

  @DELETE()
  deleteOne () {
    return 'deleteV1ProductsId';
  }
}
