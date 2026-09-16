import { Type, type Static } from "@sinclair/typebox";
import { timeStamp } from "node:console";

export const TareaSchema = Type.Object({
	id_tarea: Type.Integer(),
	id_creador: Type.Integer(),
	grupo: Type.String(),
	titulo: Type.String(),
	descripcion: Type.String(),
	prioridad: Type.String(),
	creada: Type.String({ format: "date-time" }),
	terminada: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	estado: Type.String(),
});

export const CrearTareaSchema = Type.Object({
	grupo: Type.String({ minLength: 1 }),
	titulo: Type.String({ minLength: 1, maxLength: 200 }),
	descripcion: Type.String({ minLength: 1, maxLength: 500 }),
	prioridad: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
});

export const ActualizarTareaSchema = Type.Partial(
	Type.Object({
		grupo: Type.String({ minLength: 1 }),
		titulo: Type.String({ minLength: 1, maxLength: 200 }),
		descripcion: Type.String({ minLength: 1, maxLength: 500 }),
		prioridad: Type.String({ minLength: 1, maxLength: 50 }),
	}),
);

export const FinalizarTareaSchema = Type.Object({
	fecha: Type.Optional(Type.String({ format: "date-time" })),
});

export type Tarea = Static<typeof TareaSchema>;
export type CrearTareaDTO = Static<typeof CrearTareaSchema>;
export type ActualizarTareaDTO = Static<typeof ActualizarTareaSchema>;
export type FinalizarTareaDTO = Static<typeof FinalizarTareaSchema>;
