const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");



const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
}

DB_FILENAME = "scripts/agents.db"

const COLUMNS = [
    "chatid",
    "query",
    "response",
    "image"
];
app.get("/api/chats", (req, res) => {
    // WARNING: Not for production use! The following statement
    // is not protected against SQL injections.
    const filebuffer = fs.readFileSync(DB_FILENAME);

    const db = new sqlite.Database(filebuffer);
    const r = db.exec(
        `
    select ${COLUMNS.join(", ")} from chats
  `
    );
    db.close();
    if (r[0]) {
        res.json(
            r[0].values.map(entry => {
                const e = {};
                COLUMNS.forEach((c, idx) => {
                    e[c] = entry[idx];
                });
                return e;
            })
        );
    } else {
        res.json([]);
    }
});

app.post("/api/add",  express.json({type: '*/*'}), (req, res) => {
    const filebuffer = fs.readFileSync(DB_FILENAME);
    const db = new sqlite.Database(filebuffer);
    console.log(req.body);
    let chatid = req.body.chatid;
    let query = req.body.query;
    let response = req.body.response;
    console.log(chatid);
    console.log(query);
    console.log(response);
    // insert query
    const r = db.exec(`INSERT INTO chats VALUES (${chatid}, "${query}", "${response}")`);
    console.log(r);
    res.json([]);
    db.close();
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
