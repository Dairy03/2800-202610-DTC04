import express from "express";
import dealsRouter from "./routes/deal.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use("/auth", authRouter);
app.use("/deals", dealsRouter);

app.listen(3000, () => {
  console.log("Live");
});
