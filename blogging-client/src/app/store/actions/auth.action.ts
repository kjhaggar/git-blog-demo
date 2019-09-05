import { createAction, props } from '@ngrx/store';
import User from '../blog.model';

export const Login = createAction(
  '[Auth] Login',
  props<{ user: any }>()
);

export const SuccessLoginAction = createAction(
  '[Auth] - Success Login',
  props<{ user: any }>()
);

export const ErrorLoginAction = createAction('[Auth] - Error', props<Error>());
