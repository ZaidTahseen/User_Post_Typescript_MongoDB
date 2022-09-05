import Joi from 'joi';

import { Post } from '../../model/postModel';



// Validation for Post Incoming data 
export function validatePost (post: Post) {
    const postSchema = Joi.object({
        title: Joi.string().min(5),
        content: Joi.string().min(10),
    });
    
    return postSchema.validate(post);
};
