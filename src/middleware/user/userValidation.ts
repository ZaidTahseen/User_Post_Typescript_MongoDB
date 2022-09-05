import Joi from 'joi';
import { User } from '../../model/userModel';


// Validation function for validating user Incoming requests 
export function validateUser (user: User) {

    const userSchema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(5).max(25).required(),
        maritalStatus: Joi.equal(0, 1).required(),
        mobile: Joi.number().min(10).required(),
        city: Joi.string().min(3).max(20).required()
    });
    return userSchema.validate(user);
}


// Validation for Login-Credential Incoming data 
export function loginCredentialValidate (user: User) {
    const credentialSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return credentialSchema.validate(user);
}
