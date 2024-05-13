import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";
import { socketClient } from "../socket/socket";
import NavBar from "../components/NavBar";

interface formDataType {
    title: string,
    description: string,
    startingPrice: number,
    startingTime: string,
    endingTime: string
}

const initFormData : formDataType = {
    title: "",
    description: "",
    startingPrice: 0 ,
    startingTime: "",
    endingTime: ""    
}

interface msgType {
    msg : string,
    color: string
}

const initMsg : msgType = {
    msg : "",
    color : ""
}

export default function CreateAuction() {
    const [formData, setFormData] = useState(initFormData)
    const [msg, setMsg] = useState<msgType>(initMsg);
    const username = useSelector((state: RootState) => state.user.username);

    const handleChange = (e : any) => {
        const newData = {
            ...formData,
            [e.target.name] : e.target.value,
        };
        setFormData(newData);
        if (msg.msg!=="")
            setMsg(initMsg);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (formData.title.trim() === "") 
            setMsg({msg: "enter non-empty title", color : "red"});
        else if (formData.description.trim() === "")
            setMsg({msg: "enter non-empty description", color : "red"});
        else {
            const startDate = new Date(formData.startingTime);
            const endDate = new Date(formData.endingTime);
            const diff = endDate.getTime() - startDate.getTime();
            if (diff < 0)
                setMsg({msg: 'End time must be after start time!', color: 'red'});
            else{
                const url = "http://localhost:8000/auctions/create";
                console.log("sending request to create auction");
                try{
                    await axios.post(url, {
                        title: formData.title,
                        description: formData.description,
                        startingPrice: formData.startingPrice,
                        startingTime: startDate,
                        endingTime: endDate,
                        createdBy: username,
                        currentPrice: formData.startingPrice
                    })
                    .then (res => {
                        console.log(res.data);
                        setMsg({msg: 'Auction Created!', color: 'green'});
                        socketClient.emit('new_auction_created', res.data);
                        setFormData(initFormData);
                    })
                    .catch(err => setMsg({msg: 'Oops, an error occured. Try again.', color: 'red'}));
                }
                catch (err){
                    setMsg({msg: 'Oops, an error occured. Try again.', color: 'red'});
                }
            }
        }
    }

    return (
        <div className="pg">
            <NavBar />
            <div className="auction-container">
            <h1>Create Auction</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="itemImage">Item Image:</label>
                <input type="file" id="itemImage" name="itemImage" accept="image/*" />
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" minLength={1} required value={formData.title} onChange={handleChange} />
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" rows={4} required value={formData.description} onChange={handleChange} ></textarea>
                <label htmlFor="startingPrice">Starting Price:</label>
                <input type="number" id="startingPrice" name="startingPrice" min="0" step="1"  value={formData.startingPrice} onChange={handleChange} required />
                <label htmlFor="startingTime">Start Time:</label>
                <input type="datetime-local" id="startTime" name="startingTime" value={formData.startingTime} onChange={handleChange} required />
                <label htmlFor="endingTime">End Time:</label>
                <input type="datetime-local" id="endTime" name="endingTime" value={formData.endingTime} onChange={handleChange} required />
                <button type="submit">Create Auction</button>
            </form>
            {msg.msg!=="" && <p style={{color: msg.color, textAlign: 'center', width: '100%'}} >{msg.msg}</p>}
            </div>
        </div>
    );
}