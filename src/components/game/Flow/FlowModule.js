import { handleActions, createAction } from 'redux-actions';
import { random } from 'lodash';
import { generateCards, generatePiles, generatePileDefs } from 'components/Deck/CardUtil';
import Immutable from 'seamless-immutable';

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
export const PLAYER_TURN_START = 'PLAYER_TURN_START';
export const UPDATE_GAME = 'UPDATE_GAME';


// ------------------------------------
// Actions
// ------------------------------------
export const createRoom = createAction(CREATE_ROOM);
export const joinRoom = createAction(JOIN_ROOM);
export const setupRoundSuccess = createAction(`${SETUP_ROUND}_SUCCESS`);
export const updateGameSuccess = createAction(`${UPDATE_GAME}_SUCCESS`);
export const playerTurnStart = createAction(PLAYER_TURN_START);
export const playerTurnEnd = createAction(PLAYER_TURN_END);

// ------------------------------------
// ASYNC Actions
// ------------------------------------
export function setupRound(node) {
  return function (dispatch, getState) {
    const { room, me } = getState()[FLOW_STATE];
    const { deckID, deal, teamMode } = room;
    
    //TODO Get ID's from Socket or Local
    let player2 = {name:'FillB', id:random(0, 99999)};
    let player3 = {name:'AshleyB', id:random(0, 99999)};
    let player4 = {name:'BrianB', id:random(0, 99999)};
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
    const { game } = getState()[FLOW_STATE];
    let nGame = game.setIn(keys, value);
    dispatch(updateGameSuccess({game: nGame}));
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

const randomTeams = function (teamMode, players) {
  if(teamMode == '1v1v1v1'){
    return [
      players[0].id, players[1].id, players[2].id, players[3].id
    ];
  }
  return [
    [players[0].id, players[2].id],
    [players[1].id, players[3].id]
  ];
};

const generateGame = function (deckID, handSize, teamMode, players, playerID, node) {
  let teams = randomTeams(teamMode, players);
  let cards = generateCards(deckID);
  let defs = generatePileDefs(deckID);
  let game = generatePiles(defs, cards, handSize, teams, players, playerID, node);
  //cards = deal(game.cards, players, node, handSize = 7);
  
  return Immutable({
    piles: game.piles,
    cards : game.cards,
    teams: teams,
    pileDefs: defs
  });
};

const handlePlayerTurnEnd = function (state, playerID) {
  let total = state.room.players.length;
  let value = (playerID + 1) % total;
  return state.setIn(['room','playerTurn'], value);
};


// ------------------------------------
// Reducer
// ------------------------------------
export const flowReducer = handleActions({
  [`${CREATE_ROOM}_SUCCESS`]: (state, action) => ({...state, room: action.payload}),
  [JOIN_ROOM]: (state, action) => ({...state, room: action.payload}),
  //[`${SETUP_ROUND}_SUCCESS`]: (state, action) => ({...state, ...action.payload}),
  [`${SETUP_ROUND}_SUCCESS`]: (state, action) => (state.merge(action.payload, {deep: true})),
  [`${UPDATE_GAME}_SUCCESS`]: (state, action) => (state.merge(action.payload, {deep: true})),
  [PLAYER_TURN_END]: (state, action) => handlePlayerTurnEnd(state, action.payload)
  //({...state, room: action.payload})
}, initialState);

export default flowReducer;
