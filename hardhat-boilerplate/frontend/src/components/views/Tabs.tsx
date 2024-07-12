import { Stack, SxProps } from "@mui/system";
import { Link, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

export const Tabs: React.FC = () => {
  const location = useLocation();

  return (
    <Stack
      direction="row"
      gap={1}
      sx={{
        width: "100%",
        justifyContent: "flex-end",
        paddingRight: "48px",
      }}
    >
      <Paper elevation={2} sx={getTabProps(location.pathname === "/")}>
        <Link href="/" underline="hover">
          <Typography variant="h6">GPT Query</Typography>
        </Link>
      </Paper>
      <Paper elevation={2} sx={getTabProps(location.pathname === "/threads")}>
        <Link href="/threads" underline="hover">
          <Typography variant="h6">Threads</Typography>
        </Link>
      </Paper>
      <Paper elevation={2} sx={getTabProps(location.pathname === "/favourate")}>
        <Link href="/favourate" underline="hover">
          <Typography variant="h6">Most Liked</Typography>
        </Link>
      </Paper>
      <Paper elevation={2} sx={getTabProps(location.pathname === "/useful")}>
        <Link href="/useful" underline="hover">
          <Typography variant="h6">Most Useful</Typography>
        </Link>
      </Paper>
    </Stack>
  );
};

const getTabProps = (isSelected: boolean): SxProps => {
  return {
    display: "flex",
    padding: "16px 24px 8px 24px",
    bgcolor: isSelected ? "background.paper" : "#B1BCAE",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "1000px",
    boxShadow: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };
};
