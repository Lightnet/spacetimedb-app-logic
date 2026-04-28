//-----------------------------------------------
// REDUCER LOGIC
//-----------------------------------------------
import { ScheduleAt } from 'spacetimedb';
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
// https://spacetimedb.com/docs/tables/schedule-tables
//-----------------------------------------------
// 
//-----------------------------------------------
export const start_process = spacetimedb.reducer({}, (ctx, {}) => {
  console.info("start_process");

  // 10 sec + current time
  // const tenSecondsFromNow = ctx.timestamp.microsSinceUnixEpoch + 10_000_000n;

  const setFromNow = ctx.timestamp.microsSinceUnixEpoch + 1_000_000n;

  ctx.db.scheduleProcess.insert({
    scheduled_id: 0n,
    scheduled_at: ScheduleAt.time(setFromNow),
    message: 'test'
  });


  // ctx.db.scheduleProcess.insert({
  //   scheduled_id: 0n,
  //   scheduled_at: {
  //     tag: 'Interval',
  //     value: new TimeDuration
  //   },
  //   message: ''
  // });
});

export const send_chat_message = spacetimedb.reducer({text:t.string()}, (ctx, {text}) => {

  const setFromNow = ctx.timestamp.microsSinceUnixEpoch + 1_000_000n;

  ctx.db.chatMessages.insert({
    id: 0n,
    created_at: ctx.timestamp,
    text: text,
    who: 'You'
  })

  ctx.db.scheduleProcess.insert({
    scheduled_id: 0n,
    scheduled_at: ScheduleAt.time(setFromNow),
    message: text
  });
});

// for debug 
export const clear_messages = spacetimedb.reducer((ctx) => {
  for(const message of ctx.db.chatMessages.iter()){
    ctx.db.chatMessages.id.delete(message.id);
  }
});