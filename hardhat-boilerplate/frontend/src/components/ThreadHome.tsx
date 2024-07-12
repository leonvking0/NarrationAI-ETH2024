import React from "react";
import "./styles.css";
import { ThreadPage, threadType } from "./views/ThreadPage";

function ThreadHome(type: threadType) {
  return (
    <div className="ThreadHome">
      <ThreadPage type={type} />
    </div>
  );
}
export default ThreadHome;
