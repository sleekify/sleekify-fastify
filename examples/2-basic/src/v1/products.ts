import { Components, DELETE, GET, Path, POST, PUT, Schema } from '@sleekify/sleekify';
import { AbstractCollectionResource } from '../AbstractCollectionResource';
import { AbstractSingleResource, type SingleRequest } from '../AbstractSingleResource';
import { Repository } from '../Repository';
import { type FastifyReply, type FastifyRequest } from 'fastify';

const productsRepository = new Repository([
  {
    id: 1,
    name: 'Ant Farm'
  },
  {
    id: 2,
    name: 'Balloons'
  },
  {
    id: 3,
    name: 'Cat Food'
  }
]);

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
  constructor () {
    super(productsRepository);
  }

  @POST()
  @Schema({
    $ref: '#/components/schemas/product'
  })
  async createOne (request: FastifyRequest, reply: FastifyReply) {
    return await super.createOne(request, reply);
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/product'
    }
  })
  async getMany (request: FastifyRequest, reply: FastifyReply) {
    return await super.getMany(request, reply);
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
  constructor () {
    super(productsRepository);
  }

  @GET()
  async getOne (request: SingleRequest, reply: FastifyReply) {
    return await super.getOne(request, reply);
  }

  @PUT()
  async updateOne (request: SingleRequest, reply: FastifyReply) {
    return await super.updateOne(request, reply);
  }

  @DELETE()
  async deleteOne (request: SingleRequest, reply: FastifyReply) {
    await super.deleteOne(request, reply);
  }
}
