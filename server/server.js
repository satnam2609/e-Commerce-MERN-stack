const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

//middleware
app.use(morgan("dev"));
// app.use(
//   bodyParser.json({
//     limit: "50mb",
//   })
// );
app.use(bodyParser.json({ limit: "50mb" }));

// app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

// routes

fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);
// port
const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}...`)
);
