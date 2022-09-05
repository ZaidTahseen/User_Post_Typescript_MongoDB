import express from 'express';
import { getUsers, createUser, loginUser } from '../controller/userController';



const router: express.Router = express.Router();


router.get('/user/details', getUsers);
router.post('/user', createUser);
router.post('/user/login', loginUser);

export default router;