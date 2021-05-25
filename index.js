const connectDB = require("./startup/db");
const express = require("express");
const app = express();
const user = require("./routes/user");
const cors = require("cors");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/user", user);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
