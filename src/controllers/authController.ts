import jwt from "jsonwebtoken";
import { VerifyErrors, JwtPayload } from "jsonwebtoken";
import User from '../models/UserModel'
import Login from '../models/LoginModel'
import { Request, Response, NextFunction } from 'express';
let refreshAccessToken = async (req:Request, res:Response) => {
    try {
        let refreshToken = req.body.refreshToken;
        if (refreshToken) {
            //validate and refresh
            let checkRefreshTokenDB = await Login.findOne({
              refreshToken: refreshToken,
            });
            if(checkRefreshTokenDB) {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err:VerifyErrors, data:JwtPayload) => {
                    if (err) {
                      return res.status(400).json({
                        errCode: -1,
                        errMessage: "Accesstoken invalid",
                        errName: err.message
                      });
                    }
                    let userInfo = await User.findOne({ _id: data.userID });
                    // create new accesstoken
                    const accessToken = jwt.sign(
                        {
                        email: data.email,
                        name: data.name,
                        id: data.id,
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                        expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
                        }
                    );
                    checkRefreshTokenDB.accessToken = accessToken;
                    await checkRefreshTokenDB.save();
                    return res.status(201).json({
                        errCode: 0,
                        errMessage: "Refresh token success",
                        tokens: {accessToken: accessToken, refreshToken: refreshToken},
                        user: data,
                      });
                }  
            )}
            else {
                return res.status(400).json({
                    errCode: 2,
                    errMessage: 'Some thing went wrong, please Login again'
                })
            }
            
          
        }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
};
export default {refreshAccessToken}