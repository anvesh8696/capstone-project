import Immutable from 'seamless-immutable';
import { findIndex, each } from 'lodash';
import { generateCards, generatePiles, generatePileDefs } from 'utils/CardUtil';

export function generateGame(deckID, handSize, teamMode, players, playerID, node) {
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
}

export function getSelectedCards(cards, pile) {
  let cr = [];
  each(cards, (c) => {
    if(c.selected && c.pile == pile){
      cr.push(c);
    }
  });
  return cr;
}

export function getPileCards(cards, pile) {
  let cr = [];
  each(cards, (c) => {
    if(c.pile == pile){
      cr.push(c);
    }
  });
  return cr;
}

export function getDiscardPileIndex(pileDefs) {
  return 5;
  return pileDefs.length - 1;
}

export function getDrawPileIndex(pileDefs) {
  return 4;
  return pileDefs.length - 1;
}

export function updateCard(cards, card, updateGame) {
  let indexToUpdate = findIndex(cards, (o) => o.key == card.key);
  updateGame(['game', 'cards', indexToUpdate], card);
}

const randomTeams = function (teamMode, players) {
  if(teamMode == '1v1v1v1'){
    return [
      [players[0].id], [players[1].id], [players[2].id], [players[3].id]
    ];
  }
  return [
    [players[0].id, players[2].id],
    [players[1].id, players[3].id]
  ];
};
