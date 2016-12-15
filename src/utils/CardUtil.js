import { chain, findIndex, concat, chunk, random, sortBy, each, shuffle as shuf } from 'lodash';
import Immutable from 'seamless-immutable';
import { cardDefaults, cardDealDefaults } from 'components/Deck/DeckCard';
import { isTeammate } from 'utils/RoomUtil';

export const CARD_WIDTH = 150;
export const CARD_HEIGHT = 220;

export function generateCards(deckID){
  const {suits, types} = findDeckInfo(deckID);
  let c=[];
  let t = suits.length * types.length;
  for(let i=0; i<t; i++){
    c.push({
      ...cardDefaults,
      key: 'key_' + i,
      suit: suits[Math.floor(i / types.length)],
      value: types[i % types.length],
      so: i,
      scale: 0.5
    });
  }
  return Immutable(shuf(c));
}

export function generatePiles(pileDefs, cards, deal, teams, players, playerID) {
  //let { cards, deal, players } = this.state;
  
  //1. Seperate Cards into chunks (player piles, draw pile)
  let chunks = dealCards(cards, players.length, deal);
  
  //2. Create piles for each player and each game pile
  let piles = createPiles(pileDefs, players.length + 2);
  
  //3. Add cards to piles and updates positions
  let nCards = cards;
  each(chunks, (p, i) => {
    
    //c = merge(c, {flipped: !isTeammate(playerID, i, teams), pile:i, ...cardDealDefaults});
    
    // let index = findIndex(cards, (fic) => { return fic.key == c.key; });
    // cards = cards.set(index, )
    let pileOwner = i < players.length ? players[i].id : undefined;
    
    each(p, (c, k) => {
      let index = findIndex(nCards, (fic) => { return fic.key == c.key; });
      
      c = c.merge({...cardDealDefaults,
        flipped: !isTeammate(playerID, pileOwner, teams),
        pile: i,
        lastInPile: k === p.length - 1
      });
      
      nCards = nCards.set(index, c);
    });
    //console.log(c)
    //return nCards;
    
    // if(i === playerID){
    //   //c = c.map((e) => ({...e, clickable: true}));
    //   each(c, (e) => {e.clickable = true});
    //   //console.log(i, playerID, c);
    // }
    
    //-----------------------------
    //replace
    
    //piles[i].setCards(c, true);
    //piles[i].updatePosition(node);
    
    
    
  });
  return {cards: nCards, piles: piles};
}

const createPiles = (pileDefs, total) => {
  let piles = {};
  for(let i = 0; i<total; i++){
    piles[i] = {...pileDefs[i], id:i};
  }
  return Immutable(piles);
};

export function generatePileDefs(deckID){
  return [
    {x:0,y:0,anchorX:.5,anchorY:1,anchorR:0,o:'ROW'},
    {x:0,y:0,anchorX:0,anchorY:.5,anchorR:90,o:'PILE'},
    {x:0,y:0,anchorX:.5,anchorY:0,anchorR:0,o:'ROW'},
    {x:0,y:0,anchorX:1,anchorY:.5,anchorR:270,o:'PILE'},
    {x:0,y:0,anchorX:.05,anchorY:.05,anchorR:-45,o:'PILE'},
    {x:0,y:0,anchorX:.5,anchorY:.5,anchorR:0,o:'PILE'}
  ];
}

export function findDeckInfo(deckID){
  return {
    suits: ['spade', 'heart', 'club', 'diamond'],
    types: ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  };
}

export function resetPositions(cards, x=0, y=0, angle=0){
  return each(cards, (c) => c.merge({
    x : x,
    y : y,
    z : 0,
    angle : angle
  }));
}

export function randomPositions(cards, boundry) {
  return each(cards, (c) => {
    c.x = random(boundry.x, boundry.width);
    c.y = random(boundry.y, boundry.height);
    c.z = 0;
    c.angle = 0;
  });
}

export function suitRowPositions(cards, types, boundry, key='so'){
  let col, row;
  return each(sortBy(cards, key), (c, i) => {
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
  return each(cards, (c, i) => {
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

//NOT USING RIGHT NOW
// export function deal(cards, players, node, deal = 7){
//   let i;
//   let b;
//   let newCards = [];
//   let chunks = [];
  
//   // shuffle and flip
//   cards = flip(shuf(cards), true);
  
//   // deal cards to players
//   chunks = chunk(cards, deal);
  
//   // position cards
//   for(i=0; i<chunks.length; i++){
//     if(i < players){
//       b = boundryCentroid(boundry, i, chunks[i][0]);
//     }else{
//       b = {x: 0, y:0};
//     }
//     if(i == 0){
//       newCards = concat(newCards, flip(centroidPositions(chunks[i], b.x, b.y, 200, 80, -90), false));
//     }else{
//       newCards = concat(newCards, resetPositions(chunks[i], b.x, b.y));
//     }
//   }
//   return newCards;
// }

export function shuffle(cards, cx=0, cy=0){
  return resetPositions(shuf(cards), cx, cy);
}

export function sort(cards, cx=0, cy=0, key='so'){
  return resetPositions(sortBy(cards, key), cx, cy);
}

export function flip(cards, flipped = false){
  return merge(cards, {flipped: flipped});
}

export function merge(cards, obj){
  // return each(cards, (c) => {
  //   // each(obj, (v, k) => {
  //   //   c[k] = v;
  //   // });
  //   c = c.merge(obj);
  // });
  //return cards.map((c) => c.merge(obj));
  let nCards = cards;
  each(cards, (c, k) => {
    nCards = nCards.set(k, obj);
  });
  return nCards;
}

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
