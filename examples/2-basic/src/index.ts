import Fastify from 'fastify';
import { Annotation, Path } from '@sleekify/sleekify';
import { Sleekify } from '@sleekify/sleekify-fastify';
import { specification } from './openapi';

const fastify = Fastify({
  logger: true
});

async function run () {
  const classList = await Annotation.getClassesAnnotatedWith('./v1', Path);
  const sleekify = new Sleekify(specification, classList);

  await fastify.register(sleekify.getPlugin());

  fastify.listen({ port: 3002 }, function (error) {
    if (error != null) {
      fastify.log.error(error);
      process.exit(1);
    }
  });
}

void run();
