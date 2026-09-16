import { myPool } from "../plugins/database.ts";
import { ConflictError, NotFoundError } from "../errors/response.errors.ts";
import type {
	ActualizarTareaDTO,
	CrearTareaDTO,
	Tarea,
} from "../schemas/tareas-schema.ts";

class TareasRepository {
	private readonly baseQuery = `SELECT * FROM tareas T`;

	async obtenerTodas(): Promise<Tarea[]> {
		const result = await myPool.query(
			`${this.baseQuery} ORDER BY creada DESC;`,
		);
		return result.rows;
	}

	async obtenerPorId(idTarea: number): Promise<Tarea> {
		const result = await myPool.query(
			`${this.baseQuery} WHERE id_tarea = $1;`,
			[idTarea],
		);
		if (result.rowCount !== 1) throw new NotFoundError("Tarea no encontrada.");
		return result.rows[0];
	}

	async crear(idCreador: number, dto: CrearTareaDTO): Promise<Tarea> {
		const result = await myPool.query(
			`INSERT INTO tareas (id_creador, grupo, titulo, descripcion, prioridad)
        VALUES ($1, $2, $3, $4, COALESCE($5, '1:media'))
        RETURNING id_tarea;`,
			[
				idCreador,
				dto.grupo,
				dto.titulo,
				dto.descripcion,
				dto.prioridad ?? null,
			],
		);
		return this.obtenerPorId(result.rows[0].id_tarea);
	}

	async actualizar(idTarea: number, dto: ActualizarTareaDTO): Promise<Tarea> {
		const campos: string[] = [];
		const valores: unknown[] = [];
		let idx = 1;

		if (dto.grupo !== undefined) {
			campos.push(`grupo = $${idx++}`);
			valores.push(dto.grupo);
		}
		if (dto.titulo !== undefined) {
			campos.push(`titulo = $${idx++}`);
			valores.push(dto.titulo);
		}
		if (dto.descripcion !== undefined) {
			campos.push(`descripcion = $${idx++}`);
			valores.push(dto.descripcion);
		}
		if (dto.prioridad !== undefined) {
			campos.push(`prioridad = $${idx++}`);
			valores.push(dto.prioridad);
		}

		if (campos.length === 0) return this.obtenerPorId(idTarea);

		valores.push(idTarea);
		const result = await myPool.query(
			`UPDATE tareas SET ${campos.join(", ")} WHERE id_tarea = $${idx};`,
			valores,
		);
		if (result.rowCount !== 1) throw new NotFoundError("Tarea no encontrada.");
		return this.obtenerPorId(idTarea);
	}

	async finalizar(idTarea: number, fecha?: string): Promise<Tarea> {
		const actual = await this.obtenerPorId(idTarea);
		if (actual.terminada !== null)
			throw new ConflictError("La tarea ya está terminada.");

		await myPool.query(
			`UPDATE tareas
			SET terminada = COALESCE($2::timestamptz, CURRENT_TIMESTAMP)
			WHERE id_tarea = $1 AND terminada IS NULL;`,
			[idTarea, fecha ?? null],
		);
		return this.obtenerPorId(idTarea);
	}

	async eliminar(idTarea: number): Promise<void> {
		const result = await myPool.query(
			`DELETE FROM tareas WHERE id_tarea = $1;`,
			[idTarea],
		);
		if (result.rowCount !== 1) throw new NotFoundError("Tarea no encontrada.");
	}
}

export const tareasRepo = new TareasRepository();
