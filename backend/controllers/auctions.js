import { AuctionModel } from "../models/AuctionModel.js";
import { UserModel } from "../models/userModel.js";

class auctionController {
    createAuction = async (req,res,next) => {
        console.log("req body: ", req.body);
        console.log(req.body.createdBy);
        try{
            const newAuction = await AuctionModel.create(req.body);
            res.status(200).json(newAuction);
        }
        catch (err){
            console.log(err);
            res.status(500).json(err);
        }
    }

    getActiveAuctions = async (req,res,next) => {
        const currentTime = new Date();
        try{
            const allDocs = await AuctionModel.find({startingTime : {$lt : currentTime}, endingTime: {$gt : currentTime}});
            res.status(200).json(allDocs);
        }
        catch (error){
            res.status(500).json(error);
        }
    }

    getAllAuctions = async (req,res,next) => {
        const currentTime = new Date();
        try{
            const active = await AuctionModel.find({startingTime : {$lt : currentTime}, endingTime: {$gt : currentTime}});
            const closed = await AuctionModel.find({ $or: [{startingTime : {$gt : currentTime}}, {endingTime: {$lt : currentTime}}]});            
            res.status(200).json({active, closed});
        }
        catch (error){
            res.status(500).json(error);
        }
    }
    placeBid = async (req,res,next) => {
        const {auctionId, bid, username} = req.body;
        console.log(auctionId, bid, username);
        if (!auctionId || !bid || !username)
            res.status(400).json("missing info");
        else {
            const auction = await AuctionModel.findOneAndUpdate({_id: auctionId}, { $push : {bids: {bidder: username, bid: Number(bid)}}, currentPrice: bid, maxBidder: username}, {new: true});
            console.log(auction);
            if (!auction)
                res.status(400).json("invalid auction id");
            else{
                res.status(200).json(auction);
            }
        }
    }
    getUserAuctions = async (req,res,next) => {
        const {username} = req.query;
        if (!username)
            res.status(400).json("username missing");
        else{
           try{ 
                const aucs = await AuctionModel.find({createdBy: username});
                res.status(200).json(aucs);
           } catch (err) {
                res.status(500).json(err);
           }
        }
    }
    getUserItems = async (req,res,next) => {
        const {username} = req.query;
        if (!username)
            res.status(400).json("username missing");
        else{
           try{ 
            const currentTime = new Date();
                const aucs = await AuctionModel.find({endingTime: {$lt : currentTime}, maxBidder: username});
                const aucIDs = aucs.map(auc => auc._id);
                const user = await UserModel.findOneAndUpdate({itemsOwned: aucIDs});
                res.status(200).json(aucs);
           } catch (err) {
                res.status(500).json(err);
           }
        }
    }
}

const auctionCtrlr = new auctionController();
export default auctionCtrlr;