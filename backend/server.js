import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import { connect } from "./db.js";
import { AuctionModel } from "./models/AuctionModel.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

config({
  path: "./config.env",
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  //join room
  socket.on('join_room', (data) => {
    console.log(socket.id, "joined room ", data.title);
    socket.join(data._id);
    const currentTime = new Date();
    const end = new Date(data.endingTime);
    const remaining = end.getTime() - currentTime.getTime();
    console.log("remaining time: ", remaining);
    const timeoutID = setTimeout(() => {
      socket.to(data._id).emit('auction_closed', data);
    }, remaining);

    socket.timeoutID = timeoutID;
  });

  //leave room
  socket.on('leave_room', (data => {
    console.log("leaving room ", data.title)
    socket.leave(data._id);
    if (socket.timeoutID){
      console.log("clearing timeout");
      clearTimeout(socket.timeoutID);
    }
  }));

  //subscribe_all
  socket.on('subscribe_all', async () => {
    socket.join('subscribe_all');
    console.log(socket.id, " subscribed to updates for all auctions");
    const currentTime = new Date();
    const aucs = await AuctionModel.find({startingTime : {$lt : currentTime}, endingTime: {$gt : currentTime}});
    const allTimeouts = aucs.map(auc => {
      const timeleft = auc.endingTime.getTime() - currentTime.getTime();
      const t = setTimeout(() => {
        socket.to('subscribe_all').emit('auction_close', auc._id);
      }, timeleft);
      return t;
    })
    socket.allTimeouts = allTimeouts;

  });

  // unsubscribe all
  socket.on('unsubscribe_all', () => {
    socket.leave('subscribe_all');
    if (socket.allTimeouts){
      for (let i=0; i<socket.allTimeouts.length; i++)
        clearTimeout(socket.allTimeouts[i]);
    }
    console.log(socket.id + " left room subscribe_all");
  });

  //place bid
  socket.on('place_bid', (data) => {
    console.log("place_bid data received: ", data);
    socket.to(data.room).emit('receive_bid', data);
  });

  // new auction
  socket.on('new_auction_created', (data) => {
    console.log("new_auction_created data:", data);
    const currentTime = new Date();
    const start = new Date(data.startingTime);
    const end = new Date(data.endingTime);
    if (currentTime.getTime() >= start.getTime() && currentTime < end.getTime()){
      socket.to("subscribe_all").emit('new_auction_received', data);
      const remaining = end.getTime() - currentTime.getTime();
      const timeout = setTimeout(() => {
        socket.to(data._id).emit('auction_closed', data);
      }, remaining);
    }
  });

  // subscribe user
  socket.on('subscribe_user', async (username) => {
    console.log(username + " subscribed to user_updates_" + username);
    const room = 'user_updates_'+ username;
    const currentTime = new Date();
    const userWinningAuctions = await AuctionModel.find({maxBidder: username,  startingTime : {$lt : currentTime}, endingTime: {$gt : currentTime}});
    const userWinTimeouts = userWinningAuctions.map( auc => {
      const timeleft = auc.endingTime.getTime() - currentTime.getTime();
      const t = setTimeout(async () => {
        const finalAuc = await AuctionModel.findById(auc._id);
        console.log("executing timeout callback for ", auc.title);
        console.log("maxbidder: ", finalAuc.maxBidder);
        if (finalAuc.maxBidder === username){
          console.log("sending win msg to user_updates_" + username);
          socket.emit('auction_win', finalAuc);
        }
      }, timeleft);
      return t;
    });
    socket.userWinTimeouts = userWinTimeouts;
  });

  // unsubscribe user
  socket.on('unsubscribe_user', username => {
    console.log(username + " unsubscribed");
    if (socket.userWinTimeouts){
      for (let i=0; i<socket.userWinTimeouts.length; i++)
        clearTimeout(socket.userWinTimeouts[i]);
    }
  });


});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

connect();