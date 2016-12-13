import Immutable from 'seamless-immutable';
import { findIndex, each, filter } from 'lodash';
import { generateCards, generatePiles, generatePileDefs } from 'utils/CardUtil';
import { cardIndex } from 'utils/PileUtil';

export function generateGame(deckID, handSize, teamMode, players, playerID) {
  let teams = randomTeams(teamMode, players);
  let cards = generateCards(deckID);
  let defs = generatePileDefs(deckID);
  let game = generatePiles(defs, cards, handSize, teams, players, playerID);
  //cards = deal(game.cards, players, node, handSize = 7);
  
  return Immutable({
    piles: game.piles,
    cards : game.cards,
    teams: teams,
    pileDefs: defs
  });
}

export function getSelectedCards(cards, pile) {
  return filter(cards, {'pile': pile, selected: true});
}

export function getPileCards(cards, pile) {
  return filter(cards, {'pile': pile});
}

export function getLastDiscard(cards, pileDefs) {
  let prevCard = getPileCards(cards, getDiscardPileIndex(pileDefs));
  return prevCard[prevCard.length - 1];
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
  let indexToUpdate = cardIndex(cards, card.key);
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
