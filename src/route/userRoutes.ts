import express from 'express';
import { authenToken } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import * as userServices from '../services/userServices';
const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const dataFromClient = req.body;

        const data = await userServices.handleRegister({
            name: dataFromClient.name,
            password: dataFromClient.password,
        });
        return res.status(201).json({ data });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Internal Server Error',
        });
    }
});
router.post('/login', async (req: Request, res: Response) => {
    try {
        const dataFromClient = req.body;
        const data = await userServices.handleLogin(dataFromClient);

        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Internal Server Error',
        });
    }
});
router.patch('/update', authenToken, async (req: Request, res: Response) => {
    try {
        const { dataFromClient, userInfo } = req.body;
        const data = await userServices.handleUpdateUser(userInfo, dataFromClient);
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
