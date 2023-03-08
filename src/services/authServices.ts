import jwt from 'jsonwebtoken';
import { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel';
import Login from '../models/loginModel';

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        if (refreshToken) {
            //validate and refresh
            const checkRefreshTokenDB = await Login.findOne({
                refreshToken: refreshToken,
            });
            if (checkRefreshTokenDB) {
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    async (err: VerifyErrors, data: JwtPayload) => {
                        if (err) {
                            return {
                                errCode: -1,
                                errMessage: 'Accesstoken invalid',
                                errName: err.message,
                            };
                        }
                        await User.findOne({ _id: data.userID });
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
                            },
                        );
                        checkRefreshTokenDB.accessToken = accessToken;
                        await checkRefreshTokenDB.save();
                        return {
                            errCode: 0,
                            errMessage: 'Refresh token success',
                            tokens: { accessToken: accessToken, refreshToken: refreshToken },
                            user: data,
                        };
                    },
                );
            } else {
                return {
                    errCode: 2,
                    errMessage: 'Some thing went wrong, please Login again',
                };
            }
        }
    } catch (e) {
        return e;
    }
};
