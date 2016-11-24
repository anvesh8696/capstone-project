import { handleActions, createAction } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_CARDS = 'FETCH_CARDS';
export const DEAL_CARDS = 'DEAL_CARDS';

// ------------------------------------
// Actions
// ------------------------------------
export const fetchCards = createAction(FETCH_CARDS);
export const dealCards = createAction(DEAL_CARDS);

// ------------------------------------
// ASYNC Actions
// ------------------------------------


export const actions = {
};

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  cards: {},
  deckAction: ''
};

const rLabel = function (label){
  return label + '$' + Math.round(Math.random()*999);
};

// ------------------------------------
// Reducer
// ------------------------------------
export const flowReducer = handleActions({
  [`${FETCH_CARDS}_SUCCESS`]: (state, action) => ({...state, cards: action.payload}),
  [DEAL_CARDS]: (state, action) => ({...state, deckAction: rLabel('deal')})
}, initialState);

export default flowReducer;
