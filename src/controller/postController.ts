import { Request, Response } from 'express';
import { validatePost } from '../middleware/post/postValidation';
import { postModel } from '../model/postModel';
import { getLikesDilikesFilter } from '../helper/post/filterLikeDislike';
import { startEndDateRangeFilter } from '../helper/post/filterDateRange';
import mongoose from 'mongoose';
import asyncMiddlewareHandleError from '../middleware/async';


// {{url}}/api/post/top?likes=10
// {{url}}/api/post/top?likes=10&dislikes=20
// Wrapping the function expression in asyncMiddlewareHandleError
export const getTopPosts: any = asyncMiddlewareHandleError(async (req: Request | any, res: Response) => {
    let userFilter: any = {};
    let limitValue: number = 0;

    // make filter for size counting ( likes or dilikes )    
    const filter = "likes" in req.query ? "$likes" : "$dislikes";
    // holding like or dislike option form url 
    const queryOption = filter.split("$")[1];
    // Filter the query for likes and dislikes and return a response if something wrong else creating a filter object
    if ((("likes" in req.query) && ("dislikes" in req.query)) || (!("likes" in req.query) && !("dislikes" in req.query))) {
        return res.status(400).send({ message: "Incorrect request with query parameter" });
    }
    if ((req.query[queryOption] != '10') && (req.query[queryOption] != '50')) {
        return res.status(400).send({ message: `${queryOption} value must be 10 or 50 only` });
    }
    limitValue = parseInt(req.query[queryOption]);
    
    // Filter the query for a specific userid
    if (req.query.userid) {
        userFilter.authorId = new mongoose.Types.ObjectId(req.query.userid);
    }

    // Aggregation Pipeline 
    let posts = await postModel.aggregate([
        { $match: userFilter },
        { $addFields: { len: { $size: filter } } },
        { $sort: { len: -1 } },
        { $limit: limitValue },
        { $project: { "title": 1, "content": 1, "authorId": 1, "likes": 1, "dislikes": 1 } }
    ]);
    res.status(200).send({ message: "Post Fetched Successfully", posts });
});


// {{url}}/api/post/all?startDate=2022-06-26&endDate=2022-06-28&by=updatedAt
// Wrapping the function expression in asyncMiddlewareHandleError
export const getPosts: any = asyncMiddlewareHandleError(async (req: Request | any, res: Response) => {

    let filterTitle: string = "";
    let filterContent: string = "";

    let skipValue: number = 0;
    let limitValue: number = 10;

    let sortByFilter: any = {
        "createdAt": 1
    };
    // filtering title from query
    if (req.query.title) {
        filterTitle = req.query.title;
    }
    // filtering contetn from query
    if (req.query.content) {
        filterContent = req.query.content;
    }
    // filtering skip and limit values from query
    if (req.query.skip) {
        skipValue = parseInt(req.query.skip as any);
    }


    // filtering likes and dislikes values from query // Incorrect 
    const filterLikeDislikeValues = getLikesDilikesFilter(req.query);
    const filterLikes = filterLikeDislikeValues[0];
    const filterDislikes = filterLikeDislikeValues[1];

    // filtering sortBy values if provided
    if (req.query.sortBy) {
        delete sortByFilter.createdAt;
        let sortInformation = req.query.sortBy.split(":") as any;
        sortByFilter[sortInformation[0]] = sortInformation[1] === "desc" ? -1 : 1;
    }

    // date range filter objects if passed in query for startdate and enddate
    let dateRangeFilter: any = startEndDateRangeFilter(req.query);

    // filtering createdAt from query parameter
    let postsData = await postModel.aggregate([
        { $addFields: { totalLikes: { $size: '$likes' }, totalDislikes: { $size: '$dislikes' } } },
        {
            $match: {
                title: { $regex: filterTitle, $options: "i" },
                content: { $regex: filterContent, $options: "i" },
                totalLikes: filterLikes, totalDislikes: filterDislikes,
            }
        },
        { $match: dateRangeFilter },
        { "$lookup": { "from": "users", "localField": "likes", "foreignField": "_id", "as": "recentLikes" } },
        { "$lookup": { "from": "users", "localField": "dislikes", "foreignField": "_id", "as": "recentDislikes" } },
        {
            $project: {
                "title": 1, "content": 1, "authorId": 1, "totalLikes": 1, "totalDislikes": 1,
                "recentFiveLikes": { $slice: ["$recentLikes.name", 5] },
                "recentFiveDislikes": { $slice: ["$recentDislikes.name", 5] },
                "createdAt": 1, "updatedAt": 1, "stringDate": 1
            }
        },
        { $sort: sortByFilter },
        { $skip: skipValue, },
        { $limit: limitValue }
    ]);

    const populatedData = await postModel.populate(postsData, { path: "authorId", select: { name: 1, _id: 0 } });
    res.status(200).send({ message: "Post Fetched Successfully", posts: populatedData });

});


