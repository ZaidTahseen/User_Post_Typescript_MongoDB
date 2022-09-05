import { Post } from '../../model/postModel';


const postOne: Post = {
    "title": "Mango",
    "content": "Mango is the king of all fruits"
};
const postOneInvalid: Post = {
    "title": "M",
    "content": ""
};
const postTwo: Post = {
    "title": "Laptop Mac",
    "content": "Mac laptop is costly but very best for use and performance"
};
const postThree: Post = {
    "title": "India",
    "content": "India is the largest democratic country in the world"
};
const postFour: Post = {
    "title": "Nodejs",
    "content": "Nodejs is a runtime environment for javascript"
};
const postFive: Post = {
    "title": "Javascript",
    "content": "Javascript is a single threaded , synchronous programming language"
};
const postSix: Post = {
    "title": "Google",
    "content": "Google is a search engine for website searching"
};



export { postOne, postOneInvalid, postTwo, postThree, postFour, postFive, postSix };