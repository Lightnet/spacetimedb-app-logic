
import van from "vanjs-core";
import { ChatWindow } from "./chatwindow";
import { networkStatus } from "./context";

const { div, input, textarea, button, span, img, label, p } = van.tags;
export function App(){

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
    label("Network:"), label(networkStatus)
  )
}