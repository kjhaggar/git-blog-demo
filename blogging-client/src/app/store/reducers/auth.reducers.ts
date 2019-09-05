import User from '../blog.model';
import { createReducer, Action, on } from '@ngrx/store';
import * as AuthActionTypes from '../actions/auth.action';


export interface State {
  isAuthenticated: boolean;
  user: User | null;
  errorMessage: string | null;
}

export const initialState: State = {
  isAuthenticated: false,
  user: null,
  errorMessage: null
};

const Authreducer = createReducer(
  initialState,
  on(AuthActionTypes.SuccessLoginAction, (state, {user}) => {
    return { ...state,
      isAuthenticated: true,
      user: {
        token: user.token,
        userId: user.userId,
        userName: user.userName
      },
      errorMessage: null
    };
  }),
  on(AuthActionTypes.ErrorLoginAction, (state, error: any) => {
    return {...state, errorMessage: 'Incorrect email and/or password.'};
  })
);

export function ToDoReducer(state, action: Action) {
  return Authreducer(state, action);
}
