//-----------------------------------------------
// module
//-----------------------------------------------
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import { sessions } from './tables/table_session';
import { user } from './tables/table_user';
import { messageEvent } from './tables/table_event';
import { chatMessages } from './tables/table_chatmessage';
//-----------------------------------------------
// 
//-----------------------------------------------
const scheduleProcess = table(
  { name: 'schedule_process', scheduled: (): any => update_process_data },
  {
    scheduled_id: t.u64().primaryKey().autoInc(),
    scheduled_at: t.scheduleAt(),
    message: t.string(),
  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
const spacetimedb = schema({
  user,
  sessions,
  messageEvent,
  scheduleProcess,
  chatMessages,
});

//-----------------------------------------------
// simulation update process data
//-----------------------------------------------
export const update_process_data = spacetimedb.reducer({ arg: scheduleProcess.rowType }, (ctx, { arg }) => {
  // Invoked automatically by the scheduler
  // arg.message, arg.scheduled_at, arg.scheduled_id

  console.log('process data')
  ctx.db.chatMessages.insert({
    id: 0n,
    created_at: ctx.timestamp,
    text: 'test',
    who: 'system'
  });
});

//-----------------------------------------------
// INIT
//-----------------------------------------------
export const init = spacetimedb.init(_ctx => {
  console.log("[[ ===== ::: INIT SPACETIMEDB APP LOGIC ::: ==== ]]");
});
//-----------------------------------------------
// ON CLIENT CONNECT
//-----------------------------------------------
export const onConnect = spacetimedb.clientConnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);

  console.log("SENDER: ",ctx.sender.toHexString());

  if (user) {
    ctx.db.user.id.update({ ...user, online: true });
  } else {
    let generateName = String(ctx.newUuidV7()).replaceAll("-","");
    ctx.db.user.insert({
      id: generateName,
      identity: ctx.sender,
      name: generateName.substring(0, 12),
      online: true,
      accent_color: undefined,
      created_at: ctx.timestamp
    });
  }
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

  const user = ctx.db.user.identity.find(ctx.sender);
  if (user) {
    ctx.db.user.id.update({ 
      ...user, 
      online: false ,
    });
    console.info(`Disconnect event for user with identity ${ctx.sender}`);
  } else {
    console.warn(
      `Disconnect event for unknown user with identity ${ctx.sender}`
    );
  }
  // ctx.connectionId is guaranteed to be defined
  const connId = ctx.connectionId!;
  // Clean up client session
  ctx.db.sessions.connection_id.delete(connId);
});
//-----------------------------------------------
// 
//-----------------------------------------------
export default spacetimedb;
