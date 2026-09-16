import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyRequest } from "fastify/types/request.ts";
import type { FastifyReply } from "fastify/types/reply.ts";

export default fp(async (fastify) => {
  const secreto = process.env.FASTIFY_SECRET;
  if (!secreto) throw new Error("No especificaste FASTIFY_SECRET");
  fastify.register(jwt, {
    secret: secreto,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      await request.jwtVerify();
    },
  );
});
