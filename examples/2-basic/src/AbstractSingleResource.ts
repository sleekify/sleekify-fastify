import { BadRequestError, Components, DELETE, GET, PUT } from '@sleekify/sleekify';
import { type Repository } from './Repository';
import { type FastifyReply, type FastifyRequest } from 'fastify';

export type SingleRequest = {
  params: {
    id: number
  }
  body: {
    id: number
  }
} & FastifyRequest;

/**
 * An abstract resource for interacting with a single data item.
 */
@Components({
  parameters: {
    id: {
      description: 'The identifier of the resource',
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        $ref: '#/components/schemas/id'
      }
    }
  },
  schemas: {
    id: {
      description: 'The id path parameter schema',
      type: ['integer']
    }
  }
})
export abstract class AbstractSingleResource {
  private readonly repository: Repository;

  constructor (repository: Repository) {
    this.repository = repository;
  }

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
  async getOne (request: SingleRequest, reply: FastifyReply) {
    return await this.repository.readOne(request.params.id);
  }

  @PUT({
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
  async updateOne (request: SingleRequest, reply: FastifyReply) {
    if (request.params.id !== request.body.id) {
      throw new BadRequestError('body/id must match the id path parameter');
    }

    return await this.repository.updateOne(request.body);
  }

  @DELETE({
    responses: {
      204: {
        description: 'Successful response'
      },
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
  async deleteOne (request: SingleRequest, reply: FastifyReply) {
    await this.repository.deleteOne(request.params.id);
    void reply.code(204);
  }
}
