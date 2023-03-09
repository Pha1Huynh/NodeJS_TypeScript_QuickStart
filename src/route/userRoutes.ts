import express from 'express';
import { authenToken } from '../middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/userServices';
import { customRequest } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const dataFromClient = req.body;
    if (dataFromClient && dataFromClient.name && dataFromClient.password) {
        const data = await userServices.handleRegister({
            name: dataFromClient.name,
            password: dataFromClient.password,
        });
        if (data) {
            res.status(201).json({ message: 'Created success', data: data });
        }
    } else {
        next({ statusCode: 400, message: 'Missing params' });
    }
});
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const dataFromClient = req.body;
    if (dataFromClient && dataFromClient.name && dataFromClient.password) {
        const data = await userServices.handleLogin(dataFromClient);
        if (data) {
            res.status(201).json({ data: data });
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    } else {
        next({ statusCode: 400, message: 'Missing params' });
    }
});
router.patch('/update', authenToken, async (req: customRequest, res: Response, next: NextFunction) => {
    const { dataFromClient } = req.body;
    const { userInfo } = req;
    if (dataFromClient && userInfo) {
        const data = await userServices.handleUpdateUser(userInfo, dataFromClient);
        if (data) {
            res.status(201).json({ message: 'Updated success', data: data });
        }
    } else {
        next({ statusCode: 400, message: 'Missing params' });
    }
});

export = router;
