import Fastify from 'fastify';
import { Annotation, type OpenAPIObject, Path } from '@sleekify/sleekify';
import { Sleekify } from '@sleekify/sleekify-fastify';

const fastify = Fastify({
  logger: true
});

const specification: OpenAPIObject = {
  openapi: '3.1.1',
  info: {
    title: 'Test API',
    version: '1.0.0'
  },
  components: {}
};

async function run () {
  const classList = await Annotation.getClassesAnnotatedWith('./v1', Path);
  const sleekify = new Sleekify(specification, classList);

  await fastify.register(sleekify.getPlugin());

  fastify.listen({ port: 3001 }, function (error) {
    if (error != null) {
      fastify.log.error(error);
      process.exit(1);
    }
  });
}

void run();
