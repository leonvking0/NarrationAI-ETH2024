import React from "react";
import "./styles.css";
import { ThreadPage, threadType, ThreadPageProps } from "./views/ThreadPage";

function ThreadHome(props: ThreadPageProps) {
  // props.fn("aa");
  console.log(props);
    return (
    <div className="ThreadHome">
      <ThreadPage props={props}/>
    </div>
  );
}
export default ThreadHome;
