import { GET, POST } from '@sleekify/sleekify';
import { type Repository } from './Repository';
import { type FastifyReply, type FastifyRequest } from 'fastify';

/**
 * An abstract REST resource for interacting with a collection of data.
 */
export abstract class AbstractCollectionResource {
  private readonly repository: Repository;

  constructor (repository: Repository) {
    this.repository = repository;
  }

  @POST({
    responses: {
      201: {
        description: 'Successful response',
        headers: {
          location: {
            schema: {
              type: 'string',
              format: 'uri'
            }
          }
        }
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
  async createOne (request: FastifyRequest, reply: FastifyReply) {
    const data = await this.repository.createOne(request.body);

    void reply.code(201);
    void reply.header('location', `http://localhost:3002${request.url}/${data.id}`);
    return data;
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
  async getMany (request: FastifyRequest, reply: FastifyReply) {
    return await this.repository.readAll();
  }
}
