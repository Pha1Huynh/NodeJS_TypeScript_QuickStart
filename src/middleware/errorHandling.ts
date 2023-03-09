import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
interface customErr extends ErrorRequestHandler {
    statusCode: number;
    message: string;
    data?: object;
}
export function errorHandler(err: customErr, req: Request, res: Response, next: NextFunction) {
    res.status(err.statusCode);

    res.json({ message: err.message });
}
