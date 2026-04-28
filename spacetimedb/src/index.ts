//-----------------------------------------------
// main
//-----------------------------------------------
import spacetimedb, {
  init, 
  onConnect, 
  onDisconnect,
  update_process_data,

} from './module';
//-----------------------------------------------
// 
//-----------------------------------------------

import { test_re} from './reducers/reducer_test';
import { test_string } from './procedures/procedure_test';
import { send_message } from './reducers/reducer_message';
import { start_process, send_chat_message, clear_messages } from './reducers/reducer_logic';

export {
  // spacetimedb predefine
  init,
  onConnect,
  onDisconnect,
  update_process_data,
  start_process,
  // 
  test_re,
  test_string,
  send_message,
  send_chat_message,
  clear_messages,
}
//-----------------------------------------------
// 
//-----------------------------------------------
export default spacetimedb;