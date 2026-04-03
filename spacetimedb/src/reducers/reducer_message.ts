//-----------------------------------------------
// REDUCER TEST
//-----------------------------------------------
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
//-----------------------------------------------
// SENT MESSAGE
//-----------------------------------------------
export const send_message = spacetimedb.reducer({text:t.string()}, (ctx, {text}) => {

  ctx.db.messageEvent.insert({
    identity: ctx.sender,
    text: text
  })

});


