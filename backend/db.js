import mongoose from "mongoose";

export const connect = async () => {
    try{
        console.log("connecting to db: ", process.env.MONGO_URI);
        const data = await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db");
    }
    catch (err)
       { console.log(err);}
}