import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { CONFIG } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { UserActions } from '../store/actions';
import { User } from '../../model';
import * as useractions from '../../user/store/actions';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>,
        private userActions: UserActions,
        private http: HttpClient) {
    }


    getUserRoles(user: User): Observable<User> {
        return this.db.doc<any>('/users/' + user.userId).snapshotChanges()
            .take(1)
            .map(u => {
                if (u.payload.exists && u.payload.data().roles) {
                    user.roles = u.payload.data().roles;
                }
                return user;
            })
            .catch(error => {
                console.log(error);
                return Observable.of(user);
            });
    }

    saveUserProfile(user: User) {
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser['authState'];
        this.db.doc(`/users/${dbUser.userId}`).set(dbUser).then(ref => {
            // this.store.dispatch(this.userActions.addUserProfileSuccess());
            this.store.dispatch(new useractions.AddUserProfileSuccess());
        });
    }

    // // get user by Id
    // getUserProfile(userId: Number): Observable<User> {
    //     return this.db.doc(`/users/${userId}`)
    //         .valueChanges()
    //         .catch(error => {
    //             return Observable.of(null);
    //         });
    // }
    // get user by Id
    getUserProfile(user: User): Observable<User> {
        // const userSubject = new Subject<User>();
        return this.db.doc<any>('/users/' + user.userId)
            .snapshotChanges()
            .take(1)
            .map(userDetail => {
                if (userDetail.payload.exists && userDetail.payload.data()) {
                    if (userDetail.payload.data().profilePicture !== undefined) {
                        const filePath = 'profile/' + userDetail.payload.data().userId + '/avatar/'
                            + userDetail.payload.data().profilePicture;
                        const ref = this.storage.ref(filePath);
                        user.setUserDetail(userDetail.payload.data());
                        user.profileUrl = ref.getDownloadURL();
                        return user;
                        // ref.getDownloadURL().subscribe(url => {
                        //     user.setUserDetail(userDetail.payload.data(), url);
                        //     console.log("after user" + JSON.stringify(user));
                        //     // userSubject.next(user);
                        //     return user;
                        // });
                    }
                }

            })
            .catch(error => {
                return Observable.of(null);
            });
        // return userSubject;
    }


}
