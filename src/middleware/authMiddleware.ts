import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

let authenToken = (req:Request, res:Response, next:NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  // 'Beaer [token]'
  if (!authorizationHeader) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Undefined accesstoken",
    });
  }
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Undefined accesstoken",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      res.status(200).json({
        errCode: -1,
        errMessage: "Accesstoken invalid",
        errName: err.message,
      });
    } else {
      next();
    }
  });
};
// let refreshAccessToken = async (req, res) => {
//   try {
//     let data = await authServices.refreshAccessToken(req.body.refreshToken);
//     if (data.errCode === 0) {
//       return res.status(200).json(data);
//     } else {
//       res.status(403).json(data);
//     }
//   } catch (e) {
//     console.log(e);
//     return res.status(200).json({
//       errCode: -1,
//       errMessage: "Error from server",
//     });
//   }
// };
export default {authenToken}