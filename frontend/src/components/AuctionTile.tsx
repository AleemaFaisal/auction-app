import { LockClock, Timelapse } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { selectItem } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import SellIcon from '@mui/icons-material/Sell';
import auctionType from "../types/auctionType";

interface auctionPropType{
    auction: auctionType
}

export default function AuctionTile({auction} : auctionPropType){
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    console.log("auction in tile: ", auction);
    
    const handleView =() => {
        dispatch(selectItem(auction));
        navigate('/specific-auction');
    }

    return(
        <Paper elevation={2} sx={{width:'300px'}}>
            <h1 style={{marginLeft: '5px'}}>{auction.title}</h1>
            <hr style={{marginLeft:'2px', marginRight: '2px'}}></hr>
            <div className="auction-tile">
                <SellIcon sx={{color: 'purple', fontSize: '3rem'}} />
                <div className="auction-tile-right">
                    <h2 style={{margin: '0', color: 'green'}} >${auction.currentPrice}</h2>
                    <button onClick={handleView} className="button-fancy">View Auction</button>
                </div>
            </div>
        </Paper>
    );
}