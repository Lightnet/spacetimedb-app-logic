


import van from "vanjs-core";
import { Modal, MessageBoard, FloatingWindow } from "vanjs-ui";
import { debounce, generateName, onDetach } from "./helper";
import { stateConn } from "./context";
import { tables } from "./module_bindings";

const { div, input, textarea, button, span, img, label, p } = van.tags;

export function ChatWindow() {
  const closed = van.state(false);
  const width = van.state(720);
  const height = van.state(560);
  const messageId = van.state(generateName())

  // .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  let now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Reactive states
  const messages = van.state([
    { id: 1, sender: "System", text: "Connected to chat", time: timeString }
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
      const conn = stateConn.val;
      conn.reducers.sendChatMessage({
        text:inputText.val.trim()
      })
    } catch (error) {
      console.log("send chat message error!");
      console.log(error.message);
    }

    inputText.val = "";
  }

  //clear timer, reset and call function
  const scrollMessages = debounce(scrollBottom, 100);

  function onInsert_Message(ctx, row){
    console.log(row);
    const newMsg = {
      id: Date.now(),
      sender: row.who,
      text: row.text,
      time: row.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.val = [...messages.val, newMsg];
    // need to delay to reason array need to update.
    // setTimeout(() => {
      // scrollBottom();
    // }, 100); // 2000ms = 2 seconds
    scrollMessages();
  }

  function setupDBChatMessage(){
    const conn = stateConn.val;
    conn.subscriptionBuilder()
      .subscribe(tables.chatMessages);
    conn.db.chatMessages.onInsert(onInsert_Message);
  }

  setupDBChatMessage();

  function cleanUp(){
    console.log("clean up..")
    const conn = stateConn.val;
    conn.db.chatMessages.removeOnInsert(onInsert_Message);
  }

  // van.derive(()=>{
  //   console.log("closed:", closed.val)
  //   if(closed.val){
  //     cleanUp();
  //   }
  // })

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
      // closeCross: true,
      childrenContainerStyleOverrides:{
        height:`calc(100% - 58px)`, // base on header height and spacing.
      },
      // style: "background: #1f1f1f; color: #fff;"
    },
    onDetach(cleanUp),
    // div({ style: "display: flex; flex-direction: column; height: calc(560px - 64px); overflow: hidden;" },
    div({ style: "display: flex; flex-direction: column; height: 100%; overflow: hidden;" },

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
