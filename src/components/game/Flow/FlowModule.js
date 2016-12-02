import { handleActions, createAction } from 'redux-actions';
import { random, findIndex } from 'lodash';
import { isBot, getPlayerIndex, getPlayerID, getNextPlayerID } from 'utils/RoomUtil';
import { generateGame } from 'utils/GameUtil';

// ------------------------------------
// Constants
// ------------------------------------
const FLOW_STATE = 'flow';

// LOCAL
export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';
export const SETUP_ROUND = 'SETUP_ROUND';

// REMOTE
export const ROOM_CHECK_READY = 'ROOM_CHECK_READY';
export const ROOM_START_ROUND = 'ROOM_START_ROUND';

// REMOTE SYNC
//export const PLAYER_DRAW_CARD = 'PLAYER_DRAW_CARD';
export const PLAYER_TURN_END = 'PLAYER_TURN_END';
export const UPDATE_GAME = 'UPDATE_GAME';


// ------------------------------------
// Actions
// ------------------------------------
export const createRoom = createAction(CREATE_ROOM);
export const joinRoom = createAction(JOIN_ROOM);
export const setupRoundSuccess = createAction(`${SETUP_ROUND}_SUCCESS`);
export const updateGameSuccess = createAction(`${UPDATE_GAME}_SUCCESS`);
//export const playerTurnEnd = createAction(PLAYER_TURN_END);
export const playerTurnEndSuccess = createAction(`${PLAYER_TURN_END}_SUCCESS`);

// ------------------------------------
// ASYNC Actions
// ------------------------------------
export function setupRound(node) {
  return function (dispatch, getState) {
    const { room, me } = getState()[FLOW_STATE];
    const { deckID, deal, teamMode } = room;
    
    //TODO Get ID's from Socket or Local
    let player2 = {name:'FillB', id:random(0, 99999), bot:true};
    let player3 = {name:'AshleyB', id:random(0, 99999), bot:true};
    let player4 = {name:'BrianB', id:random(0, 99999), bot:true};
    let players = [me, player2, player3, player4];
    
    let nRoom = room.merge({
      playerTurn: me.id,
      players: players
    });
    let nGame = generateGame(deckID, deal, teamMode, players, me.id, node);
    
    dispatch(setupRoundSuccess({room: nRoom, game: nGame, me:me}));
    
    // Update the layout
    window.dispatchEvent(new Event('resize'));
  };
}

export function updateGame(keys, value, sendRemote = false){
  return function (dispatch, getState) {
    //const { game } = getState()[FLOW_STATE];
    //let nGame = game.setIn(keys, value);
    //dispatch(updateGameSuccess({game: nGame}));
    dispatch(updateGameSuccess({keys: keys, value:value}));
    //TODO If sendRemote send nGame
  };
}

export function mergeGame(value, sendRemote = false){
  return function (dispatch, getState) {
    const { game } = getState()[FLOW_STATE];
    let nGame = game.merge(value, {deep: true});
    dispatch(updateGameSuccess({game: nGame}));
    //TODO If sendRemote send nGame
  };
}

export function playerTurnEnd(playerID) {
  return function (dispatch, getState) {
    const { room } = getState()[FLOW_STATE];
    let players = room.players;
    let nextPlayerID = getNextPlayerID(players, playerID);
    
    dispatch(playerTurnEndSuccess(nextPlayerID));
    
    // bot control
    if(isBot(players, nextPlayerID)){
      setTimeout(() => think(dispatch, getState, nextPlayerID), 1000);
    }
  };
}

export const actions = {
};

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  game: {
    cards: [],
    piles: {},
    pileDefs: []
  },
  room: {
    players: [],
    deckID: 'ELM',
    teamMode: '2V2',
    deal: 7,
    playerTurn: 0
  },
  me: {
    id: random(0, 99999),
    name: 'Jack'
  }
};

const rLabel = function (label){
  return label + '$' + random(0, 99999);
};

const think = function (dispatch, getState, playerID) {
  //const { players } = getState()[FLOW_STATE].room;
  //let nextPlayerID = getNextPlayerID(players, playerID);
  
  //TODO: add bot logic
  
  // end bot turn
  dispatch(playerTurnEnd(playerID));
};

const handleUpdateGameSuccess = function (state, action) {
  //const { game } = state;
  
  if(action.payload.keys){
    const { keys, value } = action.payload;
    return state.setIn(keys, value);
  }
  return state.merge(action.payload, {deep: true});
    //let nGame = game.setIn(keys, value);
    //(state.merge(action.payload, {deep: true}))
};

// ------------------------------------
// Reducer
// ------------------------------------
export const flowReducer = handleActions({
  [`${CREATE_ROOM}_SUCCESS`]: (state, action) => ({...state, room: action.payload}),
  [JOIN_ROOM]: (state, action) => ({...state, room: action.payload}),
  //[`${SETUP_ROUND}_SUCCESS`]: (state, action) => ({...state, ...action.payload}),
  [`${SETUP_ROUND}_SUCCESS`]: (state, action) => (state.merge(action.payload, {deep: true})),
  [`${UPDATE_GAME}_SUCCESS`]: (state, action) => handleUpdateGameSuccess(state, action),
  [`${PLAYER_TURN_END}_SUCCESS`]: (state, action) => state.setIn(['room','playerTurn'], action.payload)
  //({...state, room: action.payload})
}, initialState);

export default flowReducer;
