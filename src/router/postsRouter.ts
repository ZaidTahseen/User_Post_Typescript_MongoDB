import express from 'express';
import { createOrUpdatePost, getPosts, likeDislikePost, getTopPosts } from '../controller/postController';
import verifyToken from '../middleware/verifyToken';
import validateObjectId from '../middleware/validateObjectId';

const router: express.Router = express.Router();

router.get('/post/all', verifyToken, getPosts);
router.get('/post/top', verifyToken, validateObjectId, getTopPosts);
router.put('/post', verifyToken, validateObjectId, createOrUpdatePost);
router.post('/post/:postid', verifyToken, validateObjectId, likeDislikePost);


export default router;