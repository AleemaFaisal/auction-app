import express from "express";
import cors from "cors";
import auctionRouter from "./routes/auction.js";
import userRouter from "./routes/user.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auctions', auctionRouter);
app.use('/users', userRouter)
