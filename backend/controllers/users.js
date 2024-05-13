import { STATUS_CODES } from "http";
import { UserModel } from "../models/userModel.js";


class UserController{
    createUser = async (req,res,next) =>{ //signup
        console.log(req.body);
        const {username, password} = req.body;
        console.log(username, password);
        if (!username || !password)
            res.status(400).json("Username and Password required!");

        try{
            const existingUser = await UserModel.findOne({username});
            if (existingUser)
                res.status(400).json("username already taken");
            else{
                const newUser = await UserModel.create({
                    username,
                    password,
                    itemsOwned : []
                });
                res.status(201).json(newUser);
            }
        }
        catch (error){
            res.status(500).json(error);
        }   
    }
    getUser = async (req,res,next) => { //login
        const {username, password} = req.query;
        console.log(username, password);
        try{
        const user = await UserModel.findOne({username});
        console.log("user: ", user);
        if (!user)
            res.status(404).json("user not found");
        else if (user.password !== password)
            res.status(400).json("wrong password");
        else
            res.status(200).json(user);
        }
        catch (err)
        { res.status(500).json(err); }
    }
    changePassword = async (req,res,next) => {
        const {username, new_password} = req.body;
        try{
        const user = await UserModel.findOneAndUpdate({username}, {password: new_password}, {new : true});
        if (user)
            res.status(200).json("password updated");
        else 
            res.status(500).json("error");
        } catch (err){
            res.status(500).send(err);
        }
    }
}

const userController = new UserController();
export default userController;