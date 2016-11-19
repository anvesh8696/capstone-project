import { handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_USER = 'FETCH_USER';

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// ASYNC Actions
// ------------------------------------


export const actions = {
};

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  user: {}
};

// ------------------------------------
// Reducer
// ------------------------------------
export const landingReducer = handleActions({
  [`${FETCH_USER}_SUCCESS`]: (state, action) => ({...state, user: action.payload}),
}, initialState);

export default landingReducer;
