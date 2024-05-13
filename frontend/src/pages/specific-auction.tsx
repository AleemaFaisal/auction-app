import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../store/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { socketClient } from "../socket/socket";
import NavBar from "../components/NavBar";
import { Paper } from "@mui/material";
import auctionType from "../types/auctionType";
import { selectItem } from "../store/userSlice";

function SpecificAuction(){    
    const auction = useSelector((state: RootState) => state.user.selectedItem);
    const username = useSelector((state: RootState) => state.user.username);
    const data = store.getState().user.selectedItem;
    const dispatch = useDispatch<AppDispatch>();
    console.log("data: ", data);

    const [auctionData, setAuctionData] = useState<auctionType>(auction);
    const [userBid, setUserBid] = useState(auctionData.currentPrice+1);
    const [msg, setMsg] = useState("");

    let bids = [...auctionData.bids];
    bids.reverse();

    const currentTime = new Date();
    const endTime = new Date(auction.endingTime);
    const startTime = new Date(auction.startingTime);

    let disMsg = "";

    if  (endTime.getTime() < currentTime.getTime()){
        let winner = (!auctionData.maxBidder || auctionData.maxBidder==="") ? "none" : auctionData.maxBidder;
        disMsg = "Auction Closed. Winner : " + winner;
    }
    else if (auctionData.createdBy === username)
        disMsg = "You cannot bid on your own auction";
    const [disableMsg, setDisableMsg] = useState(disMsg);

    console.log(auctionData);
    console.log("bids:", auctionData.bids);
    
    useEffect(() => {
        socketClient.emit('join_room', data);
        return () => {socketClient.emit('leave_room', data)}
    }, [])

    useEffect( () => {
        let ignore = false;
        socketClient.on('receive_bid', (data) => {
            console.log("received bid: ", data);
            const newData = data.updatedData;
            if (!ignore){
                setAuctionData(newData);
                dispatch(selectItem(newData));
            }
        });
        return () => {ignore = true};
    }, [socketClient])

    useEffect(() => {
        socketClient.on('auction_closed', data => {
            let winner = store.getState().user.selectedItem.maxBidder;
            if (!winner || winner==="")
                winner = "none";
            console.log("received close msg. bids: ", winner);
            setDisableMsg("Auction Closed. Winner: " + winner);
        })
    }, [socketClient])

    const handleClick = async () => {
        if (userBid <= auctionData.currentPrice)
            setMsg("Bid must be higher than current bid");
        else{
            const url = "http://localhost:8000/auctions/bid";
            try{
                await axios.post(url, {
                    auctionId: auction._id,
                    bid: userBid,
                    username
                })
                .then(res => {
                    console.log(res.data);
                    setAuctionData(res.data);
                    setUserBid(userBid+1);
                    dispatch(selectItem(res.data));
                    console.log("emitting place_bid");
                    socketClient.emit('place_bid',{updatedData: res.data, room: data._id});
                })
                .catch(err => console.log(err));
            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleBidChange = (e:any) => {
        setUserBid(Number(e.target.value));
        if (msg!=="")
            setMsg("");
    }

    return (
        <div className="pg">
            <NavBar />
            <Paper elevation={3} sx={{margin: '5px auto', width: '60%', maxWidth: '800px', padding: '10px', backgroundColor: '#ffffff6f'}}>
                <div className="auction-title-box"><h1 className="auction-title specific" >{auctionData.title}</h1></div>
                <p className="auction-desc specific">{auctionData.description}</p>
                <p><strong>Starting Price:</strong> ${auctionData.startingPrice}</p>
                <h4><strong>Starting Time:</strong>{startTime.toLocaleString()}</h4>
                <h4 style={{color: 'rgb(230, 126, 115)'}}><strong>Ending Time: </strong>{endTime.toLocaleString()}</h4>
                <h2 className="auction-price glow" ><strong>{disableMsg==="" ? "Current" : "Winning"} Price: </strong>${auctionData.currentPrice}</h2>
                { disableMsg!=="" ? (<p className="winner auction-price glow"><strong>{disableMsg}</strong></p>) :
                    (<div>
                        <input className="bid-input" type="number" min={auctionData.currentPrice+1} value={userBid} placeholder="Bid Value" onChange={handleBidChange} />
                        <button onClick={handleClick} className="bid-button" > Make Bid </button>
                        {msg!=="" && <p style={{color: 'red'}}>{msg}</p>}
                    </div>) 
                }
                <div>
                    <h1>Bids: </h1>
                    {bids.length>0 ? 
                        <div className="bids">
                        {bids.map((bid, i) => 
                        <div className={(i===0) ? "bid top" : "bid"}>
                            <h4>${String(bid.bid)}</h4>
                            <h4>{bid.bidder}</h4> 
                        </div>)}
                        </div>
                    :
                    <p>No Bids</p>}
                </div>
            </Paper>
        </div>
    );

}

export default SpecificAuction;