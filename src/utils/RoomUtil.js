import { findIndex, find } from 'lodash';

export function isPlayerTurn(room, playerID) {
  return room.playerTurn === playerID;
}

export function isTeammate(playerID, id, teams) {
  let teamID = findIndex(teams, (t) => { return t.indexOf(playerID) != -1; });
  let team = teams[teamID];
  return team && team.indexOf(id) != -1;
}

export function getPlayerName(players, playerID) {
  return find(players, (p) => p.id == playerID).name;
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
  let playerIndex = getPlayerIndex(players, playerID);
  let p = players[playerIndex];
  return p.hasOwnProperty('bot') ? p.bot : false;
}
