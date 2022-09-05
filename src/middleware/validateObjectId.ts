import { NextFunction } from 'express';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export = (req: Request | any, res: Response | any, next: NextFunction) => {
    if (req.query.userid && !ObjectId.isValid(req.query.userid)) {
        return res.status(404).send({ message: `Userid is incorrect , please provide correct userid` });
    }
    if (
        (req.query.postid && !ObjectId.isValid(req.query.postid)) ||
        (req.params.postid && !ObjectId.isValid(req.params.postid))
    ) {
        return res.status(404).send({ message: `Postid is incorrect , please provide correct postid` });
    }
    next();
};