interface auctionType {
    _id: string,
    title: string,
    description: string,
    startingPrice: number,
    startingTime: string,
    endingTime: string,
    currentPrice: number,
    createdBy: string,
    maxBidder? : string,
    bids: {bidder: string, bid: number}[]
}

export default auctionType;

