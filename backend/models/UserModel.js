import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
      type:  String,
      required: true
    },
    password: {
        type:  String,
        required: true
      },
    itemsOwned: [mongoose.Schema.Types.ObjectId]
});

export const UserModel = model("user", UserSchema);
