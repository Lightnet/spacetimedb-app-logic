

import { schema, table, t, SenderError  } from 'spacetimedb/server';

export const messageEvent = table({
  public: true,
  event: true,
}, {
  identity: t.identity(),
  text: t.string(),
});