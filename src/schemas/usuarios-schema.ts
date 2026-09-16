import { Type, type Static } from "@sinclair/typebox";

export const GrupoSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("admin"),
	Type.Literal("superadmin"),
]);

export const UsuarioSchema = Type.Object({
	id_usuario: Type.Integer(),
	username: Type.String({ minLength: 3, maxLength: 30 }),
	nombres: Type.String(),
	apellidos: Type.String(),
	fecha_nacimiento: Type.String({ format: "date" }),
	nombre_completo: Type.String(),
	grupos: Type.Array(GrupoSchema, { minItems: 1 }),
	activo: Type.Boolean(),
});

export const CrearUsuarioSchema = Type.Object({
	username: Type.String({ minLength: 3, maxLength: 30 }),
	nombres: Type.String({ minLength: 1 }),
	apellidos: Type.String({ minLength: 1 }),
	fecha_nacimiento: Type.String({ format: "date" }),
	grupos: Type.Optional(Type.Array(GrupoSchema, { minItems: 1 })),
	password: Type.String({ minLength: 6 }),
});

export const ActualizarUsuarioSchema = Type.Partial(
	Type.Object({
		nombres: Type.String({ minLength: 1 }),
		apellidos: Type.String({ minLength: 1 }),
		fecha_nacimiento: Type.String({ format: "date" }),
		grupos: Type.Array(GrupoSchema, { minItems: 1 }),
		activo: Type.Boolean(),
	}),
);

export const LoginSchema = Type.Object({
	username: Type.String({ minLength: 3, maxLength: 30 }),
	password: Type.String({ minLength: 1 }),
});

export const PayloadSchema = Type.Object({
	id_usuario: UsuarioSchema.properties.id_usuario,
	username: UsuarioSchema.properties.username,
	grupos: UsuarioSchema.properties.grupos,
});

export type Usuario = Static<typeof UsuarioSchema>;
export type CrearUsuarioDTO = Static<typeof CrearUsuarioSchema>;
export type ActualizarUsuarioDTO = Static<typeof ActualizarUsuarioSchema>;
export type LoginDTO = Static<typeof LoginSchema>;
export type PayloadDTO = Static<typeof PayloadSchema>;
