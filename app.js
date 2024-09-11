const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});

app.use((req, res, next) => {
  req.user = {
    _id: "66e074d4bf95ee3e1cec9920", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(express.json());
app.use("/", indexRouter);
