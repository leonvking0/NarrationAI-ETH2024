import { Card, Typography, Paper, ThemeProvider, Divider, Fab } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { mockThreadContents, ThreadContent } from "../statics/threadMockData"
import { theme } from "../statics/Utils";
import styled from '@emotion/styled';
import { InsertEmoticon, Favorite, BugReport, WorkOutline } from '@mui/icons-material';

export const ThreadPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={2} sx={{
        display: "flex",
        padding: "96px 72px",
        bgcolor: "background.paper",
        maxWidth: "900px",
        margin: "100px",
        boxShadow: 30,
        borderRadius: 10,
        textAlign: "left"
      }}>
        <Stack gap={3}>
          <div>
            <Typography variant="h3" sx={{ fontFamily: "math", fontWeight: "bold" }}> Thread of thoughts </Typography>
            <StyledUnderline />
          </div>
          {mockThreadContents.map((content: ThreadContent, index: number) => <ThreadCard key={index} content={content} />)}
        </Stack>
      </Paper>
    </ThemeProvider >
  );
};

const ThreadCard: React.FC<{ content: ThreadContent }> = ({ content }) => {
  return (<Card sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyItems: "flex-start",
    padding: "24px",
    bgcolor: "background.default",
    borderRadius: 5,
    gap: 2,
  }}>
    <Typography variant="h6"><strong>Query: </strong>{content.query}</Typography>
    <Divider orientation="horizontal" variant="fullWidth" sx={{ bgColor: "red", width: "100%" }} />
    <Typography paragraph variant="h6" sx={{}}><strong>Response: </strong>{content.response}</Typography>
    <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 2, width: "100%" }}>
      <Fab aria-label="funny">
        <InsertEmoticon fontSize="large" />
      </Fab>
      <Fab aria-label="buggy">
        <BugReport fontSize="large" />
      </Fab>
      <Fab aria-label="valueble">
        <Favorite fontSize="large" />
      </Fab>
      <Fab aria-label="professional">
        <WorkOutline fontSize="large" />
      </Fab>
    </Stack>
  </Card>);
}

const StyledUnderline = styled.div`
  background: linear-gradient(to right, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%) 0 0/200% 100%;
  animation: a 2s linear infinite;
  height: 3px;
  width: 500px;
  @keyframes a {
    to {background-position:-200% 0}
  }
`