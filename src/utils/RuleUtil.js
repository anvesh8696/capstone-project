import { filter } from 'lodash';

export function matchSuit(cards, card){
  return filter(cards, { 'suit': card.suit });
}

export function matchValue(cards, card){
  return filter(cards, { 'value': card.value });
}

export function getPlayableCard(cards, prevCard, rule){
  let found = matchSuit(cards, prevCard);
  // console.log('found', found, cards, prevCard);
  if(!found[0]){
    found = matchValue(cards, prevCard);
  }
  return found[0] || null;
}
