

// The  function return an array of object with provided query ,, example [ {$gte : 5 } , {$eq : 2 } ]
export function getLikesDilikesFilter (likeDislikeInfo: any) {


    let likesFilter: any = {};
    let dislikesFilter: any = {};
    likesFilter["$gte"] = 0;
    dislikesFilter["$gte"] = 0;

    if (likeDislikeInfo.likes) {
        let likesdetail = likeDislikeInfo.likes.split(":");
        if (likesdetail[0] === "gte") {
            likesFilter["$gte"] = parseInt(likesdetail[1]);
        }
        else if (likesdetail[0] === "lte") {
            delete likesFilter["$gte"];
            likesFilter["$lte"] = parseInt(likesdetail[1]);
        }
        else if (likesdetail[0] === "eq") {
            delete likesFilter["$gte"];
            likesFilter["$eq"] = parseInt(likesdetail[1]);
        }
    }
    if (likeDislikeInfo.dislikes) {
        let dislikesdetail = likeDislikeInfo.dislikes.split(":");
        if (dislikesdetail[0] === "gte") {
            dislikesFilter["$gte"] = parseInt(dislikesdetail[1]);
        }
        else if (dislikesdetail[0] === "lte") {
            delete dislikesFilter["$gte"];
            dislikesFilter["$lte"] = parseInt(dislikesdetail[1]);
        }
        else if (dislikesdetail[0] === "eq") {
            delete dislikesFilter["$gte"];
            dislikesFilter["$eq"] = parseInt(dislikesdetail[1]);
        }
    }
    return [likesFilter, dislikesFilter];
}


