import createError from "@fastify/error";

export const BadRequestError = createError(
  "BADREQUEST",
  "Solicitud incorrecta. %s",
  400,
);

export const UnAuthenticatedError = createError(
  "UNAUTHENTICATED",
  "No está autenticado. %s",
  401,
);

export const UnAuthorizedError = createError(
  "UNAUTHORIZED",
  "Las credenciales no son válidas. %s",
  401,
);

export const NotAuthorizedError = createError(
  "NOTAUTHORIZED",
  "No tiene permisos para realizar esta acción. %s",
  403,
);

export const ForbiddenError = createError(
  "FORBIDDEN",
  "Solicitud prohibida. %s",
  403,
);

export const NotFoundError = createError(
  "NOTFOUND",
  "Elemento no encontrado. %s",
  404,
);

export const ConflictError = createError(
  "CONFLICT",
  "Existe un conflicto en los datos. %s",
  409,
);

export const InternalError = createError(
  "INTERNAL",
  "Error interno. %s",
  500,
);

export function transformarErrorPostgres(error: PostgresError) {
  const { table, constraint } = error;
  const elementoProblematico = constraint
    ?.substring(table?.length || 0)
    .toLowerCase()
    .replace("_fk", "")
    .replace("_key", "")
    .replace("_pk", "");

  switch (error.code) {
    case "23000":
    case "23001":
      return new ConflictError(
        `El ${elementoProblematico || "registro"} no se puede borrar.`,
      );
    case "23502":
      return new BadRequestError(
        `El campo '${error.column || "requerido"}' no puede estar vacío.`,
      );
    case "23503":
      return new ConflictError(
        "No se puede completar la acción porque el registro está vinculado a otros datos.",
      );
    case "23505":
      return new ConflictError(
        `Ya existe un ${elementoProblematico || "registro"} en ${table || "la tabla"}.`,
      );
    case "23514":
      return new BadRequestError(
        "Los datos no cumplen con las reglas de validación del sistema.",
      );
    default:
      return new InternalError("No se pudo completar la operación.");
  }
}

export interface PostgresError extends Error {
  code?: string;
  detail?: string;
  schema?: string;
  table?: string;
  column?: string;
  constraint?: string;
}
