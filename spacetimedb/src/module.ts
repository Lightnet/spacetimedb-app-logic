// module

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import { sessions } from './tables/table_session';

const spacetimedb = schema({
  sessions,
});

//-----------------------------------------------
// INIT
//-----------------------------------------------
export const init = spacetimedb.init(_ctx => {
  console.log("===============INIT SPACETIMEDB APP NAME:::=========");
});

//-----------------------------------------------
// ON CLIENT CONNECT
//-----------------------------------------------
export const onConnect = spacetimedb.clientConnected(ctx => {
  // ctx.connectionId is guaranteed to be defined
  const connId = ctx.connectionId!;
  
  // Initialize client session
  ctx.db.sessions.insert({
    connection_id: connId,
    identity: ctx.sender,
    connected_at: ctx.timestamp
  });

});
//-----------------------------------------------
// ON CLIENT DISCONNECT
//-----------------------------------------------

export const onDisconnect = spacetimedb.clientDisconnected(ctx => {
  // ctx.connectionId is guaranteed to be defined
  const connId = ctx.connectionId!;
  // Clean up client session
  ctx.db.sessions.connection_id.delete(connId);
});

export default spacetimedb;
