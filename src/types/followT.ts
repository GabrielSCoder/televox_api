export type followForm = {
    following_id : number
    follower_id : number
    compare_id ?: number
    invertTotalizer ?: boolean
    profileId ?: number
    returnProfileTotalizer ?: boolean
}

export type compareForm = {
    compare_id : number
    user_id : number
}