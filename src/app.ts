import * as path from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import { type FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "node:url";
import { transformarErrorPostgres, type PostgresError } from "./errors/response.errors.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {} & Partial<AutoloadPluginOptions>;
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });

  fastify.setErrorHandler((error: PostgresError, request, reply) => {
    fastify.log.info({ error });
    if (error.schema === "public") throw transformarErrorPostgres(error);
    throw error;
  });
};

export default app;
export { app, options };
