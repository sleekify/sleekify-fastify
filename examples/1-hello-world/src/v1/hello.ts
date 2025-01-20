import { type FastifyReply, type FastifyRequest } from 'fastify';
import { GET, Path } from '@sleekify/sleekify';

type HelloRequest = FastifyRequest & {
  params: {
    name: string
  }
};

@Path({
  path: '/v1/hello/{name}',
  parameters: [
    {
      description: 'The name',
      name: 'name',
      in: 'path',
      required: true,
      schema: {
        type: 'string'
      }
    }
  ]
})
export class HelloResource {
  @GET({
    responses: {
      200: {
        description: 'The hello world message',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      }
    }
  })
  getMessage (request: HelloRequest, reply: FastifyReply) {
    return {
      message: `hello ${request.params.name ?? 'world'}!`
    };
  }
}
