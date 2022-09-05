import { Request, Response } from 'express';
import { validateUser, loginCredentialValidate } from '../middleware/user/userValidation';
import { isUserAuthenticated } from '../middleware/user/userAuthenticated';
import { userModel, generateRsaToken, User } from '../model/userModel';
import bcrypt from 'bcrypt';
import asyncMiddlewareHandleError from '../middleware/async';
import mongoose from 'mongoose';



// Wrapping the function expression in asyncMiddlewareHandleError
export const getUsers: any = asyncMiddlewareHandleError(async (req: Request, res: Response) => {
    let skipValue: number = 0;
    let limitValue: number = 0;
    // Getting skip and limit values for query parameters
    if (req.query.skip && req.query.limit) {
        skipValue = parseInt(req.query.skip as any);
        limitValue = parseInt(req.query.limit as any);
    }
    let sortValues: any = [];
    // Getting sort values for query parameters
    if (req.query.sortBy) {
        let sort = req.query.sortBy as any;
        sortValues = sort.split(':');
        sortValues[1] = sortValues[1].trim() === "desc" ? -1 : 1;
    }

    // Check user is authenticated or not
    let userToken: any = await isUserAuthenticated(req, res);
    // Filter the query for getting specifics userids
    let userids = req.query.id as any;
    let splitUserIds = userids != undefined ? userids.split(',') : [];
    // Filtering only ObjectIds
    let filtersplittedIds = splitUserIds.filter((id: any) => {
        let ObjectId = mongoose.Types.ObjectId;
        return ObjectId.isValid(id);
    });

    let filterUserIds: any = userids != undefined ? { _id: filtersplittedIds } : {};

    // Deciding the fields to project 
    let fields: any = userToken === "u-token" ? ["name", "email", "city", "marital_status", "mobile", "city", "createdAt", "updatedAt"] : ["name", "city"];
    const users = await userModel
        .find(filterUserIds)
        .sort([sortValues])
        .select(fields)
        .skip(skipValue)
        .limit(limitValue);

    res.status(200).send({ message: 'Users Fetched Successfully', users, feature: userToken });
});

// Wrapping the function expression in asyncMiddlewareHandleError
export const createUser: any = asyncMiddlewareHandleError(async (req: Request, res: Response) => {
    // Validating the user data 
    const { error } = await validateUser(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    // Checking if user alread exists with same email id
    const user: User = await userModel.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "User Already Created" });
    // Creating a new user to save in the database
    let newUser = new userModel(req.body);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    res.status(201).send({ message: 'User Created Successfully', user: newUser });

});

// Wrapping the function expression in asyncMiddlewareHandleError
export const loginUser: any = asyncMiddlewareHandleError(async (req: Request, res: Response) => {
    // Validating the login credential data 
    const { error } = loginCredentialValidate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    // Checking the user in database with provided email
    let user: User = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: 'Invalid Email or Password' });
    // Validating the user password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({ message: 'Invalid Email or Password' });
    // Generating RSA token to send back to the client
    let token = await generateRsaToken(user);
    res.status(200).send({ message: "Logged In Successfully", token });
});







