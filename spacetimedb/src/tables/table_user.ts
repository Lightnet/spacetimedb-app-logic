//-----------------------------------------------
// Model contact for tables
//-----------------------------------------------
import { table, t } from 'spacetimedb/server';
//-----------------------------------------------
// 
//-----------------------------------------------
export const user = table(
  { 
    name: 'user', 
    public: true,
  },
  {
    id:t.string().primaryKey(),
    identity: t.identity().unique(),
    name: t.string().unique(),
    online: t.bool().default(false),
    accent_color: t.u32().optional(),
    created_at: t.timestamp(),
  }
);