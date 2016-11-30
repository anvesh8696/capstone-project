import { random, each, findIndex } from 'lodash';
//import Immutable from 'seamless-immutable';

export const CARD_WIDTH = 150;
export const CARD_HEIGHT = 220;

export function updatePiles(piles, boundry) {
  let nPiles = piles;
  each(piles, (p, k) => {
    nPiles = nPiles.set(k, p.merge({
      x: boundry.x + boundry.width * p.anchorX,
      y: boundry.y + boundry.height * p.anchorY
    }));
  });
  return nPiles;
}

export function updateCards(piles, cards, playerIndex, totalPlayers) {
  let i = 0;
  // return cards.map((c) => organize((i++), c, piles[c.pile], cards));
  return cards.map((c) => organize((i++), c, piles[getRotatedPile(c.pile, playerIndex, totalPlayers)], cards));
}

const getRotatedPile = function (pile, playerIndex, totalPlayers) {
  if(pile > totalPlayers - 1){
    return pile;
  }
  return (pile + totalPlayers - playerIndex) % totalPlayers;
};

export function organize(i, card, pile, cards){
  if(pile.o == 'ROW'){
    return orgainizeRow(i, card, pile, cards);
  }
  return orgainizePile(i, card, pile);
}

export function orgainizePile(i, card, pile){
  return card.merge({
    x: pile.x,
    y: pile.y - i * 1,
    z : 0,
    angle : pile.anchorR
  });
}

export function orgainizeRow(i, card, pile, cards){
  let pileCards = cardsInPile(cards, card.pile);
  let cw = card.scale * CARD_WIDTH * 0.5;
  let x = pile.x - (((pileCards - 1) * cw) * 0.5);
  let k = cardIndexInPile(cards, card.key, card.pile);
  return card.merge({
    x : x + (k * cw),
    y : pile.y,
    z : 0,
    angle : pile.anchorR
  });
}

export function cardsInPile(cards, pileID){
  let i = 0;
  each(cards, (c) => {
    if(c.pile == pileID){
      i++;
    }
  });
  return i;
}

export function cardIndexInPile(cards, cardID, pileID){
  let i = 0;
  each(cards, (c) => {
    if(c.pile == pileID){
      if(c.key == cardID){
        return false;
      }
      i++;
    }
  });
  return i;
}

export function isCardInPile(card, pileID){
  return card.pile === pileID;
}

export function insertCard(){
  
  //each card
  //check if this is the insert position
  //splice and break
}
