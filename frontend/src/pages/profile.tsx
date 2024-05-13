import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuctionTile from '../components/AuctionTile';
import NavBar from '../components/NavBar';
import auctionType from '../types/auctionType';
import { Button } from '@mui/material';
import { socketClient } from '../socket/socket';

interface msgType {
    msg : string,
    color: string
}

const initMsg : msgType = {
    msg : "",
    color : ""
}

export default function Profile(){
    const [displayChangePass, setDisplayChangePass] = useState<Boolean>(false);
    const [newPass, setNewPass] = useState<string>("");
    const username = useSelector((state :  RootState) => state.user.username);
    const [resMsg, setResMsg] = useState(initMsg);
    const [myAuctions, setMyAuctions]= useState<auctionType[]>([]);
    const [itemsOwned, setItemsOwned]= useState<auctionType[]>([]);
    const [msgA, setMsgA]= useState("loading..."); // my auctions
    const [msgO, setMsgO]= useState("loading..."); // items owned
    
    const handleClick = async () => {
        if (newPass.trim() !== ""){
            const url ="http://localhost:8000/users/changePassword";
            try{
                await axios.post(url, {
                    username,
                    new_password: newPass,
                })
                .then (res => setResMsg({msg: res.data, color: 'green'}))
                .catch(err => setResMsg({msg: err.response.data + ". Please try again.", color : 'red'}));
                setNewPass("");
            } catch(err){
                setResMsg({msg: "Oops, and error occured. Please try again.", color : 'red'});
            }
        }
        else
            setResMsg({msg: "password cannot be blank", color : 'orange'});
    }

    useEffect(() => {
        let ignore = false;
        async function getData() {
            const url = "http://localhost:8000/auctions/user";
            try{
                await axios.get(url, {
                    params: {
                        username
                    }
                })
                .then( res =>  {
                    if (!ignore){
                    console.log(res.data);
                    if (res.data.length == 0)
                            setMsgA("No Created Auctions");
                    else{
                        setMyAuctions(res.data);
                        setMsgA("");
                    }
                }
                })
                .catch(err => {
                    if (!ignore){
                    console.log(err);
                    setMsgA("oops, an error occured!");
                    }
                })
            } catch (err){ 
                if (!ignore){
                console.log(err);
                setMsgA("oops, an error occured!");
                }
            }
        }
        getData();
        return () => {ignore = true};
    }, [])

    useEffect(() => {
        let ignore = false;
        async function getData() {
            const url = "http://localhost:8000/auctions/owned";
            try{
                await axios.get(url, {
                    params: {
                        username
                    }
                })
                .then( res =>  {
                    if (!ignore){
                    console.log(res.data);
                    if (res.data.length == 0)
                            setMsgO("No Items Owned");
                    else{
                        setItemsOwned(res.data);
                        setMsgO("");
                    }
                }
                })
                .catch(err => {
                    if (!ignore){
                    console.log(err);
                    setMsgO("oops, an error occured!");
                    }
                })
            } catch (err){ 
                if (!ignore){
                console.log(err);
                setMsgO("oops, an error occured!");
                }
            }
        }
        getData();
        return () => {ignore = true};
    }, [])

    useEffect(() => {
        console.log(username + " subscribing in effect");
        socketClient.emit('subscribe_user', username);
        socketClient.on('auction_win', (auc => {
            console.log("received auction win!")
            let newItemsOwned = itemsOwned.slice();
            newItemsOwned.push(auc);
            setItemsOwned(newItemsOwned);
        }));
        return () => {
            console.log(username + " unsubscribing in effect");
            socketClient.emit('unsubscribe_user', username)
        };

    }, [socketClient, itemsOwned])


    return (
        <div className='pg'>
            <NavBar />
            <Paper elevation={3} sx={{width: '90vw', overflowY: 'visible', marginLeft: '2%', backgroundColor: '#ffffff27'}}>
                <div className='profile-ppr'>
                <p className='auction-title'><strong>{username}</strong></p>
                <p className='auction-desc'><strong>{username}</strong></p>
                <p></p>
                <Button size='medium' variant='contained' color='secondary' onClick={()=> {setDisplayChangePass(!displayChangePass); setResMsg(initMsg);}} >{displayChangePass ? "Cancel" : "Change Password"}</Button>
                {displayChangePass && 
                    <div className='change-pass'>
                        <label htmlFor='newPassword' id='newPassword'>New Password: <input type='password' placeholder='enter new password'  required value={newPass} onChange={(e) => setNewPass(e.target.value)} id='newPass' /></label>
                        <Button onClick={handleClick} variant='contained' color='secondary' size='small' > Confirm</Button>
                        {resMsg.msg!=="" && <p style={{color:resMsg.color}}>{resMsg.msg}</p>}
                    </div>
                }
                    <hr />
                    <h2 className='auction-title glow' >My Items</h2>
                    {itemsOwned && 
                        <div className='auctions-grid'>
                        {itemsOwned.map((auction : auctionType) => 
                            <AuctionTile key={auction._id} auction={auction} /> )
                        }
                        </div>
                    }
                    {msgO!=="" && <p>{msgO}</p>}                
                    <h2 className='auction-title glow'>My Auctions</h2>
                    {myAuctions && 
                        <div className='auctions-grid'>
                        {myAuctions.map((auction : auctionType) => 
                            <AuctionTile key={auction._id} auction={auction} /> )
                        }
                        </div>
                    }
                    {msgA!=="" && <p>{msgA}</p>}
                </div>
            </Paper>
        </div>
    );
}