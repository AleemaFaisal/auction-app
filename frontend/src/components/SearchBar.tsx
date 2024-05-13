import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps{
    onSearch: ( query: string) => void;
}

export default function SearchBar({onSearch} : SearchProps){
    const [text, setText] = useState("");

    function handleChange(e : any){
        setText(e.target.value);
        if (e.target.value === "")
                onSearch("");
        else
            onSearch(e.target.value);
    }

    function handleSearch(){
        console.log("in search");
        if (text.trim() != "")
            onSearch(text);
        setText("");
    }

    return (
        <div className="search-bar">
            <input type="text" value={text} onChange={handleChange} placeholder="Filter auctions" className="search-input" />
            <button onClick={handleSearch} className="search-button"><FaSearch className="search-icon" /></button>
        </div>
    )
}