import { pgRepository } from './base-repository/pg.repository';
import { db } from '../db';
import { NewUser, User } from '../types/User';
import { usersTable } from '../db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';

function makeAuthRepository() {
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
      active: 'active'
    }
  });

  const { password, active, ...safeTableColumns } = getTableColumns(usersTable);

  async function findOneByEmail(email: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email), eq(usersTable.active, true)));

    return user[0] ?? null;
  }

  const create = async (data: NewUser) => {
    const user = await db
      .insert(usersTable)
      .values(data)
      .returning(safeTableColumns);

    return user[0];
  };

  return {
    ...base,
    findOneByEmail,
    create
  };
}

export const authRepository = makeAuthRepository();
