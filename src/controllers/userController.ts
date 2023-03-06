
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
    let findUser = await User.findOne(dataFromClient)
    
      if(findUser) {
          let {accessToken, refreshToken} = await buildTokens.handleBuildTokens(
              {...dataFromClient, isAdmin: findUser.isAdmin,userID:findUser._id})
          let userID = findUser._id
          
          let findLogin = await Login.findOne({userID});
          console.log('check findLogin', findLogin)
          if(findLogin) {
              let deleteLogin = await Login.deleteOne({userID})
              
          }
              const login = new Login({userID,accessToken,refreshToken})
              
              await login.save()
              return res.status(201).json({
                  errCode: 0,
                  errMessage: 'Login sucess',
                  tokens: {accessToken: accessToken, refreshToken: refreshToken},
                  user: findUser
              })
      }
      else {
          return res.status(201).json({
              errCode: -2,
              errMessage: 'User not found'
          })
      }
      
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
let handleUpdateUser = async(req:Request, res:Response) => {
  try {
    
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(400).json({
        errCode: -1,
        errMessage: "Undefined accesstoken",
      });
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({
        errCode: -1,
        errMessage: "Undefined accesstoken",
      });
    }
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(400).json({
          errCode: -1,
          errMessage: "Accesstoken invalid",
          errName: err.message,
        });
      }
      
    });
    
    const dataFromClient = req.body
    let findAccessToken = await Login.findOne({accessToken:accessToken})
        if(findAccessToken) {
            let updateUSer = await User.updateOne({_id:findAccessToken.userID},dataFromClient)
            
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Update Success'
            })
        }
        else {
            return res.status(400).json({
                errCode: -2,
                errMessage: 'Something went wrong, please Login again'
            })
        }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server'
    })
  }
}


export default {
  handleRegister,
  handleLogin,
  handleUpdateUser
  
};
