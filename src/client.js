//-----------------------------------------------
// INDEX
//-----------------------------------------------
import { DbConnection, tables } from './module_bindings';
import van from "vanjs-core";
// import { networkStatus, userIdentity, userName, userStatus, userAvatarUrl, connState, userId } from './context.js';
import { Modal, MessageBoard, FloatingWindow } from "vanjs-ui";
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
const { div, input, textarea, button, span, img, label, p } = van.tags;
const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-logic';
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;

function generateName(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


const board = new MessageBoard({top: "20px"})
// const example1 = () => board.show({message: "Hi!", durationSec: 1})

const ChatConfig = {
  message:"",
  
}

//-----------------------------------------------
//
//-----------------------------------------------
const conn = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  // .withToken(localStorage.getItem('auth_token') || undefined)
  .withToken(localStorage.getItem(TOKEN_KEY) || undefined)
  .onConnect((conn, identity, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('connnect');
    // networkStatus.val = 'Connected';
    // connState.val = conn;
    // console.log("identity: ", identity);
    // console.log("identity: ", identity.toHexString());
    // console.log("conn: ", conn);
    // filter from table update calls...
    // userIdentity.val = identity;
    initDB();
  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
    // networkStatus.val = 'Disconnected';
  })
  .onConnectError((_ctx, error) => {
    console.error('Connection error:', error);
    // networkStatus.val = 'Connection error';
    // statusEl.textContent = 'Error: ' + error.message;
    // statusEl.style.color = 'red';
  })
  .build();

function initDB(){
  // setUpDBUser();
  setupDBMessage();
  // setupDBChatMessage();
}

function setupDBMessage(){
  conn.subscriptionBuilder()
    .subscribe(tables.messageEvent)

  conn.db.messageEvent.onInsert((ctx, row)=>{
    console.log(row);
    board.show({message: row.text, durationSec: 1})
  })
}

// function setupDBChatMessage(){
//   conn.subscriptionBuilder()
//     .subscribe(tables.chatMessage)

//   conn.db.chatMessage.onInsert((ctx, row)=>{
//     console.log(row);

    
//   })
// }

function setupDBSchedule(){
  // conn.subscriptionBuilder()
  //   .subscribe(tables)
  // conn.db.messageEvent.onInsert((ctx, row)=>{
  //   console.log(row);
  // })
}


function ChatWindow() {
  const closed = van.state(false);
  const width = van.state(720);
  const height = van.state(560);
  const messageId = van.state(generateName())

  // Reactive states
  const messages = van.state([
    { id: 1, sender: "System", text: "Connected to chat", time: "Now" }
  ]);

  const inputText = van.state("");

  function send_message() {
    if (!inputText.val.trim()) return;

    // const newMsg = {
    //   id: Date.now(),
    //   sender: "You",
    //   text: inputText.val.trim(),
    //   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    // };
    // messages.val = [...messages.val, newMsg];
    try {
      conn.reducers.sendChatMessage({
        text:inputText.val.trim()
      })
    } catch (error) {
      console.log("send chat message error!");
    }

    inputText.val = "";
  }

  function setupDBChatMessage(){
    conn.subscriptionBuilder()
      .subscribe(tables.chatMessage)

    conn.db.chatMessage.onInsert((ctx, row)=>{
      console.log(row);
      
      console.log(row.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      
      // const milliseconds = Number(Number(row.createdAt) / 1000);
      // console.log(milliseconds)
      // const date = new Date(milliseconds);
      const newMsg = {
        id: Date.now(),
        sender: row.who,
        // text: inputText.val.trim(),
        text: row.text,
        // time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        time: row.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      messages.val = [...messages.val, newMsg];
      setTimeout(() => {
        scrollBottom();
      }, 100); // 2000ms = 2 seconds
    })
  }

  setupDBChatMessage();

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send_message();
    }
  }

  function scrollBottom(){
    const chatContainer = document.getElementById(messageId.val);
    // console.log(chatContainer)
    // chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // chatContainer.scrollTop = chatContainer.scrollHeight;
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  return FloatingWindow(
    {
      title: "Chat",
      closed,
      width,
      height,
      closeCross: true,
      style: "background: #1f1f1f; color: #fff;"
    },

    div({ style: "display: flex; flex-direction: column; height: calc(560px - 64px); overflow: hidden;" },

      // === Messages Area ===
      div({id:messageId.val,
        style: `
          flex: 1;                    /* This makes it take all available space */
          min-height: 0;              /* Important fix for flex + overflow */
          padding: 15px;
          overflow-y: auto;           /* Scroll when messages exceed height */
          background: #2a2a2a;
          display: flex;
          flex-direction: column;
          gap: 12px;
        `
      },
        // This is how we make it reactive in current VanJS
        () => div({ style: "display: contents;" },
          messages.val.map(msg =>
            div({
              style: `
                display: flex; 
                flex-direction: column; 
                align-items: ${msg.sender === "You" ? "flex-end" : "flex-start"};
              `
            },
              div({
                style: `
                  max-width: 75%; 
                  padding: 10px 14px; 
                  border-radius: 18px;
                  background: ${msg.sender === "You" ? "#0a84ff" : "#3a3a3c"};
                  color: white;
                  font-size: 15px;
                  line-height: 1.4;
                `
              }, msg.text),

              span({
                style: "font-size: 11px; color: #888; margin-top: 4px; padding: 0 4px;"
              }, `${msg.sender} • ${msg.time}`)
            )
          )
        )
      ),

      // === Input Area ===
      div({ style: "padding: 12px; background: #1f1f1f; border-top: 1px solid #444;" },
        div({ style: "display: flex; gap: 8px; align-items: flex-end;" },
          textarea({
            placeholder: "Type a message...",
            value: inputText,
            oninput: (e) => inputText.val = e.target.value,
            onkeydown: handleKeyDown,
            rows: 1,
            style: `
              flex: 1;
              background: #2a2a2a;
              color: white;
              border: none;
              border-radius: 20px;
              padding: 12px 16px;
              font-size: 15px;
              resize: none;
              outline: none;
              max-height: 120px;
            `
          }),
          button({
            onclick: send_message,
            style: `
              background: #0a84ff;
              color: white;
              border: none;
              border-radius: 50%;
              width: 44px;
              height: 44px;
              font-size: 20px;
              cursor: pointer;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            `
          }, "↑")
        )
      )
    )
  );
}


function App(){

  function onTest(){
    console.log('test');
    board.show({message: "Hi!", durationSec: 1})
  }

  function onChatWindow(){
    console.log('test');
    van.add(document.body, ChatWindow())
  }

  async function onTest02(){
    // const test = await conn.reducers.testRe();
    // console.log(test)

    // const rtest = await conn.procedures.testString()
    // console.log("procedure test: ", rtest)

    conn.reducers.sendMessage({text:"test"})
  }


  onChatWindow();

  return div(
    button({onclick:onTest},'Test'),
    button({onclick:onChatWindow},'Chat Window'),
    button({onclick:onTest02},'Test2'),
  )
}

van.add(document.body, App());

const pane = new Pane();
pane.addBinding(ChatConfig, 'message')
pane.addButton({title:'Message Event'}).on('click',()=>{
  // conn.reducers.startProcess({});
  conn.reducers.sendMessage({text:ChatConfig.message})
});


pane.addButton({title:'start_process'}).on('click',()=>{
  conn.reducers.startProcess({});
});
