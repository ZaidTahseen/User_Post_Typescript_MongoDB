import { User } from '../../model/userModel';
import mongoose from 'mongoose';


const userOne: User = {
    "name": "Tahseen Zaid",
    "email": "tahseen@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 0,
    "mobile": 898989894,
    "city": "Mumbai"
};
const userOneInvalid: User = {
    // "_id" : "" , 
    "name": "Tahseen Zaid",
    "email": "tahseengmail.com",
    "password": "abcd@1234",
    "maritalStatus": 0,
    "mobile": 898989894,
    "city": "Mumbai"
};
const userTwo: User = {
    "name": "Shara Pova",
    "email": "shara@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 1,
    "mobile": 8965321478,
    "city": "Agra"
};
const userThree: User = {
    "name": "Govinda",
    "email": "govinda@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 0,
    "mobile": 7845123698,
    "city": "Delhi"
};
const userFour: User = {
    "name": "Saify Iftekhar",
    "email": "saify@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 1,
    "mobile": 7845126666,
    "city": "Mumbai"
};

const userFive: User = {
    "name": "John Cena",
    "email": "john@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 0,
    "mobile": 8989787800,
    "city": "America"
};

const userSix: User = {
    "name": "Khali",
    "email": "khali@gmail.com",
    "password": "abcd@1234",
    "maritalStatus": 1,
    "mobile": 8989787800,
    "city": "India"
};


const manyUserData = [
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserOne",
        "email": "manyUserOne@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 0,
        "mobile": 8956664174,
        "city": "China"
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserTwo",
        "email": "manyUserTwo@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 1,
        "mobile": 5566223300,
        "city": "Dubai"
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserThree",
        "email": "manyUserThree@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 0,
        "mobile": 5566223311,
        "city": "Japan"
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserFour",
        "email": "manyUserFour@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 1,
        "mobile": 5544003311,
        "city": "Finland"
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserFive",
        "email": "manyUserFive@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 0,
        "mobile": 5544009911,
        "city": "England"
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "name": "manyUserSix",
        "email": "manyUserSix@gmail.com",
        "password": "abcd@1234",
        "maritalStatus": 1,
        "mobile": 5544008811,
        "city": "India"
    }
];

export { userOne, userOneInvalid, userTwo, userThree, userFour, userFive, userSix, manyUserData };