import { chain, concat, chunk, slice, sortBy, forEach, shuffle as shuf } from 'lodash'; 
import { CARD_WIDTH, CARD_HEIGHT } from './Deck';

export function resetPositions(cards, x=0, y=0, angle=0){
  return forEach(cards, (c) => {
    c.x = x;
    c.y = y;
    c.z = 0;
    c.angle = angle;
  });
}

export function randomPositions(cards, boundry) {
  return forEach(cards, (c) => {
    c.x = randomInt(boundry.x, boundry.width);
    c.y = randomInt(boundry.y, boundry.height);
    c.z = 0;
    c.angle = 0;
  });
}

export function suitRowPositions(cards, types, boundry, key='so'){
  let col, row;
  return forEach(sortBy(cards, key), (c, i) => {
    col = i % types.length;
    row = Math.floor(i / types.length);
    c.x = boundry.x + col * (150 * c.scale);
    c.y = boundry.y + row * (220 * c.scale);
    c.z = 0;
    c.angle = 0;
  });
}

export function centroidPositions(cards, cx=0, cy=0, radius=100, circumference=280, angle=90){
  let step = circumference / cards.length;
  let a, dy, dx;
  return forEach(cards, (c, i) => {
    a = step * i * (Math.PI / 180) + angle;
    c.x = cx + radius * Math.cos(a);
    c.y = cy + radius * Math.sin(a);
    c.z = i * 100;
    dy = cy - c.y;
    dx = cx - c.x;
    c.angle = -90 + (Math.atan2(dy, dx) * 180 / Math.PI);
  });
}

const boundryCentroid = function (boundry, side, card){
  switch(side){
    case 1:
      return {
        x: boundry.x,
        y: boundry.y + (boundry.height - boundry.y) * 0.5
      };
      break;
    case 2:
      return {
        x: boundry.x + (boundry.width - boundry.x) * 0.5,
        y: boundry.y
      };
      break;
    case 3:
      let cw = CARD_WIDTH * card.scale;
      return {
        x: boundry.x + boundry.width + (cw * 0.5),
        y: boundry.y + (boundry.height - boundry.y) * 0.5
      };
      break;
    default:
      return {
        x: boundry.x + (boundry.width - boundry.x) * 0.5,
        y: boundry.y + boundry.height
      };
  }
};

/*
export function deal(cards, players, boundry, deal = 7){
  let i;
  let b;
  let newCards = [];
  let chunks = [];
  
  // shuffle and flip
  cards = flip(shuf(cards), true);
  
  // deal cards to players
  chunks = chunk(cards, deal);
  
  // position cards
  for(i=0; i<chunks.length; i++){
    if(i < players){
      b = boundryCentroid(boundry, i, chunks[i][0]);
    }else{
      b = {x: 0, y:0};
    }
    if(i == 0){
      newCards = concat(newCards, flip(centroidPositions(chunks[i], b.x, b.y, 200, 80, -90), false));
    }else{
      newCards = concat(newCards, resetPositions(chunks[i], b.x, b.y));
    }
  }
  return newCards;
}
*/

export function shuffle(cards, cx=0, cy=0){
  return resetPositions(shuf(cards), cx, cy);
}

export function sort(cards, cx=0, cy=0, key='so'){
  return resetPositions(sortBy(cards, key), cx, cy);
}

export function flip(cards, flipped = false){
  return forEach(cards, (c) => {
    c.flipped = flipped;
  });
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const boundry = (node, padding) => {
  return {
    x: padding,
    y: padding,
    width: node.clientWidth - (padding * 2),
    height: node.clientHeight - (padding * 2)
  };
};

/*
 * Creates an Array of cards split into chunks the length of deal.
 * The final chunk will have all remaining cards.
 */
export const dealCards = (cards, players, deal) => {
  let chunks = [];
  chain(chunk(cards, deal))
    .each(function (c, i){
      if(i < players){
        chunks[i] = c;
      }else{
        chunks[players] = concat(chunks[players] || [], c);
      }
    }).value();
  return chunks;
};
