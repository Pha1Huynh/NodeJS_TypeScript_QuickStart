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
        next(data);
    } else {
        next({ statusCode: 400, errMessage: 'Missing params' });
    }
});
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const dataFromClient = req.body;
    if (dataFromClient && dataFromClient.name && dataFromClient.password) {
        const data = await userServices.handleLogin(dataFromClient);

        next(data);
    } else {
        next({ statusCode: 400, errMessage: 'Missing params' });
    }
});
router.patch('/update', authenToken, async (req: customRequest, res: Response, next: NextFunction) => {
    const { dataFromClient } = req.body;
    const { userInfo } = req;
    if (dataFromClient && userInfo) {
        const data = await userServices.handleUpdateUser(userInfo, dataFromClient);
        next(data);
    } else {
        next({ statusCode: 400, errMessage: 'Missing params' });
    }
});

export = router;
