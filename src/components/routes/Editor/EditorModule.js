import { handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_CARDS = 'FETCH_CARDS';

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
  cards: {}
};

// ------------------------------------
// Reducer
// ------------------------------------
export const editorReducer = handleActions({
  [`${FETCH_CARDS}_SUCCESS`]: (state, action) => ({...state, cards: action.payload}),
}, initialState);

export default editorReducer;
