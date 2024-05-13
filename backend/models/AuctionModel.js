import mongoose, {model, mongo} from "mongoose";

const AuctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    startingTime:{
        type: Date,
        required: true
    },
    endingTime:{
        type: Date,
        required: true
    },
    currentPrice: Number,
    createdBy: {
        type: String,
        required: true
    },
    maxBidder: String,
    bids: [{bidder: String, bid: Number}]
});

export const AuctionModel = model("auction", AuctionSchema);