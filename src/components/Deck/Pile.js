//import {resetPositions, randomPositions, suitRowPositions, centroidPositions, deal, flip, sort, shuffle} from './CardUtil';
import { pull, each, find } from 'lodash';
import { resetPositions, boundry, boundryCentroid } from './CardUtil';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 220;

//export const ARC = 'ARC';
//export const DOT = 'DOT';
export const RECT = 'RECT';
export const GRID = 'GRID';
export const PILE = 'PILE';
export const ROW = 'ROW';

export default class Pile {
  
  state = {
    flipped: false,
    cards: [],
    id: 0,
    organizer: PILE,
    anchorX: 0.5,
    anchorY: 0.5,
    anchorR: 0,
    x: 0,
    y: 0,
    board: null
  }
  
  constructor(id, def){
    this.state.id = id;
    this.state.organizer = def.o || PILE;
    this.setAnchor(def.x, def.y, def.r || 0);
  }
  
  setAnchor = (x=0, y=0, r=0) => {
    this.state = {...this.state, anchorX:x, anchorY:y, anchorR:r};
  }
  
  setBoard = (board) => {
    this.state.board = board;
  }
  
  setCards = (cards, update = false) => {
    this.state.cards = cards;
    if(update){
      this.updatePosition();
    }
  }
  
  addCard = (c, update = false) => {
    this.state.cards.push(c);
    if(update){
      this.updatePosition();
    }
  }
  
  selectCard = (id) => {
    this.state.cards[id].selected = true;
  }
  
  delectCard = (id) => {
    this.state.cards[id].selected = false;
  }
  
  isCardInPile = (card) => {
    return find(this.state.cards, { key: card.key }) != undefined;
  }
  
  getFirstCard = () => {
    return this.state.cards.shift();
  }
  
  hasCards = () => {
    return this.state.cards.length > 0;
  }
  
  removeCard = (c, update = false) => {
    this.state.cards.push(c);
    
    //TODO Check if todo is the correct method to choose
    //NEXT put cards in hands on deal
    //Get cards to update acording to screen changes
    //Create player class that can work with player input, bot input or remote player input
    //Creat a flow controller that controls who does what and when ***order
    // Deal cards > Choose player goes first > is game over > next player turn
    this.state.cards = pull(this.state.cards, c);
    
    if(update){
      this.updatePosition();
    }
  }
  
  updatePosition = () => {
    this.updatePilePosition();
    this.updateCardPositions();
  }
  
  updatePilePosition = () => {
    let { anchorX, anchorY, cards, board } = this.state;
    let scale = cards.length > 0 ? cards[0].scale : 0.5;
    let offset = (CARD_WIDTH > CARD_HEIGHT ? CARD_WIDTH: CARD_HEIGHT) * scale;
    let b = boundry(board, offset);
    // console.log(this.state.id, anchorX, anchorY);
    this.state = {
      ...this.state,
      x: b.x + b.width * anchorX,
      y: b.y + b.height * anchorY
    };
  }
  
  updateCardPositions = () => {
    let { cards, x, y, anchorR, organizer } = this.state;
    switch(organizer){
      case PILE:
        this.state.cards = this.orgainizePile(cards, x, y, anchorR);
      break;
      case ROW:
        this.state.cards = this.orgainizeRow(cards, x, y, anchorR);
    }
  }
  
  orgainizePile(cards, x, y, angle){
    let scale = cards.length > 0 ? cards[0].scale : 0.5;
    let ch = CARD_HEIGHT * scale;
    return each(cards, (c, i) => {
      c.x = x;
      c.y = y + i * 1;
      c.z = 0;
      c.angle = angle;
    });
  }
  
  orgainizeRow(cards, x, y, angle){
    if(cards.length > 0){
      let cw = cards[0].scale * CARD_WIDTH * 0.5;
      let ch = cards[0].scale * CARD_HEIGHT * 0.5;
      x -= ((cards.length * cw * 0.5) - cw);
      return each(cards, (c, i) => {
        c.x = x + (i * cw);
        c.y = y;
        c.z = 0;
        c.angle = angle;
      });
    }
  }
}
