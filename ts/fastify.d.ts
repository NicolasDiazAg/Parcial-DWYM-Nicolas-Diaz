import "fastify";
import type { FastifyJwtNamespace } from "@fastify/jwt";
import type { PayloadDTO } from "./usuarios-schema.ts";

declare module "fastify" {
  interface FastifyInstance extends FastifyJwtNamespace<{
    namespace: "security";
  }> {
    /**
     * Valida que la petición incluya un token JWT válido en el header `Authorization: Bearer <token>`.
     * Decodifica el payload y lo inyecta automáticamente en `request.user`.
     * @throws {UnAuthenticatedError} Si no hay header, no empieza con 'Bearer ' o el token expiró/es inválido.
     */
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;

    //otras declaraciones de decoradores
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: PayloadDTO;
    user: PayloadDTO;
  }
}
