import { Request, Response, NextFunction } from 'express';

export = (error: any, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send({ success: false, message: "Internal Serve Error", error: error.message || 'Internal Server Error' });
};