import { pool } from '../../db';
import { buildAliasMapper } from './query-builder';
import { ColumnData, AnyObject } from './types';

export function pgRepository<T extends AnyObject>({
  table: _table,
  mapping,
  primaryKey = 'id'
}: {
  table: string;
  primaryKey?: string;
  mapping: Record<keyof T, ColumnData>;
}) {
  const table = `"${_table}"`;
  const aliasMapper = buildAliasMapper<T>(mapping);
  const columnAlias = aliasMapper;

  const cols = (...args: Array<keyof T>) =>
    args.map((key) => `${aliasMapper(key)} AS "${String(key)}"`).join(', ');

  const allColumns = Object.entries(mapping).reduce(
    (acc, [key, value]: [string, ColumnData]) => {
      if (typeof value === 'object' && value.hidden) {
        return acc;
      }

      const sql = `${aliasMapper(key)} AS "${key}"`;

      return acc ? (acc += `, ${sql}`) : sql;
    },
    ''
  );

  const selectOmit = (omit: Array<keyof T>) => {
    return cols(
      ...Object.entries(mapping)
        .filter(([key]) => !omit.includes(key))
        .map(([key]) => key)
    );
  };

  const findById = async (id: number): Promise<T | null> => {
    const res = await pool.query<T>(
      `
      SELECT ${allColumns} FROM ${table}
      WHERE id = $1
    `,
      [id]
    );

    return res.rows[0] ?? null;
  };

  const deleteById = async (id: number): Promise<T | null> => {
    const res = await pool.query<T>(
      `
      DELETE FROM ${table}
      WHERE id = $1
      RETURNING ${allColumns}
    `,
      [id]
    );

    return res.rows[0] ?? null;
  };

  return {
    table,
    primaryKey,
    allColumns,
    columnAlias,
    selectOmit,
    cols,
    findById,
    deleteById
  };
}
