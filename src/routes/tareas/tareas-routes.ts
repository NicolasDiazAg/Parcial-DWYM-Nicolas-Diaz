import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { tareasRepo } from "../../repositories/tareas-repository.ts";
import {
	CrearTareaSchema,
	ActualizarTareaSchema,
	FinalizarTareaSchema,
	TareaSchema,
} from "../../schemas/tareas-schema.ts";

const tareasRoutes: FastifyPluginAsyncTypebox = async (
	fastify,
): Promise<void> => {
	fastify.addHook("onRequest", fastify.authenticate);

	fastify.get(
		"/",
		{
			schema: {
				tags: ["tareas"],
				summary: "Obtener tareas",
				security: [{ bearerAuth: [] }],
				response: {
					200: Type.Array(TareaSchema),
					401: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) =>
			reply.status(200).send(await tareasRepo.obtenerTodas()),
	);

	fastify.get(
		"/:id_tarea",
		{
			schema: {
				tags: ["tareas"],
				summary: "Obtener tarea por ID",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				response: {
					200: TareaSchema,
					401: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) =>
			reply
				.status(200)
				.send(await tareasRepo.obtenerPorId(request.params.id_tarea)),
	);

	fastify.post(
		"/",
		{
			onRequest: [fastify.checkIsAdmin],
			schema: {
				tags: ["tareas"],
				summary: "Crear tarea",
				security: [{ bearerAuth: [] }],
				body: CrearTareaSchema,
				response: {
					201: TareaSchema,
					401: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const tarea = await tareasRepo.crear(
				request.user.id_usuario,
				request.body,
			);
			return reply.status(201).send(tarea);
		},
	);

	fastify.put(
		"/:id_tarea",
		{
			//onRequest: [fastify.isSuperAdmin],
			//onRequest: [fastify.checkIsSelf],
			schema: {
				tags: ["tareas"],
				summary: "Actualizar tarea",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				body: ActualizarTareaSchema,
				response: {
					200: TareaSchema,
					401: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const tarea = await tareasRepo.actualizar(
				request.params.id_tarea,
				request.body,
			);
			return reply.status(200).send(tarea);
		},
	);

	fastify.patch(
		"/:id_tarea/finalizar",
		{
			schema: {
				tags: ["tareas"],
				summary: "Finalizar tarea",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				body: FinalizarTareaSchema,
				response: {
					200: TareaSchema,
					401: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
					409: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			const tarea = await tareasRepo.finalizar(
				request.params.id_tarea,
				request.body.fecha,
			);
			return reply.status(200).send(tarea);
		},
	);

	fastify.delete(
		"/:id_tarea",
		{
			schema: {
				tags: ["tareas"],
				summary: "Eliminar tarea",
				security: [{ bearerAuth: [] }],
				params: Type.Object({ id_tarea: Type.Integer() }),
				response: {
					204: Type.Null(),
					401: Type.Object({ message: Type.String() }),
					404: Type.Object({ message: Type.String() }),
				},
			},
		},
		async (request, reply) => {
			await tareasRepo.eliminar(request.params.id_tarea);
			return reply.status(204).send(null);
		},
	);
};

export default tareasRoutes;
