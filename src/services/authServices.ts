import jwt from 'jsonwebtoken';

import User from '../models/userModel';
import Login from '../models/loginModel';
import { IdataUserFromMiddleware } from './userServices';
export const refreshAccessToken = async (refreshToken: string, userInfo: IdataUserFromMiddleware) => {
    if (refreshToken) {
        const checkRefreshTokenDB = await Login.findOne({
            refreshToken: refreshToken,
        });
        if (checkRefreshTokenDB) {
            const findUser = await User.findOne({ _id: userInfo.userID });
            console.log('check find user', findUser);

            const accessToken = await jwt.sign(
                {
                    name: findUser.name,
                    isAdmin: findUser.isAdmin,
                    password: findUser.password,
                    userID: findUser._id,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
                },
            );
            checkRefreshTokenDB.accessToken = accessToken;
            await checkRefreshTokenDB.save();

            return {
                tokens: { accessToken: accessToken, refreshToken: refreshToken },
            };
        }
    }
};
