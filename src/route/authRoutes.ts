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

        if (data && data) {
            res.status(200).json({ data: data });
        } else {
            res.status(403).json({ mesage: 'Something went wrong, please login again' });
        }
    } else {
        next({ statusCode: 400, message: 'Missing params' });
    }
});
export = router;
