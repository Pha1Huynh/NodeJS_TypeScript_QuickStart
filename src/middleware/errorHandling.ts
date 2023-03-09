import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
interface customErr extends ErrorRequestHandler {
    statusCode: number;
    errMessage: string;
    data?: object;
}
export function errorHandler(err: customErr, req: Request, res: Response) {
    res.status(err.statusCode);
    if (err.data) {
        res.json({ errMessage: err.errMessage, data: err.data });
    } else {
        res.json({ errMessage: err.errMessage });
    }
}
