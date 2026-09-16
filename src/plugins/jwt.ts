import fp from "fastify-plugin";
import jwt, { type FastifyJwtNamespace } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { PayloadDTO } from "../schemas/usuarios-schema.ts";
import {
	NotAuthorizedError,
	UnAuthenticatedError,
} from "../errors/response.errors.ts";

export default fp(async (fastify) => {
	const secreto = process.env.FASTIFY_SECRET;
	if (!secreto) throw new Error("No especificaste FASTIFY_SECRET");

	await fastify.register(jwt, { secret: secreto });

	fastify.decorate(
		"authenticate",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
		},
	);

	fastify.decorate(
		"checkIsAdmin",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
			if (
				!request.user.grupos.includes("admin") &&
				!request.user.grupos.includes("superadmin")
			) {
				throw new NotAuthorizedError("");
			}
		},
	);

	fastify.decorate(
		"IsSuperAdmin",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify();
			} catch {
				throw new UnAuthenticatedError("");
			}
			if (!request.user.grupos.includes("superadmin")) {
				throw new NotAuthorizedError("");
			}
		},
	);

	fastify.decorate(
		"checkIsSelf",
		async function (
			request: FastifyRequest<{
				Params: {
					id_usuario: number;
					id_creador: number;
				};
			}>,
			reply: FastifyReply,
		) {
			const { id_usuario } = request.user;
			const id_creador = request.params.id_creador;

			if (id_usuario !== id_creador) {
				throw new NotAuthorizedError(
					"No tiene permisos para realizar esta acción sobre esta Tarea",
				);
			}
		},
	);
});

declare module "fastify" {
	interface FastifyInstance extends FastifyJwtNamespace<{}> {
		authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
		checkIsAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
		isSuperAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
		checkIsSelf(request: FastifyRequest, reply: FastifyReply): Promise<void>;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: PayloadDTO;
		user: PayloadDTO;
	}
}
