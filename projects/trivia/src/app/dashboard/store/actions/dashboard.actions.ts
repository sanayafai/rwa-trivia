import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Subscription, Subscribers, Blog, SystemStats } from 'shared-library/shared/model';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

export enum DashboardActionTypes {

    ADD_SUBSCRIBER = '[Social] AddSubscriber',
    ADD_SUBSCRIBER_SUCCESS = '[Social] AddSubscriberSuccess',
    REMOVE_SUBSCRIBER = '[Social] RemoveSubscriber',
    REMOVE_SUBSCRIBER_SUCCESS = '[Social] RemoveSubscriberSuccess',
    TOTAL_SUBSCRIBER = '[Social] TotalSubscriber',
    TOTAL_SUBSCRIBER_SUCCESS = '[Social] TotalSubscriberSuccess',
    CHECK_SUBSCRIPTION = '[Social] CheckSubscriptionStatus',
    LOAD_SOCIAL_SCORE_SHARE_URL = '[Social] LoadSocialScoreShareUrl',
    LOAD_SOCIAL_SCORE_SHARE_URL_SUCCESS = '[Social] LoadSocialScoreShareUrlSuccess',
    LOAD_BLOGS = '[Social] LoadBlogs',
    LOAD_BLOGS_SUCCESS = '[Social] LoadBlogsSuccess',
    ADD_SUBSCRIBER_ERROR = '[Social] AddSubscriberError',
    LOAD_BLOGS_ERROR = '[Social] LoadBlogsError',
    LOAD_LEADERBOARD = '[Stats] LoadLeaderBoard',
    LOAD_LEADERBOARD_SUCCESS = '[Stats] LoadLeaderBoardSuccess',
    LOAD_SYSTEM_STAT = '[Stats] LoadSystemStat',
    LOAD_SYSTEM_STAT_SUCCESS = '[Stats] LoadSystemStatSuccess',
    LOAD_SYSTEM_STAT_ERROR = '[Stats] LoadSystemStatError'
}

// Save subscriber
export class AddSubscriber implements Action {
    readonly type = DashboardActionTypes.ADD_SUBSCRIBER;
    constructor(public payload: { subscription: Subscription }) { }
}

// Save subscriber Success
export class AddSubscriberSuccess implements Action {
    readonly type = DashboardActionTypes.ADD_SUBSCRIBER_SUCCESS;
    payload = null;
}

// Save subscriber error
export class AddSubscriberError implements Action {
    readonly type = DashboardActionTypes.ADD_SUBSCRIBER_ERROR;
    constructor(public payload: string) { }
}


// Get total subscriber
export class GetTotalSubscriber implements Action {
    readonly type = DashboardActionTypes.TOTAL_SUBSCRIBER;
    payload = null;
}

// Get total subscriber Success
export class GetTotalSubscriberSuccess implements Action {
    readonly type = DashboardActionTypes.TOTAL_SUBSCRIBER_SUCCESS;
    constructor(public payload: Subscribers) { }
}

// Load Blogs
export class LoadBlogs implements Action {
    readonly type = DashboardActionTypes.LOAD_BLOGS;
    payload = null;
}

// Load Blogs Success
export class LoadBlogsSuccess implements Action {
    readonly type = DashboardActionTypes.LOAD_BLOGS_SUCCESS;
    constructor(public payload: Blog[]) { }
}

// Load Social Score share Url
export class LoadSocialScoreShareUrl implements Action {
    readonly type = DashboardActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL;
    constructor(public payload: { imageBlob: any, userId: string }) { }
}

// Load Social Score share Url Success
export class LoadSocialScoreShareUrlSuccess implements Action {
    readonly type = DashboardActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL_SUCCESS;
    constructor(public payload: UploadTaskSnapshot) { }
}

// Remove subscriber
export class RemoveSubscriber implements Action {
    readonly type = DashboardActionTypes.REMOVE_SUBSCRIBER;
    constructor(public payload: { created_uid: String }) { }
}

// Save subscriber Success
export class RemoveSubscriberSuccess implements Action {
    readonly type = DashboardActionTypes.REMOVE_SUBSCRIBER_SUCCESS;
    payload = null;
}

// Get total subscriber Success
export class CheckSubscriptionStatus implements Action {
    readonly type = DashboardActionTypes.CHECK_SUBSCRIPTION;
    constructor(public payload: Boolean) { }
}
// Load Blogs error
export class LoadBlogsError implements Action {
    readonly type = DashboardActionTypes.LOAD_BLOGS_ERROR;
    constructor(public payload: string) { }
}

// Load Score
export class LoadLeaderBoard implements Action {
    readonly type = DashboardActionTypes.LOAD_LEADERBOARD;
    constructor() { }
}

// Load Score
export class LoadLeaderBoardSuccess implements Action {
    readonly type = DashboardActionTypes.LOAD_LEADERBOARD_SUCCESS;
    constructor(public payload: any) { }
}

// Load System Stat
export class LoadSystemStat implements Action {
    readonly type = DashboardActionTypes.LOAD_SYSTEM_STAT;
    constructor() { }
}

// Load System Stat
export class LoadSystemStatSuccess implements Action {
    readonly type = DashboardActionTypes.LOAD_SYSTEM_STAT_SUCCESS;
    constructor(public payload: SystemStats) { }
}

// Load System Stat error
export class LoadSystemStatError implements Action {
    readonly type = DashboardActionTypes.LOAD_SYSTEM_STAT_ERROR;
    constructor(public payload: string) { }
}



export type DashboardActions
    = AddSubscriber
    | AddSubscriberSuccess
    | GetTotalSubscriber
    | GetTotalSubscriberSuccess
    | LoadSocialScoreShareUrl
    | LoadSocialScoreShareUrlSuccess
    | LoadBlogs
    | LoadBlogsSuccess
    | RemoveSubscriber
    | RemoveSubscriberSuccess
    | CheckSubscriptionStatus
    | AddSubscriberError
    | LoadBlogsError
    | LoadLeaderBoard
    | LoadLeaderBoardSuccess
    | LoadSystemStat
    | LoadSystemStatSuccess
    | LoadSystemStatError;

