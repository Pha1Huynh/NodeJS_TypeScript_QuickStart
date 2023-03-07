import jwt from "jsonwebtoken";

export interface IUserInfo {
  name: string,
  password: string,
  isAdmin: boolean,
  userID: string,
} 
export const handleBuildTokens = async (userInfo:IUserInfo) => {
  
  const accessToken:string = await jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
  });
  const refreshToken:string = await jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
  

  return {accessToken:accessToken,refreshToken:refreshToken};
};

