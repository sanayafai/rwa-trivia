import { Component, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { Category, User, LeaderBoardUser, LeaderBoardConstants } from './../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { dashboardState } from '../../store';
import { UserActions } from './../../../../../../shared-library/src/lib/core/store/actions';
import * as leaderBoardActions from '../../store/actions';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class Leaderboard implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number = -1;
  lbsSliceLastIndex: number;
  lbsUsersSliceStartIndex: number;
  lbsUsersSliceLastIndex: number;
  maxLeaderBoardDisplay: number;
  platformIds: any;
  isbrowser: any;
  isServer: any;
  defaultAvatar = 'assets/images/default-avatar-small.png';
  unknown = LeaderBoardConstants.UNKNOWN;
  category: string;
  subscriptions = [];

  constructor(protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef) {

    this.route.params.subscribe((params) => {
      this.category = params['category'];
    });

    // if (isPlatformBrowser(this.platformId)) {
    this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
    // }
    this.maxLeaderBoardDisplay = 10;

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      this.cd.markForCheck();
    }));

    this.categoryDict$ = this.store.select(categoryDictionary);

    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.scoreBoard)).subscribe(lbsStat => {
      if (lbsStat) {
        this.leaderBoardStatDict = lbsStat;
        this.leaderBoardCat = Object.keys(lbsStat);
        //  this.cd.detectChanges();
        if (this.leaderBoardCat.length > 0) {
          this.leaderBoardCat.map((cat) => {
            this.leaderBoardStatDict[cat].map((user: LeaderBoardUser) => {
              const userId = user.userId;
              if (this.userDict && !this.userDict[userId]) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(userId));
              }
            });
          });
          if (this.lbsSliceStartIndex === -1) {
            this.lbsSliceStartIndex = Math.floor((Math.random() * (this.leaderBoardCat.length - 3)) + 1);
            this.lbsSliceLastIndex = this.lbsSliceStartIndex + 3;
            this.lbsUsersSliceStartIndex = 0;
            this.lbsUsersSliceLastIndex = 3;
          }
        }
      }
      this.cd.markForCheck();
    }));

  }

  displayMore(): void {
    this.lbsUsersSliceLastIndex = this.lbsUsersSliceLastIndex + 7;
    this.cd.markForCheck();
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {

  }
}
