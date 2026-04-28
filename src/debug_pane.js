import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import { stateConn } from './context';


const ChatConfig = {
  message:"",
}

export function setupPane(){
  const pane = new Pane();
  pane.addBinding(ChatConfig, 'message')

  pane.addButton({title:'reducers'}).on('click',()=>{
    const conn = stateConn.val;
    console.log(conn.reducers);
  });

  pane.addButton({title:'Message Event'}).on('click',()=>{
    const conn = stateConn.val;
    // conn.reducers.startProcess({});
    conn.reducers.sendMessage({text:ChatConfig.message})
  });

  pane.addButton({title:'start_process'}).on('click',()=>{
    const conn = stateConn.val;
    conn.reducers.startProcess({});
  });

  pane.addButton({title:'clear messages'}).on('click',()=>{
    const conn = stateConn.val;
    conn.reducers.clearMessages();
  });
}