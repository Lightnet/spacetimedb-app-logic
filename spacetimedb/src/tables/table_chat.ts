//-----------------------------------------------
// Model contact for tables
//-----------------------------------------------
import { table, t } from 'spacetimedb/server';
//-----------------------------------------------
// 
//-----------------------------------------------
export const sampleChat = table(
  { 
    name: 'sample_chat', 
    public: true,
  },
  {
    pattern: t.string().unique(),
    result: t.string().unique(),
    created_at: t.timestamp(),
  }
);