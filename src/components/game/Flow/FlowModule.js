import { handleActions, createAction } from 'redux-actions';
import { random, findIndex, findLastIndex } from 'lodash';
import { isBot, getPlayerIndex, getNextPlayerID, isTeammate, getPlayerName } from 'utils/RoomUtil';
import { generateGame, getDrawPileIndex, getLastDiscard, getDiscardPileIndex, getPileCards } from 'utils/GameUtil';
import { addCardsToPile, addDrawCardToPile, updateCards, cardsInPile } from 'utils/PileUtil';
import { getPlayableCard } from 'utils/RuleUtil';

// ------------------------------------
// Constants
// ------------------------------------
const FLOW_STATE = 'flow';

// LOCAL
export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';
export const SETUP_ROUND = 'SETUP_ROUND';
export const REPLENISH_DRAW_PILE = 'REPLENISH_DRAW_PILE';
export const USER_LOGIN = 'USER_LOGIN';

// REMOTE
export const ROOM_CHECK_READY = 'ROOM_CHECK_READY';
export const ROOM_START_ROUND = 'ROOM_START_ROUND';

// REMOTE SYNC
//export const PLAYER_DRAW_CARD = 'PLAYER_DRAW_CARD';
export const PLAYER_TURN_END = 'PLAYER_TURN_END';
export const UPDATE_GAME = 'UPDATE_GAME';
export const END_GAME = 'END_GAME';


// ------------------------------------
// Actions
// ------------------------------------
export const createRoom = createAction(CREATE_ROOM);
export const joinRoom = createAction(JOIN_ROOM);
export const setupRoundSuccess = createAction(`${SETUP_ROUND}_SUCCESS`);
export const updateGameSuccess = createAction(`${UPDATE_GAME}_SUCCESS`);
export const userLogin = createAction(USER_LOGIN);
export const playerTurnEndSuccess = createAction(`${PLAYER_TURN_END}_SUCCESS`);
export const endGame = createAction(END_GAME);
export const replenishDrawPile = createAction(REPLENISH_DRAW_PILE);

// ------------------------------------
// ASYNC Actions
// ------------------------------------
export function setupRound(node) {
  return function (dispatch, getState) {
    const { room, me } = getState()[FLOW_STATE];
    const { deckID, deal, teamMode } = room;
    
    
    let players = room.players;
    let nRoom = room.merge({
      playerTurn: me.id,
      //players: players,
      isGameOver: false,
      winner: ''
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
    const { players } = getState()[FLOW_STATE].room;
    const { cards, pileDefs } = getState()[FLOW_STATE].game;
    
    let nextPlayerID = getNextPlayerID(players, playerID);
    let pileID = getPlayerIndex(players, playerID);
    let gameOver = cardsInPile(cards, pileID) == 0;
    
    dispatch(playerTurnEndSuccess(nextPlayerID));
    
    // check if game is over
    if(gameOver){
      let winner = getPlayerName(players, playerID);
      dispatch(endGame(winner));
    } else {
      
      // replenish draw pile from discard pile
      pileID = getDrawPileIndex(pileDefs);
      if(cardsInPile(cards, pileID) == 0) {
        dispatch(replenishDrawPile());
      }
    
      // bot control
      if(isBot(players, nextPlayerID)){
        setTimeout(() => think(dispatch, getState, nextPlayerID), 1000 * random(1,2.5));
      }
    }
  };
}

export const actions = {
};

const defaultMe = {
  id: random(0, 99999),
  name: 'Jack',
  avatar: random(0, 6)
};

//TODO Get ID's from Socket or Local
const guys = [0,2,4,6];
const girls = [1,3,5];
const defaultPlayers = [
  defaultMe,
  {name:'Fill', avatar:guys[random(0, guys.length-1)], id:random(0, 99999), bot:true},
  {name:'Ashley', avatar:girls[random(0, girls.length-1)], id:random(0, 99999), bot:true},
  {name:'Brian', avatar:guys[random(0, guys.length-1)], id:random(0, 99999), bot:true}
];
  
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
    players: defaultPlayers,
    deckID: 'ELM',
    teamMode: '2V2',
    deal: 7,
    playerTurn: 0,
    isGameOver: false,
    winner: ''
  },
  me: defaultMe
};

const rLabel = function (label){
  return label + '$' + random(0, 99999);
};

const think = function (dispatch, getState, playerID) {
  const { pileDefs, piles, teams } = getState()[FLOW_STATE].game;
  const { players } = getState()[FLOW_STATE].room;
  const { id } = getState()[FLOW_STATE].me;
  //let nextPlayerID = getNextPlayerID(players, playerID);
  let { cards } = getState()[FLOW_STATE].game;
  
  //TODO: add bot logic
  let hostPile = getPlayerIndex(players, id);
  let playerPile = getPlayerIndex(players, playerID);
  let playerCards = getPileCards(cards, playerPile);
  let prevCard = getLastDiscard(cards, pileDefs);
  let playable = null;
  
  if(prevCard){
    playable = getPlayableCard(playerCards, prevCard, null);
  } else {
    // random first card
    playable = playerCards[random(0, playerCards.length - 1)];
  }
  
  if(playable){
    let discard = getDiscardPileIndex(pileDefs);
    cards = addCardsToPile(cards, [playable], discard, false, true);
  } else {
    let flipped = !isTeammate(playerID, id, teams);
    cards = addDrawCardToPile(cards, piles, pileDefs, playerPile, flipped);
  }
  
  cards = updateCards(piles, cards, hostPile, players.length);
  dispatch(updateGame(['game', 'cards'], cards));
  
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

const handleReplenishDrawPile = function (state) {
  const { pileDefs, piles } = state.game;
  const { players } = state.room;
  let { cards } = state.game;
  let discardPileID = getDiscardPileIndex(pileDefs);
  let drawPileID = getDrawPileIndex(pileDefs);
  let lastDiscardIndex = findLastIndex(cards, { pile: discardPileID });
  
  if(lastDiscardIndex != -1){
    cards = cards.map(function (c, index) {
      if(index < lastDiscardIndex){
        c = c.merge({
          pile: drawPileID,
          angleOffset: 0,
          flipped: true
        });
      }
      return c;
    });
  }
  
  cards = updateCards(piles, cards, drawPileID, players.length);
  return state.setIn(['game','cards'], cards);
};

const handleUserLogin = function (state, name, avatar){
  let index = 0;
  return state.setIn(['me','name'], name)
    .setIn(['me','avatar'], avatar)
    .setIn(['room','players',index,'name'], name)
    .setIn(['room','players',index,'avatar'], avatar);
};

// ------------------------------------
// Reducer
// ------------------------------------
export const flowReducer = handleActions({
  [`${CREATE_ROOM}_SUCCESS`]: (state, action) => ({...state, room: action.payload}),
  [JOIN_ROOM]: (state, action) => ({...state, room: action.payload}),
  [`${SETUP_ROUND}_SUCCESS`]: (state, action) => (state.merge(action.payload, {deep: true})),
  [`${UPDATE_GAME}_SUCCESS`]: (state, action) => handleUpdateGameSuccess(state, action),
  [`${PLAYER_TURN_END}_SUCCESS`]: (state, action) => state.setIn(['room','playerTurn'], action.payload),
  [END_GAME]: (state, action) => state.setIn(['room','isGameOver'], true).setIn(['room','winner'], action.payload),
  [REPLENISH_DRAW_PILE]: (state, action) => handleReplenishDrawPile(state),
  [USER_LOGIN]: (state, action) => handleUserLogin(state, action.payload.name, action.payload.avatar)
}, initialState);

export default flowReducer;
