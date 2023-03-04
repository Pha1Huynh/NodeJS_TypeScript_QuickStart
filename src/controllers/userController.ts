import authServices from "../services/authServices";
import User from '../models/UserModel'
import Login from '../models/LoginModel'
import buildTokens from '../ultils/buildTokens';
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

let handleRegister = async (req:Request, res:Response) => {
  try {
    const dataFromClient = req.body;
    const user = await new User(dataFromClient);
    let saveUser = await user.save();
    
    return res.status(201).json({
      errCode: 0,
      errMessage: 'Create a new user success',
      data:saveUser
      
    });
  } catch (e) {
    console.log(e);
    return res.status(501).json({
      errCode: -1,
      errMessage: e,
      
    });
  }
};
let handleLogin = async (req:Request, res:Response) => {
  try {
    const dataFromClient = req.body;
    let data = await authServices.handleLogin(dataFromClient);
    
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
let handleUpdateUser = async(req:Request, res:Response) => {
  try {
    
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(200).json({
        errCode: -1,
        errMessage: "Undefined accesstoken",
      });
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(200).json({
        errCode: -1,
        errMessage: "Undefined accesstoken",
      });
    }
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(200).json({
          errCode: -1,
          errMessage: "Accesstoken invalid",
          errName: err.message,
        });
      }
      
    });
    
    const dataFromClient = req.body
    let data = await authServices.handleUpdateUser(accessToken, dataFromClient)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from server'
    })
  }
}
// let handleLogout = async (req, res) => {
//   try {
//     let data = await authServices.handleLogout(req.body.refreshToken);

//     return res.status(200).json(data);
//   } catch (e) {
//     console.log(e);
//     return res.status(200).json({
//       errCode: -1,
//       errMessage: "Error from server",
//     });
//   }
// };

export default {
 
  handleRegister,
  handleLogin,
  handleUpdateUser
  
};
