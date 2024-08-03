const express = require("express");
const app = express();
const { router } = require("./routes/users");
const cors = require('cors');
const serverless = require("serverless-http");

// const PORT = 8000 || process.env.PORT;

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use("/api/users", router);

// app.listen(PORT, () => console.log(`Server started on ${PORT}`));
module.exports.handler = serverless(app);
