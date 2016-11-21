import { concat, chunk, slice, sortBy, forEach, shuffle as shuf } from 'lodash'; 

export function resetPositions(cards, x=0, y=0){
  return forEach(cards, (c) => {
    c.x = x;
    c.y = y;
    c.angle = 0;
  });
}

export function randomPositions(cards, boundry) {
  return forEach(cards, (c) => {
    c.x = randomInt(boundry.x, boundry.width);
    c.y = randomInt(boundry.y, boundry.height);
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
    c.angle = 0;
  });
}

export function centroidPositions(cards, cx=0, cy=0, radius=50, circumference=280, angle=90){
  let step = circumference / cards.length;
  let a, dy, dx;
  return forEach(cards, (c, i) => {
    a = step * i * (Math.PI / 180) + angle;
    c.x = cx + radius * Math.cos(a);
    c.y = cy + radius * Math.sin(a);
    dy = cy - c.y;
    dx = cx - c.x;
    c.angle = -90 + (Math.atan2(dy, dx) * 180 / Math.PI);
  });
}

const boundryCentroid = function (boundry, side){
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
      return {
        x: boundry.x + boundry.width,
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

export function deal(cards, players, boundry, deal = 7){
  let i;
  let b;
  let newCards = [];
  
  // shuffle and flip
  cards = flip(shuf(cards), true);
  
  // deal cards to players
  cards = chunk(cards, deal);
  
  // position cards
  for(i=0; i<cards.length; i++){
    if(i < players){
      b = boundryCentroid(boundry, i);
    }else{
      b = {x: 0, y:0};
    }
    newCards = concat(newCards, resetPositions(cards[i], b.x, b.y));
  }
  return newCards;
}

export function shuffle(cards, cx=0, cy=0){
  return resetPositions(shuf(cards), cx, cy);
}

export function sort(cards, cx=0, cy=0, key='so'){
  return resetPositions(sortBy(cards, key), cx, cy);
}

export function flip(cards, flipped){
  return forEach(cards, (c) => {
    c.flipped = flipped || !c.flipped;
  });
}

const randomInt = function (min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
};
