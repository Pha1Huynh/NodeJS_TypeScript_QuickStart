import express from 'express';
import { authenToken } from '../middleware/authMiddleware';
import { Response, NextFunction } from 'express';
import * as authServices from '../services/authServices';
import { customRequest } from '../middleware/authMiddleware';
const router = express.Router();
router.post('/refresh-token', authenToken, async (req: customRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken;
    const { userInfo } = req;
    if (refreshToken) {
        const data = await authServices.refreshAccessToken(refreshToken, userInfo);
        console.log('check data from rfToken', data);
        if (data && data.data) {
            res.status(201).json(data);
        } else {
            res.status(403).json(data);
        }
    } else {
        next({ statusCode: 400, errMessage: 'Missing params' });
    }
});
export = router;
