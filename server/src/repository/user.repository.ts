import { pgRepository } from './base-repository/pg.repository';
import { db, pool } from '../db';
import { NewUser, User } from '../types/User';
import { usersTable } from '../db/schema';
import { and, eq, getTableColumns, ilike } from 'drizzle-orm';

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
      lastName: 'last_name',
      active: 'active',
      emailVerified: 'emailVerified',
      image: 'image'
    }
  });

  const { password, active, ...safeTableColumns } = getTableColumns(usersTable);

  const findOneById = async (id: number) => {
    const user = await pool.query<Omit<User, 'password' | 'active'>>(
      `SELECT ${base.selectOmit(['password', 'active'])} 
         FROM ${base.table} 
       WHERE id = ($1) AND
         active = true`,
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
      .update(usersTable)
      .set({ active: false })
      .where(eq(usersTable.id, id))
      .returning(safeTableColumns);

    return user[0] ?? null;
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    const user = await db
      .update(usersTable)
      .set(data)
      .where(and(eq(usersTable.id, id), eq(usersTable.active, true)))
      .returning(safeTableColumns);

    return user[0] ?? null;
  };

  const findManyByEmail = async (email: string) => {
    return db
      .select(safeTableColumns)
      .from(usersTable)
      .where(
        and(ilike(usersTable.email, `${email}%`), eq(usersTable.active, true))
      );
  };

  return {
    ...base,
    findOneById,
    create,
    deleteUser,
    updateUser,
    findManyByEmail
  };
}

export const userRepository = makeUserRepository();
