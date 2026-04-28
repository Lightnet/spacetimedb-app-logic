//-----------------------------------------------
// INDEX
//-----------------------------------------------
import { DbConnection, tables } from './module_bindings';
import van from "vanjs-core";
// import { networkStatus, userIdentity, userName, userStatus, userAvatarUrl, connState, userId } from './context.js';
// import { Modal, MessageBoard, FloatingWindow } from "vanjs-ui";
// import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import { ChatWindow } from './chatwindow';
import { board, networkStatus, stateConn } from './context';
import { App } from './app';
import { setupPane } from './debug_pane';
const { style, div, input, textarea, button, span, img, label } = van.tags;
const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-logic';
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;

//-----------------------------------------------
//
//-----------------------------------------------
const app_css = style(`
body{
  background-color:gray;
}
`);
van.add(document.body, app_css);

const loadingscreen = div({style:`
  display: flex; 
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  height: 100vh;
  `},
  div(
    label("Loading")
  ),
  div(
    label(()=>networkStatus.val),
  )
);
van.add(document.body, loadingscreen);

networkStatus.val = 'Initial connection...';


function setupNetwork(){
  const conn = DbConnection.builder()
    .withUri(HOST)
    .withDatabaseName(DB_NAME)
    // .withToken(localStorage.getItem('auth_token') || undefined)
    .withToken(localStorage.getItem(TOKEN_KEY) || undefined)
    .onConnect((conn, identity, token) => {
      localStorage.setItem(TOKEN_KEY, token);
      stateConn.val = conn;
      console.log('connnect');
      networkStatus.val = 'Connected';
      // connState.val = conn;
      // console.log("identity: ", identity);
      // console.log("identity: ", identity.toHexString());
      // console.log("conn: ", conn);
      // filter from table update calls...
      // userIdentity.val = identity;
      setup();
      document.body.removeChild(loadingscreen);
    })
    .onDisconnect(() => {
      console.log('Disconnected from SpacetimeDB');
      networkStatus.val = 'Disconnected';
    })
    .onConnectError((_ctx, error) => {
      console.error('Connection error:', error);
      networkStatus.val = 'Connection error!';
      // statusEl.textContent = 'Error: ' + error.message;
      // statusEl.style.color = 'red';
    })
    .build();
}
function setup(){
  // setUpDBUser();
  setupDBMessage();
  van.add(document.body, App());
  setupPane();
}

function setupDBMessage(){
  const conn = stateConn.val;
  conn.subscriptionBuilder()
    .subscribe(tables.messageEvent)
  conn.db.messageEvent.onInsert((ctx, row)=>{
    console.log(row);
    board.show({message: row.text, durationSec: 1})
  })
}

function setupDBSchedule(){
  // conn.subscriptionBuilder()
  //   .subscribe(tables)
  // conn.db.messageEvent.onInsert((ctx, row)=>{
  //   console.log(row);
  // })
}

setupNetwork();