import { Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { User, Game, PlayerMode, OpponentType, Account, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import * as dashboardactions from '../../../dashboard/store/actions';
import { gamePlayState } from '../../store';

export class GameOver implements OnInit {

  @Input() correctCount: number;
  @Input() noOfQuestions: number;
  @Output() gameOverContinueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter<any>();
  @Input() categoryName: string;
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  @Input() totalRound: number;

  user$: Observable<User>;
  user: User;
  otherUserId: string;
  otherUserInfo: User;
  questionsArray = [];
  socialFeedData;
  imageUrl = '';
  disableRematchBtn = false;
  PlayerMode = PlayerMode;
  userDict$: Observable<{ [key: string]: User }>;
  loaderStatus = false;
  playerUserName = 'You';
  opponentType = OpponentType;
  disableFriendInviteBtn = false;
  defaultAvatar = 'assets/images/default-avatar-game-over.png';
  account: Account;
  applicationSettings: ApplicationSettings;
  liveErrorMsg = 'Sorry, don\'t have enough life.';
  subscriptions = [];

  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(public store: Store<AppState>, public userActions: UserActions,
    public utils: Utils, public cd: ChangeDetectorRef) {

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
    }));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
      this.account = account;
    }));

    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.subscriptions.push(this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    }));

    this.socialFeedData = {
      blogNo: 0,
      share_status: false,
      link: this.imageUrl
    };
    this.store.dispatch(new dashboardactions.LoadSocialScoreShareUrlSuccess(null));

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
    }));

    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.userAnsweredQuestion)).subscribe(stats => {
      if (stats != null) {
        this.questionsArray = stats;
        this.questionsArray.map((question) => {
          if (!this.userDict[question.created_uid]) {
            this.store.dispatch(this.userActions.loadOtherUserProfile(question.created_uid));
          }
        });
        this.cd.detectChanges();
      }
    }));
  }

  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  bindQuestions() {
    if (this.questionsArray.length === 0) {
      this.store.dispatch(new gameplayactions.GetUsersAnsweredQuestion({ userId: this.user.userId, game: this.game }));
    }
  }

  reMatch() {
    this.socialFeedData.share_status = false;
    this.disableRematchBtn = true;
    this.game.gameOptions.rematch = true;
    if (this.game.playerIds.length > 0) {
      this.game.gameOptions.friendId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
    }
    this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: this.game.gameOptions, user: this.user }));
  }

  getImageUrl(user: User) {
    setTimeout(() => {
      this.cd.markForCheck();
    }, 0);
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  inviteAsFriend() {
    if (!this.disableFriendInviteBtn) {
      const inviteeUserId = (this.user.userId === this.game.playerIds[0]) ? this.game.playerIds[1] : this.game.playerIds[0];
      this.store.dispatch(this.userActions.addUserInvitation(
        { userId: this.user.userId, inviteeUserId: inviteeUserId }));
    }
  }

  destroy() {
    this.user$ = undefined;
    this.user = undefined;
    this.otherUserId = undefined;
    this.otherUserInfo = undefined;
    this.questionsArray = [];
    this.socialFeedData = undefined;
    this.imageUrl = undefined;
    this.disableRematchBtn = undefined;
    this.PlayerMode = undefined;
    this.loaderStatus = undefined;
    this.opponentType = undefined;
    this.disableFriendInviteBtn = undefined;
    this.subscriptions = [];
    this.account = undefined;
    this.applicationSettings = undefined;
  }

}
