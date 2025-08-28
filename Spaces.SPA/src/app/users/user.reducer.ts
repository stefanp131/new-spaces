import { createReducer, on } from '@ngrx/store';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface UserDropdown {
  id: number;
  username: string;
}

export interface UserState {
  users: UserDropdown[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Actions (for demo, you may want to move to a separate file)
import { createAction, props } from '@ngrx/store';
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: UserDropdown[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

// Reducer
export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
);

// Selectors
export const selectUserState = createFeatureSelector<UserState>('users');
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUserState, (state) => state.loading);
export const selectUsersError = createSelector(selectUserState, (state) => state.error);
