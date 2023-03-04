import jwt from "jsonwebtoken";

const handleBuildTokens = async (data:object) => {
  let token:object = {
  };
  const accessToken:string = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
  });

  const refreshToken:string = await jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  

  return {accessToken:accessToken,refreshToken:refreshToken};
};
export default { handleBuildTokens };
