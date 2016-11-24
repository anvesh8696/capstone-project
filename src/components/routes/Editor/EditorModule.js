import { handleActions, createAction } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_CARDS = 'FETCH_CARDS';
export const DEAL_CARDS = 'DEAL_CARDS';
export const SHUFFLE_CARDS = 'SHUFFLE_CARDS';
export const FAN_CARDS = 'FAN_CARDS';
export const FLIP_CARDS = 'FLIP_CARDS';
export const HAND_SELECT_RANDOM_CARDS = 'HAND_SELECT_RANDOM_CARDS';
export const RANDOM_CARDS = 'RANDOM_CARDS';
export const SORT_CARDS = 'SORT_CARDS';
export const PLAYER_ACTION = 'PLAYER_ACTION';

// ------------------------------------
// Actions
// ------------------------------------
export const fetchCards = createAction(FETCH_CARDS);
export const dealCards = createAction(DEAL_CARDS);
export const shuffleCards = createAction(SHUFFLE_CARDS);
export const sortCards = createAction(SORT_CARDS);
export const fanCards = createAction(FAN_CARDS);
export const flipCards = createAction(FLIP_CARDS);
export const randomCards = createAction(RANDOM_CARDS);
export const handSelectRandomCards = createAction(HAND_SELECT_RANDOM_CARDS);
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
  cards: {},
  deckAction: ''
};

const rLabel = function (label){
  return label + '$' + Math.round(Math.random()*999);
};

// ------------------------------------
// Reducer
// ------------------------------------
export const editorReducer = handleActions({
  [`${FETCH_CARDS}_SUCCESS`]: (state, action) => ({...state, cards: action.payload}),
  [DEAL_CARDS]: (state, action) => ({...state, deckAction: rLabel('deal')}),
  [SHUFFLE_CARDS]: (state, action) => ({...state, deckAction: rLabel('shuffle')}),
  [SORT_CARDS]: (state, action) => ({...state, deckAction: rLabel('sort')}),
  [FAN_CARDS]: (state, action) => ({...state, deckAction: 'fan'}),
  [FLIP_CARDS]: (state, action) => ({...state, deckAction: rLabel('flip')}),
  [RANDOM_CARDS]: (state, action) => ({...state, deckAction: rLabel('random')}),
  [HAND_SELECT_RANDOM_CARDS]: (state, action) => ({...state, deckAction: rLabel('hand_select_random')}),
  [PLAYER_ACTION]: (state, action) => ({...state, deckAction: rLabel(action.payload)})
}, initialState);

export default editorReducer;
