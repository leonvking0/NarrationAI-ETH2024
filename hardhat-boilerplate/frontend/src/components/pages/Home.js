import React from "react";
import { Pay } from "./Pay";
import { TransactionErrorMessage } from "../TransactionErrorMessage";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Paper, ThemeProvider, Typography } from "@mui/material";
import { Tabs } from "../views/Tabs";
import { theme } from "../statics/Utils";
import { Stack } from "@mui/system";
// This is an utility method that turns an RPC error into a human readable
// message.
const _getRpcErrorMessage = (error) => {
  if (error.data) {
    return error.data.message;
  }

  return error.message;
};

const Home = ({ props }) => {
  return (
    <ThemeProvider theme={theme}>
      <div className="ThreadHome">
        <Stack sx={{ minHeight: "1500px" }}>
          <Tabs />
          <Paper
            sx={{
              display: "flex",
              padding: "96px 72px",
              bgcolor: "background.paper",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "1000px",
              boxShadow: 30,
              borderRadius: 10,
              textAlign: "left",
            }}
            elevation={2}
          >
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
                  <span className="sr-only">Waiting result...</span>
                </div>
              </div>
            )}

            {props.llmResponse && (
              <div className="row">
                <div className="col-12">
                  <p>
                    <b>{props.llmResponse}</b>
                  </p>
                </div>
              </div>
            )}
          </Paper>
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default Home;
