import mongoose from 'mongoose';

export interface Post {
    title: string,
    content: string,
}

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },

    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }

}, {
    timestamps: true
});


export const postModel = mongoose.model('Post', postSchema);
