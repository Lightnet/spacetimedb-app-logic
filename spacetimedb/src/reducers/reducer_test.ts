//-----------------------------------------------
// REDUCER TEST
//-----------------------------------------------
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
export const test_re = spacetimedb.reducer({}, (ctx, {}) => {
  // console.info("Name: ",name);
  console.log('test');
  return "test22";
});


