import {
  Card,
  Typography,
  Paper,
  ThemeProvider,
  Divider,
  Fab,
  Link,
} from "@mui/material";
import { Stack, SxProps } from "@mui/system";
import React, {useState} from "react";
import {LabelWithVote, ThreadContent} from "../statics/threadMockData";
import { theme } from "../statics/Utils";
import styled from "@emotion/styled";
import {
  InsertEmoticon,
  Favorite,
  BugReport,
  WorkOutline,
} from "@mui/icons-material";
import { Tabs } from "./Tabs";

export type threadType = "/threads" | "/favourate" | "/useful" | "/";

export interface ThreadPageProps {
  type: threadType,
  fn: (a: string) => {}
}

export interface ThreadCardProps {
  content: ThreadContent;
  fn: (a: string) => {}
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response: Response) {
  return response.json();
}
export interface Chat {
  chatid: number;
  query: string;
  response: string;
  image: string;
}


export const ThreadPage: React.FC<{ props: ThreadPageProps}> = ({ props }) => {
  const [chats, setState] = useState<Chat[]>([]);
  fetch("api/chats", {method: "GET"}).then(checkStatus).then(parseJSON).then(x => setState(x));

  const threadContents: ThreadContent[] = chats.map((chat: Chat, index: number) => {
    return {chatid: chat.chatid, query: chat.query, response: chat.response, image: chat.image, labelsWithVote: []}
  })
  // console.log("thread page:", props);
  return (
      <ThemeProvider theme={theme}>
        <Stack>
          <Tabs />
          <Paper elevation={2} sx={pageProps}>
            <Stack gap={3}>
              <div>
                <Typography
                    variant="h3"
                    sx={{ fontFamily: "math", fontWeight: "bold" }}
                >
                  Generated Stories
                </Typography>
                <StyledUnderline />
              </div>
              {threadContents.map((content: ThreadContent, index: number) => (
                  <ThreadCard key={content.chatid} props={{content, fn: (p) => props.fn(p)}}/>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </ThemeProvider>
  );
};

const ThreadCard: React.FC<{ props: ThreadCardProps }> = ({ props }) => {
  // console.log("card: ", props)
  return (
      <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyItems: "flex-start",
            padding: "24px",
            bgcolor: "background.default",
            borderRadius: 5,
            gap: 2
          }}
      >
        <Typography variant="h6">
          <strong>Query: </strong>
          {props.content.query}
        </Typography>
        <Divider
            orientation="horizontal"
            variant="fullWidth"
            sx={{ bgColor: "red", width: "100%" }}
        />
        <Typography paragraph variant="h6" sx={{}}>
          <strong>Response: </strong>
          {props.content.response}
        </Typography>
        {props.content.image.startsWith("http") && <img src={props.content.image} width="500" height="500" alt="img"/>}
        <Stack
            direction="row"
            sx={{ justifyContent: "flex-end", gap: 2, width: "100%" }}
        >
          <Fab aria-label="valueble">
            <Favorite fontSize="large" />
          </Fab>
          <Fab aria-label="professional">
            <WorkOutline fontSize="large" onClick={()=>{
              props.fn(props.content.response);
            }
            }/>
          </Fab>
        </Stack>
      </Card>
  );
};

export const pageProps: SxProps = {
  display: "flex",
  padding: "96px 72px",
  bgcolor: "background.paper",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "1000px",
  boxShadow: 30,
  borderRadius: 10,
  textAlign: "left",
};

const StyledUnderline = styled.div`
  background: linear-gradient(
      to right,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
  )
  0 0/200% 100%;
  animation: a 2s linear infinite;
  height: 3px;
  width: 500px;
  @keyframes a {
    to {
      background-position: -200% 0;
    }
  }
`;
