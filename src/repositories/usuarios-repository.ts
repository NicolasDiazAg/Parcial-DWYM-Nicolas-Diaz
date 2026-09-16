import type { PoolClient } from "pg";
import { myPool } from "../plugins/database.ts";
import {
	NotAuthorizedError,
	NotFoundError,
} from "../errors/response.errors.ts";
import type {
	ActualizarUsuarioDTO,
	CrearUsuarioDTO,
	Usuario,
} from "../schemas/usuarios-schema.ts";

class UsuariosRepository {
	private readonly baseQuery = `SELECT * FROM usuarios U`;

	async obtenerTodos(): Promise<Usuario[]> {
		const result = await myPool.query(
			`${this.baseQuery} ORDER BY id_usuario ASC;`,
		);
		return result.rows;
	}

	async obtenerPorId(idUsuario: number): Promise<Usuario> {
		const result = await myPool.query(
			`${this.baseQuery} WHERE id_usuario = $1;`,
			[idUsuario],
		);
		if (result.rowCount !== 1)
			throw new NotFoundError("Usuario no encontrado.");
		return result.rows[0];
	}

	async obtenerPorUsername(username: string): Promise<Usuario> {
		const result = await myPool.query(
			`${this.baseQuery} WHERE username = $1;`,
			[username],
		);
		if (result.rowCount !== 1)
			throw new NotFoundError("Usuario no encontrado.");
		return result.rows[0];
	}

	async crear(dto: CrearUsuarioDTO): Promise<Usuario> {
		const client: PoolClient = await myPool.connect();
		try {
			await client.query("BEGIN");
			const usuarioResult = await client.query(
				`INSERT INTO usuarios (username, nombres, apellidos, fecha_nacimiento, grupos)
				VALUES ($1, $2, $3, $4, COALESCE($5, ARRAY['user']::TEXT[]))
				RETURNING id_usuario;`,
				[
					dto.username,
					dto.nombres,
					dto.apellidos,
					dto.fecha_nacimiento,
					dto.grupos ?? null,
				],
			);
			await client.query(
				`INSERT INTO credenciales (id_usuario, password_hash) VALUES ($1, crypt($2, gen_salt('bf')));`,
				[usuarioResult.rows[0].id_usuario, dto.password],
			);
			await client.query("COMMIT");
			return this.obtenerPorId(usuarioResult.rows[0].id_usuario);
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async actualizar(
		idUsuario: number,
		dto: ActualizarUsuarioDTO,
	): Promise<Usuario> {
		const campos: string[] = [];
		const valores: unknown[] = [];
		let idx = 1;

		if (dto.nombres !== undefined) {
			campos.push(`nombres = $${idx++}`);
			valores.push(dto.nombres);
		}
		if (dto.apellidos !== undefined) {
			campos.push(`apellidos = $${idx++}`);
			valores.push(dto.apellidos);
		}
		if (dto.fecha_nacimiento !== undefined) {
			campos.push(`fecha_nacimiento = $${idx++}`);
			valores.push(dto.fecha_nacimiento);
		}
		if (dto.grupos !== undefined) {
			campos.push(`grupos = $${idx++}`);
			valores.push(dto.grupos);
		}
		if (dto.activo !== undefined) {
			campos.push(`activo = $${idx++}`);
			valores.push(dto.activo);
		}

		if (campos.length === 0) return this.obtenerPorId(idUsuario);

		valores.push(idUsuario);
		const result = await myPool.query(
			`UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario = $${idx};`,
			valores,
		);
		if (result.rowCount !== 1)
			throw new NotFoundError("Usuario no encontrado.");
		return this.obtenerPorId(idUsuario);
	}

	async eliminar(idUsuario: number): Promise<void> {
		const result = await myPool.query(
			`DELETE FROM usuarios WHERE id_usuario = $1;`,
			[idUsuario],
		);
		if (result.rowCount !== 1)
			throw new NotFoundError("Usuario no encontrado.");
	}

	async verificarCredenciales(
		username: string,
		passwordPlana: string,
	): Promise<Pick<Usuario, "id_usuario" | "username" | "grupos">> {
		const result = await myPool.query(
			`SELECT u.id_usuario, u.username, u.grupos
       FROM usuarios u
       JOIN credenciales c ON u.id_usuario = c.id_usuario
       WHERE u.username = $1
         AND u.activo = TRUE
         AND c.password_hash = crypt($2, c.password_hash);`,
			[username, passwordPlana],
		);
		if (result.rowCount !== 1)
			throw new NotAuthorizedError("Usuario o contraseña incorrectos.");
		return result.rows[0];
	}
}

export const usuariosRepo = new UsuariosRepository();
