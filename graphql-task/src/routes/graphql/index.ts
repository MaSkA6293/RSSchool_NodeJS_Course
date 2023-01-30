import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { DocumentNode, parse, Source, validate } from 'graphql/index';
import { rootSchema as schema } from './entities/schema';
import * as depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;

      let documentAST: DocumentNode;

      const DEPTH_LIMIT = 5;

      try {
        documentAST = parse(new Source(String(query)));
      } catch (syntaxError: any) {
        throw fastify.httpErrors.badRequest(syntaxError.message);
      }

      const validationErrors = validate(schema, documentAST, [
        depthLimit(DEPTH_LIMIT),
      ]);

      if (validationErrors.length > 0) {
        reply.send({ data: null, errors: validationErrors });
        return;
      }

      if (query) {
        return await graphql({
          schema,
          source: query,
          contextValue: { fastify },
          variableValues: variables,
        });
      }
    }
  );
};

export default plugin;
