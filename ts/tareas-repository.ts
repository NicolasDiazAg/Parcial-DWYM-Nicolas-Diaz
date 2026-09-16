import { myPool } from "../db/database.ts";
import { NotFoundError } from "../errors/response.errors.ts";
import type {
  ActualizarTareaDTO,
  CrearTareaDTO,
  Tarea,
} from "../schemas/tareas.ts";

class TareasRepository {
  private readonly baseQuery = `
    SELECT * FROM tareas T
  `;

  async obtenerTodas(): Promise<Tarea[]> {
    const query = `
      ${this.baseQuery}
      ORDER BY creada DESC;
    `;
    //TODO: Completar
  }

  async obtenerPorId(idTarea: number): Promise<Tarea> {
    const query = `
      ${this.baseQuery}
      WHERE id_tarea = $1;
    `;
    //TODO: Completar
  }

  async crear(idCreador: number, dto: CrearTareaDTO): Promise<Tarea> {
    const query = `
      INSERT INTO tareas (id_creador, grupo, titulo, descripcion, prioridad)
      VALUES ($1, $2, $3, $4, COALESCE($5, '1:media'))
      RETURNING id_tarea;
    `;
    //TODO: Completar
  }

  async actualizar(idTarea: number, dto: ActualizarTareaDTO): Promise<Tarea> {
    const query = `
      UPDATE tareas
      SET campo1=$2, campo2=$3, etc, etc
      WHERE id_tarea = $1;
    `;
    //TODO: Corregir y completar
  }

  async finalizar(idTarea: number, fecha?: string): Promise<Tarea> {
    const query = `
      UPDATE tareas
      SET terminada = $2
      WHERE id_tarea = $1 AND terminada IS NULL;
    `;

    //TODO: Completar. Ojo si la fecha viene vacía. Recuerden que CURRENT_TIMESTAMP hace referencia la fecha y hora actual
  }

  async eliminar(idTarea: number): Promise<void> {
    const query = `
      DELETE FROM tareas
      WHERE id_tarea = $1;
    `;
    //TODO: Completar
  }
}

export const tareasRepo = new TareasRepository();
