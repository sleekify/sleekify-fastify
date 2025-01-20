import { Components, DELETE, GET, Path, POST, PUT, Schema } from '@sleekify/sleekify';
import { AbstractSingleResource, type SingleRequest } from '../AbstractSingleResource';
import { AbstractCollectionResource } from '../AbstractCollectionResource';
import { Repository } from '../Repository';
import { type FastifyReply, type FastifyRequest } from 'fastify';

export const usersRepository = new Repository([
  {
    id: 1,
    name: 'Abby'
  },
  {
    id: 2,
    name: 'Brandon'
  },
  {
    id: 3,
    name: 'Carl'
  }
]);

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
  constructor () {
    super(usersRepository);
  }

  @POST()
  @Schema({
    $ref: '#/components/schemas/user'
  })
  async createOne (reply: FastifyRequest, request: FastifyReply) {
    return await super.createOne(reply, request);
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/user'
    }
  })
  async getMany (reply: FastifyRequest, request: FastifyReply) {
    return await super.getMany(reply, request);
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
  constructor () {
    super(usersRepository);
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
