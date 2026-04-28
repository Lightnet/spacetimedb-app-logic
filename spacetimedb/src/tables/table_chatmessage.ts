//-----------------------------------------------
// Model contact for tables
//-----------------------------------------------
import { table, t } from 'spacetimedb/server';
//-----------------------------------------------
// 
//-----------------------------------------------
export const chatMessages = table(
  { 
    name: 'chat_messages',
    public: true,
  },
  {
    id: t.u64().autoInc().primaryKey(),
    who: t.string(),
    text: t.string(),
    created_at: t.timestamp(),
  }
);