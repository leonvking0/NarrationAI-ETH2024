import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";

export function Pay({ payFunc }) {
  const onSubmit = (event) => {
    // This function just calls the transferTokens callback with the
    // form's data.
    event.preventDefault();
    // TODO: need to extract user input prompt here and pass to workers.
    const formData = new FormData(event.target);
    const inputPrompt = formData.get("prompt");
    payFunc(inputPrompt);
  };

  return (
    <Stack gap={3}>
      <Typography variant="h4" sx={{ fontFamily: "math", fontWeight: "bold" }}>
        Start a new story
      </Typography>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Input prompt</label>
          <input className="form-control" type="text" name="prompt" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </form>
    </Stack>
  );
}
