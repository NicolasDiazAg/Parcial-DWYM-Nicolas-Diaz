import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { usuariosRepo } from "../../repositories/usuarios-repository.ts";
import { UsuarioSchema } from "../../schemas/usuarios-schema.ts";

const usuariosRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["usuarios"],
        summary: "Obtener usuarios",
        security: [{ bearerAuth: [] }],
        response: {
          200: Type.Array(UsuarioSchema),
          401: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => reply.status(200).send(await usuariosRepo.obtenerTodos()),
  );

  fastify.get(
    "/:id_usuario",
    {
      schema: {
        tags: ["usuarios"],
        summary: "Obtener usuario por ID",
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id_usuario: Type.Integer() }),
        response: {
          200: UsuarioSchema,
          401: Type.Object({ message: Type.String() }),
          404: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => reply.status(200).send(await usuariosRepo.obtenerPorId(request.params.id_usuario)),
  );
};

export default usuariosRoutes;
