import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_USER = 'FETCH_USER';
export const PLAYER_ACTION = 'PLAYER_ACTION';

// ------------------------------------
// Actions
// ------------------------------------
export const playerAction = createAction(PLAYER_ACTION);

// ------------------------------------
// ASYNC Actions
// ------------------------------------


export const actions = {
};

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  user: {},
  deckAction: {}
};

const rLabel = function (label){
  return label + '$' + Math.round(Math.random()*999);
};

// ------------------------------------
// Reducer
// ------------------------------------
export const roomReducer = handleActions({
  [`${FETCH_USER}_SUCCESS`]: (state, action) => ({...state, user: action.payload}),
  [PLAYER_ACTION]: (state, action) => ({...state, deckAction: rLabel(action.payload)})
}, initialState);

export default roomReducer;
