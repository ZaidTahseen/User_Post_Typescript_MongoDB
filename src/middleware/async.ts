import { NextFunction } from 'express';
import { Response, Request } from 'express';

export default function asyncMiddlewareHandleError (handler: any) {

    return async (req: Response, res: Request, next: NextFunction) => {
        try {
            await handler(req, res);
        }
        catch (err) {
            next(err);
        }
    };
}