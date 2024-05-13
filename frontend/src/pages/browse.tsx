import { useEffect, useState } from "react";
import AuctionTile from "../components/AuctionTile";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { socketClient } from "../socket/socket";
import NavBar from "../components/NavBar";
import auctionType from "../types/auctionType";

export default function Browse(){
    const [allAuctions, setAllAuctions] = useState<auctionType[]>([]);
    const [displayAuctions, setDisplayAuctions] = useState<auctionType[]>([]);
    const [msg, setMsg] = useState<string>("loading...")
    const [filter, setFilter] = useState<string>("");
    
    const handleFilter = (text : string) => {
        setFilter(text);
        const filtered = allAuctions.filter( (auction : auctionType) => auction.title.includes(text));
        setDisplayAuctions(filtered);
        if (filtered.length === 0)
            setMsg("No Auctions Found");
        else if (msg == "No Auctions Found")
            setMsg("");
    }

    useEffect( () => {
        let ignore = false;
        async function getData() {
            const url = "http://localhost:8000/auctions/active";
            try{
                await axios.get(url)
                .then( res =>  {
                    console.log("res data:",  res.data);
                    if (!ignore) {
                        if (res.data.length == 0)
                                setMsg("No Active Auctions");
                        else{
                            setAllAuctions(res.data);
                            setDisplayAuctions(res.data);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    setMsg("oops, an error occured!")
                })
            } catch (err)
            { 
                console.log(err);
                setMsg("oops, an error occured!");
            }
        }
        getData();
        return () => {ignore = true};
    }, [])

    useEffect(() => {
        let ignore = false;
        console.log("running effect, auctions: ", allAuctions);
        socketClient.emit('subscribe_all');
        socketClient.on('new_auction_received', (data => {
            console.log("new_auction_recieved in browse: ", data);
            let newAuctions = allAuctions.slice();
            newAuctions.push(data);
            console.log("newauctions: ", newAuctions);
            if (!ignore){
                setAllAuctions(newAuctions);
                if (filter === "")
                    setDisplayAuctions(newAuctions);
            }
        }))
        return () => {
            socketClient.emit('unsubscribe_all');
            ignore = true;
        }
    }, [socketClient, allAuctions])

    useEffect(() => {
        let ignore = false;
        socketClient.on('auction_close', data => {
            console.log("auction_close received: ", data);
            const newData = allAuctions.filter((auction : auctionType) => auction._id !== data);
            if (!ignore){
                setAllAuctions(newData);
                if (filter=== "")
                    setDisplayAuctions(newData);
            }
        })
        return () => {ignore = true}
    }, [socketClient, allAuctions])

    return (
        <div className="browse pg">
            <NavBar />
            <SearchBar onSearch={handleFilter} />
            {displayAuctions ? 
            <div className="display-auctions">
                {displayAuctions.length!=0 && displayAuctions.map( (auctionx : auctionType) => 
                    <AuctionTile auction={auctionx} />
                )}
            </div> 
            :  
            <h2 style={{width: '100%', textAlign: 'center'}} >{msg}</h2>}
        </div>
    );
}