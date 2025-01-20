import { GET, Path, Schema } from '@sleekify/sleekify';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { usersRepository } from '../users';
import { ordersRepository } from '../orders';

type UserOrdersRequest = {
  params: {
    id: number
  }
} & FastifyRequest;

@Path({
  path: '/v1/users/{id}/orders',
  parameters: [
    {
      $ref: '#/components/parameters/id'
    }
  ]
})
export class UsersOrdersResource {
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
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/order'
    }
  })
  async getMany (request: UserOrdersRequest, reply: FastifyReply) {
    const user = await usersRepository.readOne(request.params.id);
    const orderArray = await ordersRepository.readAll();

    return orderArray.filter(o => o.id === user.id);
  }
}
