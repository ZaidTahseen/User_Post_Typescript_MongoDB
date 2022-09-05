import request from 'supertest';
import app from '../app';
import { userModel } from '../model/userModel';
import { userOne, userOneInvalid, userTwo, manyUserData, userThree } from './fixtures/userDb';


let token: string = "";
let allManyUsers: any = [];

beforeAll(async () => {
    await userModel.deleteMany();
    allManyUsers = await userModel.insertMany(manyUserData);
});

// function sum(a:number, b:number) {
//     return a + b;
// }

// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
// });

describe('/api/user/ --> Test cases for user', () => {

    it('GET-200 should return limited feature if not authorized', async () => {
        const response1 = await request(app).get('/api/user/details');
        expect(response1.status).toBe(200);
        expect(JSON.parse(response1.text).feature).toEqual('u-empty');
    });

    it('GET-200 should retrun a specific users if valid id is passed', async () => {
        let userid = '/api/user/details?id=' + String(allManyUsers[0]._id) + ',' + String(allManyUsers[1]._id);
        const response2 = await request(app).get(userid).expect(200);
        expect(response2.body.users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: allManyUsers[0].name }),
                expect.objectContaining({ name: allManyUsers[1].name })
            ])
        );
    });

    it('POST-400 should validate the invalid user before creating', async () => {
        await request(app).post('/api/user').send(userOneInvalid).expect(400);
    });

    it('POST-201 should Create a new User with unique email with validation', async () => {
        const response1 = await request(app).post('/api/user').send(userOne).expect(201);
        expect(JSON.parse(response1.text).message).toEqual('User Created Successfully');
    });

    it('POST-409 should not create a new user for the same exist user', async () => {
        await request(app).post('/api/user').send(userTwo).expect(201);
        const response1 = await request(app).post('/api/user').send(userTwo).expect(409);
        expect(JSON.parse(response1.text).message).toEqual('User Already Created');
    });

    it('POST-200 should login by a existing user credential and set token.', async () => {
        const response1 = await request(app).post('/api/user/login').send({
            "email": userTwo.email,
            "password": userTwo.password
        }).expect(200);
        // We recieve a token after  login
        let data = JSON.parse(response1.text);
        token = data.token;
        expect(token).not.toBeNull();
    });

    it('POST- should not login non-existent user', async () => {
        const response1 = await request(app).post('/api/user/login').send({
            "email": 'nouser@gmail.com',
            "password": userTwo.password
        }).expect(401);
    });

    it('POST- should validate credential before login', async () => {
        const response1 = await request(app).post('/api/user/login').send({
            "email": 'fdsfsdfdsf',
            "password": 'fsfsdfdsf'
        }).expect(400);
    });

    it('POST- should not login for wrong password but correct email', async () => {
        const response1 = await request(app).post('/api/user/login').send({
            "email": userTwo.email,
            "password": 'fsfsdfdsf'
        }).expect(401);
    });

    it('Should get user detail with maximum features', async () => {
        await request(app).post('/api/user').send(userThree).expect(201);
        const response1 = await request(app).post('/api/user/login').send({
            "email": userThree.email,
            "password": userThree.password
        }).expect(200);
        // We recieve a token after  login
        let data = JSON.parse(response1.text);
        token = data.token;

        const response2 = await request(app).get('/api/user/details')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(JSON.parse(response2.text).feature).toEqual('u-token');
    });

});