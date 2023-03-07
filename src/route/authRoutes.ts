import express from 'express';

import { Request, Response } from 'express';
import * as authServices from '../services/authServices';
const router = express.Router();
router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        const data = await authServices.refreshAccessToken(refreshToken);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Internal Server Error',
        });
    }
});
export = router;
