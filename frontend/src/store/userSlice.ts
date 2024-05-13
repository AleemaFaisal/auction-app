import { createSlice } from "@reduxjs/toolkit";
import auctionType from "../types/auctionType";

const initSelected = {
    _id: "",
    title: "",
    description: "",
    startingPrice: 0,
    startingTime: "",
    endingTime: "",
    currentPrice: 0,
    createdBy: "",
    maxBidder : "",
    bids : []
}

interface user {
    username: String,
    _id: String,
    itemsOwned: String[],
    selectedItem: auctionType,
}

const initialState : user = {
    username : "",
    _id: "",
    itemsOwned : [],
    selectedItem: initSelected,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login : (state, action) => {
            const {username, _id, itemsOwned} = action.payload;
            console.log("login reducer, payload: ", action.payload)
            const newstate = {
                username,
                _id,
                itemsOwned,
                selectedItem : initSelected
            };
            console.log("state: ", state);
            return newstate;
        },
        logout : (state) => {
            return initialState;
        },
        selectItem : (state, action) => {
            console.log("in dispatch, selected: ", action.payload);
            const newstate = {
                ...state,
                selectedItem : action.payload
            };
            return newstate;
        }
    }
})

export default userSlice.reducer;
export const {login, logout, selectItem} = userSlice.actions;