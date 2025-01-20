import { Components, DELETE, GET, Path, POST, PUT, Schema } from '@sleekify/sleekify';
import { Repository } from '../Repository';
import { AbstractCollectionResource } from '../AbstractCollectionResource';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { AbstractSingleResource, type SingleRequest } from '../AbstractSingleResource';

export const ordersRepository = new Repository([
  {
    id: 1,
    productId: 1,
    userId: 1,
    quantity: 1
  },
  {
    id: 2,
    productId: 2,
    userId: 2,
    quantity: 10
  },
  {
    id: 3,
    productId: 3,
    userId: 3,
    quantity: 2
  }
]);

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
export class OrdersResource extends AbstractCollectionResource {
  constructor () {
    super(ordersRepository);
  }

  @POST()
  @Schema({
    $ref: '#/components/schemas/order'
  })
  async createOne (reply: FastifyRequest, request: FastifyReply) {
    return await super.createOne(reply, request);
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/order'
    }
  })
  async getMany (reply: FastifyRequest, request: FastifyReply) {
    return await super.getMany(reply, request);
  }
}

@Path({
  path: '/v1/orders/{id}',
  parameters: [
    {
      $ref: '#/components/parameters/id'
    }
  ]
})
export class OrdersIdResource extends AbstractSingleResource {
  constructor () {
    super(ordersRepository);
  }

  @GET()
  async getOne (reply: SingleRequest, request: FastifyReply) {
    return await super.getOne(reply, request);
  }

  @PUT()
  async updateOne (reply: SingleRequest, request: FastifyReply) {
    return await super.updateOne(reply, request);
  }

  @DELETE()
  async deleteOne (reply: SingleRequest, request: FastifyReply) {
    await super.deleteOne(reply, request);
  }
}
