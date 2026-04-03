//-----------------------------------------------
// Model contact for tables
//-----------------------------------------------
import { table, t } from 'spacetimedb/server';
//-----------------------------------------------
// 
//-----------------------------------------------
export const chatMessage = table(
  { 
    name: 'chat_message', 
    public: true,
  },
  {
    id: t.u64().autoInc().primaryKey(),
    who: t.string(),
    text: t.string(),
    created_at: t.timestamp(),
  }
);