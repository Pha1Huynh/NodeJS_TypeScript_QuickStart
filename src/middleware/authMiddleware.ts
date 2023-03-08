import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IdataUserFromMiddleware } from '../services/userServices';
export interface customRequest extends Request {
    userInfo: IdataUserFromMiddleware;
}
export const authenToken = (req: customRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    // 'Beaer [token]'
    if (!authorizationHeader) {
        res.status(417).json({
            errCode: -1,
            errMessage: 'Undefined accesstoken',
        });
    }

    if (authorizationHeader.indexOf(process.env.TOKEN_NAME, 0) === 0) {
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            res.status(417).json({
                errCode: -1,
                errMessage: 'Undefined accesstoken',
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data: IdataUserFromMiddleware) => {
            if (err) {
                res.status(400).json({
                    errCode: -1,
                    errMessage: 'Accesstoken invalid',
                    errName: err.message,
                });
            } else {
                req.userInfo = data;

                next();
            }
        });
    } else {
        res.status(417).json({
            errCode: -1,
            errMessage: 'Token invalid',
        });
    }
};
