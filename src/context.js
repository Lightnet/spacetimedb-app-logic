import van from "vanjs-core";
import { Modal, MessageBoard, FloatingWindow } from "vanjs-ui";

export const board = new MessageBoard({top: "20px"});
// const example1 = () => board.show({message: "Hi!", durationSec: 1});

export const networkStatus = van.state('Offline');
export const stateConn = van.state(null);

