import React from "react";

export function Pay({ payFunc }) {
  return (
    <div>
      <h4>Input prompt for on chain query of ChatGPT</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          // TODO: need to extract user input prompt here and pass to workers.
          const formData = new FormData(event.target);
          const inputPrompt = formData.get("prompt");
          payFunc(inputPrompt);
        }}
      >
        <div className="form-group">
          <label>Input prompt</label>
          <input className="form-control" type="text" name="prompt" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}