// Wrapping the function expression in asyncMiddlewareHandleError
export const createOrUpdatePost: any = asyncMiddlewareHandleError(async (req: Request | any, res: Response) => {

    // Validating the post data , if wrong return a response 
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send({ success: false, message: error.details[0].message });

    // If post data has a postid in query-parametres then update the post by given information
    if (req.query.postid) {
        let authorizedAuthor = await postModel.findOne({ _id: req.query.postid, authorId: req.user._id });
        if (!authorizedAuthor) return res.status(401).send({ message: "Unauthorized User to update post" });

        let post = await postModel.findByIdAndUpdate(req.query.postid, req.body, { new: true });
        if (!post) return res.status(404).send({ message: 'The Post with provided ID was not found' });
        res.status(202).send({ message: 'Post Updated Succeesfully', post });
    }
    // Creating a new post and saving into database
    else {
        let postValue = {
            title: req.body.title,
            content: req.body.content,
            authorId: req.user._id,
        };
        let post = new postModel(postValue);
        await post.save();
        res.status(201).send({ message: 'Post Created Successfully', post });
    }
});


// Wrapping the function expression in asyncMiddlewareHandleError
export const likeDislikePost: any = asyncMiddlewareHandleError(async (req: Request | any, res: Response) => {
    let optionLikeDislike: string = "";
    let reverseOptionLikeDislike = "";

    // Check for query condition , only likes or dislikes
    if (req.query.likes && req.query.dislikes) {
        return res.status(400).send({ message: "Incorrect request with query parameter" });
    }
    // Check if query has like or dislikes parameter with true value and postid 
    else if ((req.query.likes == 'true' || req.query.dislikes == 'true') && (req.params.postid)) {

        optionLikeDislike = req.query.likes === "true" ? "likes" : "dislikes";
        reverseOptionLikeDislike = optionLikeDislike === 'likes' ? "dislikes" : "likes";

        let post: any = await postModel.findOne({ _id: req.params.postid });
        if (!post) {
            return res.status(404).send({ message: 'The Post with provided ID was not found' });
        }

        //  If user want to like the post remove it from dislike - vice-versa , and distinct for like/dislike
        for (let item of post[reverseOptionLikeDislike]) {
            let indexOfId = post[reverseOptionLikeDislike].indexOf(item);
            if (String(item) === String(req.user._id)) {
                post[reverseOptionLikeDislike].splice(indexOfId, 1);
            }
        };

        let alreadyLikedDisliked: boolean = false;
        for (let item of post[optionLikeDislike]) {
            let indexOfId = post[optionLikeDislike].indexOf(item);
            if (String(item) === String(req.user._id)) {
                alreadyLikedDisliked = true;
            }
        };

        if (!alreadyLikedDisliked) {
            post[optionLikeDislike].push(req.user._id);
        }

        await post.save();
        res.status(200).send({ message: `Post ${optionLikeDislike}`, post });
    }
    else {
        res.status(400).send({ message: "Incorrect request with query parameter" });
    }
});

