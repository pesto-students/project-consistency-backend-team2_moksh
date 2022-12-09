const express = require("express");
const app = express();
const cors = require("cors");
const Route = require("./routes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 1337;
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(Route);

app.use(express.urlencoded({ extended: false }));

async function EstablishConnection() {
  await mongoose
    .connect(
      "mongodb+srv://project-consistency:pesto_p3_cohort@cluster0.fkzjjds.mongodb.net/project-consistency", // project-consistency is DB name
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error(err));
}
EstablishConnection();

app.listen(PORT, () => {
  console.log("Server running on 1337");
});
