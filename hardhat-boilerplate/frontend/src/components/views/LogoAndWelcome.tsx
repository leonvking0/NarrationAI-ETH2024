import React from "react";
import "../styles.css";
import logo from "../../assets/logo.png";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";

export const LogoAndWelcome: React.FC<{ user: string }> = ({ user }) => {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{
        alignItems: "center",
        paddingLeft: "120px",
        paddingBottom: "24px",
      }}
    >
      <img
        alt=""
        src={logo}
        width="100"
        height="60"
        style={{ paddingRight: "8px" }}
        className="d-inline-block align-top"
      />
      <Typography variant="h6">
        Welcome <b>{user}</b>
      </Typography>
      <TagFacesOutlinedIcon />
    </Stack>
  );
};
