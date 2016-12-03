import { random, each, findIndex, findLastIndex, findLast } from 'lodash';
import { CARD_WIDTH, CARD_HEIGHT } from 'utils/CardUtil';
import { getDrawPileIndex, getPileCards } from 'utils/GameUtil';
//import Immutable from 'seamless-immutable';

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
  // return findIndex(cards, { key: cardID, pile: pileID});
}

export function cardIndex(cards, cardID){
  return findIndex(cards, {'key': cardID});
}

export function isCardInPile(card, pileID){
  return card.pile === pileID;
}
  
export function insertCard(cards, card, insertIndex) {
  let prev = null;
  let b = null;
  let oldIndex = cardIndex(cards, card.key);
  
  // Remove the prev position
  if(oldIndex != -1){
    cards = cards.slice(0, oldIndex).concat(cards.slice(oldIndex + 1));
  }
  
  // Insert at index and shift other cards
  cards = cards.map(function (value, index) {
    if(index < insertIndex){
      return value;
    } else if (index == insertIndex) {
      prev = value;
      return card;
    } else {
      b = prev;
      prev = value;
      return b;
    }
  });
  
  // Add the tail card back into the array
  if(prev && prev != cards[cards.length - 1]){
    cards = cards.concat([prev]);
  }
  return cards;
}

export function addCardsToPile(cards, newCards, pile, flipped = false, randomAngle = false) {
  each(newCards, (c) => {
    let insert = findLastIndex(cards, { pile: pile }) + 1;
    cards = insertCard(cards, c.merge({
      pile: pile,
      flipped: flipped,
      selected: false,
      angleOffset: randomAngle ? random(0, 45) : 0
    }), insert);
  });
  return cards;
}
  
export function addDrawCardToPile(cards, piles, pileDefs, pile, flipped = false) {
  let draw = getDrawPileIndex(pileDefs);
  let c = findLast(cards, { pile: draw });
  if(c){
    cards = addCardsToPile(cards, [c], pile, flipped, false);
  }
  return cards;
}
