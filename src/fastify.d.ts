import "fastify";
import type { FastifyRequest } from "fastify";
import type { FastifyJwtNamespace } from "@fastify/jwt";
import type { PayloadDTO } from "./schemas/usuarios-schema.ts";

declare module "fastify" {
  interface FastifyInstance extends FastifyJwtNamespace<{}> {
    authenticate(request: FastifyRequest, reply: import("fastify").FastifyReply): Promise<void>;
    checkIsAdmin(request: FastifyRequest, reply: import("fastify").FastifyReply): Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: PayloadDTO;
    user: PayloadDTO;
  }
}
