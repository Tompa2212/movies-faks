import { pgRepository } from './base-repository/pg.repository';
import { db, pool } from '../db';
import { NewUser, User } from '../types/User';
import { usersTable } from '../db/schema';
import { eq, getTableColumns, like, sql } from 'drizzle-orm';

function makeUserRepository() {
  const base = pgRepository<User>({
    table: 'users',
    primaryKey: 'id',
    mapping: {
      id: 'id',
      email: 'email',
      password: 'password',
      username: 'username',
      firstName: 'first_name',
      lastName: 'last_name'
    }
  });

  const { password, ...safeTableColumns } = getTableColumns(usersTable);

  const findOneById = async (id: number) => {
    const user = await pool.query<Omit<User, 'password'>>(
      `SELECT ${base.selectOmit(['password'])} FROM ${
        base.table
      } WHERE id = $1`,
      [id]
    );

    return user.rows[0] ?? null;
  };

  const create = async (data: NewUser) => {
    const user = await db
      .insert(usersTable)
      .values(data)
      .returning(safeTableColumns);

    return user[0];
  };

  const deleteUser = async (id: number) => {
    const user = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning(safeTableColumns);

    return user[0] ?? null;
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    const user = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning(safeTableColumns);

    return user[0] ?? null;
  };

  const findManyByUsername = async (username: string) => {
    return db
      .select(safeTableColumns)
      .from(usersTable)
      .where(like(usersTable.username, sql`${username}%`));
  };

  return {
    ...base,
    findOneById,
    create,
    deleteUser,
    updateUser,
    findManyByUsername
  };
}

export const userRepository = makeUserRepository();
