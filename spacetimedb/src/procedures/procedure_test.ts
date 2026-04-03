
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

export const add_two_numbers = spacetimedb.procedure(
  { lhs: t.u32(), rhs: t.u32() },
  t.u64(),
  (ctx, { lhs, rhs }) => BigInt(lhs) + BigInt(rhs),
);


export const test_string = spacetimedb.procedure(
  {  },
  t.string(),
  (ctx, { }) => "procedure test ss",
);