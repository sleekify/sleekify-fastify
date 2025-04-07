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
  async createOne (request: FastifyRequest, reply: FastifyReply) {
    return await super.createOne(request, reply);
  }

  @GET()
  @Schema({
    type: ['array'],
    items: {
      $ref: '#/components/schemas/user'
    }
  })
  async getMany (request: FastifyRequest, reply: FastifyReply) {
    return await super.getMany(request, reply);
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
