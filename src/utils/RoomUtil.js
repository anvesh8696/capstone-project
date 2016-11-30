import { findIndex } from 'lodash';

export function isPlayerTurn(room, playerID) {
  return room.playerTurn === playerID;
}

export function getPlayerIndex(players, playerID) {
  return findIndex(players, (p) => p.id == playerID);
}

export function getPlayerID(players, index) {
  return players[index].id;
}

export function getNextPlayerID(players, playerID){
  let playerIndex = getPlayerIndex(players, playerID);
  let nextPlayerIndex = (playerIndex + 1) % players.length;
  return getPlayerID(players, nextPlayerIndex);
}

export function isBot(players, playerID) {
  // if(playerIndex >= 0 && players.length > playerIndex){
  //   let p = players[playerIndex];
  //   console.log('isBot', playerIndex, p);
  //   return p.hasOwnProperty('bot') ? p.bot : false;
  // }
  // return false;
  let playerIndex = getPlayerIndex(players, playerID);
  let p = players[playerIndex];
  console.log('inside, isBot', playerIndex, p);
  return p.hasOwnProperty('bot') ? p.bot : false;
}
