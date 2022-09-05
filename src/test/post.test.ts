import request from 'supertest';
import app from '../app';
import { postModel } from '../model/postModel';
import { postOne, postOneInvalid, postTwo, postThree, postFour, postFive } from './fixtures/postDb';

import { User, userModel } from '../model/userModel';
import { userOne, userOneInvalid, userFour, userFive, userSix } from './fixtures/userDb';

let token = "";
let createdPost: any;
let createdUser: any;
beforeAll(async () => {

    await postModel.deleteMany();
    // create a user with userFour
    createdUser = await request(app).post('/api/user').send(userFour).expect(201);
    // Login with userFour and set the global token
    const response2 = await request(app)
        .post('/api/user/login')
        .send({
            "email": userFour.email,
            "password": userFour.password
        })
        .expect(200);

    // We recieve a token after login
    let data = JSON.parse(response2.text);
    token = 'Bearer ' + String(data.token);
    expect(token).not.toBeNull();

    //create a post by authenticated userFour
    createdPost = await request(app)
        .put('/api/post')
        .set('Authorization', token)
        .send(postTwo)
        .expect(201);


    await request(app).post('/api/user').send(userFive).expect(201);
    await request(app).post('/api/user').send(userSix).expect(201);
});


describe('Test cases for post', () => {

    it('POST-201 create a valid post ', async () => {
        const response = await request(app)
            .put('/api/post')
            .set('Authorization', token)
            .send(postOne)
            .expect(201);
    });

    it('POST-401 unauthorized user to create a post', async () => {
        await request(app)
            .put('/api/post')
            .send(postOne)
            .expect(401);
    });

    it('POST-400 Invalid data supplied to create a post', async () => {
        await request(app)
            .put('/api/post')
            .set('Authorization', token)
            .send(postOneInvalid)
            .expect(400);
    });

    it('POST-202 update a valid post ', async () => {

        let updatePostTwo = {
            title: "New Title",
            content: "Updated content with new data"
        };
        const response = await request(app)
            .put(`/api/post/?postid=${createdPost.body.post._id}`)
            .set('Authorization', token)
            .send(updatePostTwo)
            .expect(202);
    });

    it('POST-401 the post with provided id was not found', async () => {
        let updatePostTwo = {
            title: "New Title",
            content: "Updated content with new data"
        };
        const response = await request(app)
            .put(`/api/post/?postid=62c2ec12c62d359c13ed8785`)
            .set('Authorization', token)
            .send(updatePostTwo)
            .expect(401);
    });

    it('GET-401 should not get the post, without token', async () => {
        await request(app).get('/api/post/all').expect(401);
    });

    it('GET-200 Should get all post, due to token', async () => {
        await request(app).get('/api/post/all')
            .set('Authorization', token)
            .expect(200);
    });

    // get top like/dislike(10,50) , optional with userid ---> posts 
    it('GET-200 Should get top like posts', async () => {
        await request(app).get('/api/post/top?likes=10')
            .set('Authorization', token)
            .expect(200);
    });

    it('GET-200 Should get top dislike posts', async () => {
        await request(app).get('/api/post/top?dislikes=10')
            .set('Authorization', token)
            .expect(200);
    });

    it('GET-400 Should get error for dislike posts , except 10,50', async () => {
        await request(app).get('/api/post/top?dislikes=11')
            .set('Authorization', token)
            .expect(400);
    });

    it('GET-400 Should get error for both queries like and dislike', async () => {
        await request(app).get('/api/post/top?dislikes=10&likes=10')
            .set('Authorization', token)
            .expect(400);
    });

    it('GET-200 should fetch post for a specific user', async () => {
        const res = await request(app).get(`/api/post/top?likes=10&userid=${createdUser.body.user._id}`)
            .set('Authorization', token)
            .expect(200);
    });

    it('GET-404 fail if userid query is wrong', async () => {
        const res = await request(app).get(`/api/post/top?likes=10&userid=ff5d55df45d45df`)
            .set('Authorization', token)
            .expect(404);
    });

    // like/dislike a Post 
    // it('GET- Like a valid post ', async () => {
    //     const res = await request(app).get(`/api/post/top?likes=10&userid=ff5d55df45d45df`)
    //         .set('Authorization', token)
    //         .expect(404);
    // });

});











// test('Should create a Post ', async () => {
//     await request(app).put('/api/post')
//         .send(postOne)
//         .set('Authorization', `Bearer ${token}`)
//         .expect(201);
// });


// test('Should get all posts', async () => {
//     const response = await request(app).get('/api/post/all')
//         .send()
//         .set('Authorization', `Bearer ${token}`)
//         .expect(200);
// });


// test('Should get not access for posts ', async () => {
//     await request(app).get('/api/post/all')
//         .send()
//         .expect(401);
// });