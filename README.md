# spacetime-app-logic

# License: MIT

# SpaceTimeDB: 2.1.0

# Status:
- prototype
- simple input and output test message.
- place holder stuff

# Information:
  Just an idea on simple chat message bot prototype. So not compelex code idea and prototype idea. By using the table as calculate, store, create, update and delete?

# Ideas:
 Think why use tables instead of ram? Just an idea. Why not use table as ram to store memeory. 

 Another reason is develope A.I logic for npcs state, talking, move, combat and other things.

 It has to be module for add on to another project.

 This remind of the DOOMQL which run on pure sql for Doom Game.

# Research:
  Work on some idea with help A.I to learn some language terms and other things. Still have not explore more yet.

# commands:
```
bun install
```
```
spacetime start
```
```
spacetime dev --server local
```

# sql:
```
spacetime sql --server local spacetime-app-logic "SELECT * FROM chat_message"

spacetime sql --server local spacetime-app-logic "SELECT * FROM schedule_process"
```

# Layout:
  Simple input and output design.
## Server:
```ts
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
```
- table chat message

```ts
export const send_chat_message = spacetimedb.reducer({text:t.string()}, (ctx, {text}) => {

  const setFromNow = ctx.timestamp.microsSinceUnixEpoch + 1_000_000n;

  ctx.db.chatMessage.insert({
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
```
- input message to scheduled
- use for client call. 

```ts
const scheduleProcess = table(
  { name: 'schedule_process', scheduled: (): any => update_process_data },
  {
    scheduled_id: t.u64().primaryKey().autoInc(),
    scheduled_at: t.scheduleAt(),
    message: t.string(),
  }
);
```
- scheduled table for trigger to proccess message

```ts
export const update_process_data = spacetimedb.reducer({ arg: scheduleProcess.rowType }, (ctx, { arg }) => {
  // Invoked automatically by the scheduler
  // arg.message, arg.scheduled_at, arg.scheduled_id

  // do something to process message

  console.log('process data');
  // send to chat message table.
  ctx.db.chatMessage.insert({
    id: 0n,
    created_at: ctx.timestamp,
    text: 'test',
    who: 'system'
  });
});
```
- scheduled call function to update and process

## Client:
```ts
  //...
  const messages = van.state([
    { id: 1, sender: "System", text: "Connected to chat", time: "Now" }
  ]);
  //...

  function onInsert_Message(ctx, row){
    console.log(row);
    const newMsg = {
      id: Date.now(),
      sender: row.who,
      text: row.text,
      time: row.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.val = [...messages.val, newMsg];
    setTimeout(() => {
      scrollBottom();
    }, 100); // 2000ms = 2 seconds
  }

  function setupDBChatMessage(){
    conn.subscriptionBuilder()
      .subscribe(tables.chatMessage)
    // register function
    conn.db.chatMessage.onInsert(onInsert_Message)
  }

  function cleanUp(){
    // unregister function
    conn.db.chatMessage.onInsert(onInsert_Message)
  }

  setupDBChatMessage();

  van.derive(()=>{
    // console.log("closed:", closed.val)
    if(closed.val){
      cleanUp();
    }
  })
  //...
```
- setup table names listen
- add onInsert function to chat messages
- clean up to remove register function to prevent stacking.