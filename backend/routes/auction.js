import express from "express";
import auctionCtrlr from "../controllers/auctions.js";

const auctionRouter = express.Router();
auctionRouter.route('/create').post(auctionCtrlr.createAuction);
auctionRouter.route('/active').get(auctionCtrlr.getActiveAuctions);
auctionRouter.route('/all').get(auctionCtrlr.getAllAuctions);
auctionRouter.route('/bid').post(auctionCtrlr.placeBid);
auctionRouter.route('/user').get(auctionCtrlr.getUserAuctions);
auctionRouter.route('/owned').get(auctionCtrlr.getUserItems);

export default auctionRouter;