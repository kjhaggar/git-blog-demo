import { AuthorizationService } from './../../services/auth.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as AuthActionTypes from '../actions/auth.action';
import User from '../blog.model';

@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthorizationService
  ) { }

  LogIn: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.Login),
      mergeMap(action =>
        this.authService.login(action)
          .pipe(
            map((user: User) => {
              return AuthActionTypes.SuccessLoginAction({ user });
            }),
            catchError((error: Error) => {
              return of(AuthActionTypes.ErrorLoginAction(error));
            })
          )
      )
    )
  );

  LoginSuccess: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SuccessLoginAction),
      tap((user) => {
        this.authService.storeUserData(user.user);
      })
    ),
    { dispatch: false }
  );

  LoginFailure: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.ErrorLoginAction)
    ),
    { dispatch: false }
  );
}
