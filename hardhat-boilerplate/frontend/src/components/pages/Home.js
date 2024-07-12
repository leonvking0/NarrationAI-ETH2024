import React from "react";
import { Pay } from "./Pay";
import { TransactionErrorMessage } from "../TransactionErrorMessage";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
// This is an utility method that turns an RPC error into a human readable
// message.
const _getRpcErrorMessage = (error) => {
  if (error.data) {
    return error.data.message;
  }

  return error.message;
};

const Home = ({props}) => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          {/* 
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
          {props.txBeingSent && (
            <WaitingForTransactionMessage txHash={props.txBeingSent} />
          )}

          {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
          {props.transactionError && (
            <TransactionErrorMessage
              message={_getRpcErrorMessage(props.transactionError)}
              dismiss={props._dismissTransactionError}
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">{<Pay payFunc={props._pay} />}</div>
      </div>
      {props.waitingResult && (
        <div>
          <div className="spinner-border" role="status">
            <span className="sr-only">Waing result...</span>
          </div>
        </div>
      )}

      {props.llmResponse && (<div className="row">
          <div className="col-12">
            <p>
              <b>{props.llmResponse}</b>
            </p>
          </div>
        </div>)}
    </React.Fragment>
  );
};

export default Home;