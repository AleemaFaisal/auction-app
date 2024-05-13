import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Landing(){
  const navigate = useNavigate();

    return (
      <div className='landing-pg'>
        <NavBar />
        <div className='landing-container'>
        <h1 style={{fontSize: "3rem", color: 'white'}} >Welcome to BidUp</h1>
        <h2 style={{fontSize:"2rem", color:'#f5bcef'}}><i>"Discover, Bid, Win: Auctions one Click Away!"</i></h2>
        <button className='landing-button' onClick={()=> navigate('/browse')} > Start Bidding </button>
        </div>
      </div>
    );
} 