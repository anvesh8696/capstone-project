import { pull, each, find, remove, concat } from 'lodash';
import { boundry } from './CardUtil';

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
    y: 0
    // ,
    // board: null
  }
  
  constructor(id, def){
    this.state.id = id;
    this.state.organizer = def.o || PILE;
    this.setAnchor(def.x, def.y, def.r || 0);
  }
 
  setAnchor = (x=0, y=0, r=0) => {
    this.state = {...this.state, anchorX:x, anchorY:y, anchorR:r};
  }
  
  // setBoard = (board) => {
  //   this.state.board = board;
  // }
  
  setCards = (cards, update = false) => {
    if(cards){
      this.state.cards = cards;
    }
    // if(update){
    //   this.updatePosition(this.board);
    // }
  }
  
  addCards = (c, update = false) => {
    this.state.cards = concat(this.state.cards, c);
    // if(update){
    //   this.updatePosition(this.board);
    // }
  }
  
  selectCard = (id) => {
    this.state.cards[id].selected = true;
  }
  
  delectCard = (id) => {
    this.state.cards[id].selected = false;
  }
  
  isCardInPile = (card) => find(this.state.cards, { key: card.key }) != undefined;
  
  getFirstCard = () => this.state.cards.shift();
  
  getSelectedCards = () => remove(this.state.cards, (e) => e.selected === true);
  
  getAnchor = () => ({x:this.state.anchorX, y:this.state.anchorY, r:this.state.anchorR});
  
  hasCards = () => this.state.cards.length > 0;
  
  removeCard = (c, update = false) => {
    this.state.cards.push(c);
    
    //TODO Check if todo is the correct method to choose
    //NEXT put cards in hands on deal
    //Get cards to update acording to screen changes
    //Create player class that can work with player input, bot input or remote player input
    //Creat a flow controller that controls who does what and when ***order
    // Deal cards > Choose player goes first > is game over > next player turn
    this.state.cards = pull(this.state.cards, c);
    
    // if(update){
    //   this.updatePosition(this.board);
    // }
  }
  
  updatePosition = (board) => {
    this.updatePilePosition(board);
    this.updateCardPositions();
  }
  
  updatePilePosition = (board) => {
    let { anchorX, anchorY, cards } = this.state;
    if(cards){
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
    if(cards && cards.length > 0){
      let scale = cards[0].scale;
      let ch = CARD_HEIGHT * scale;
      // return each(cards, (c, i) => {
        // c = c.merge({
        //   x : x,
        //   y : y - i * 1,
        //   z : 0,
        //   angle : angle
        // });
      // });
      // let i = 0;
      // return cards.map((c) => c.merge({
      //   x : x,
      //   y : y - (i++) * 1,
      //   z : 0,
      //   angle : angle
      // }));
      // console.log(this.state.cards);
    }
  }
  
  orgainizeRow(cards, x, y, angle){
    if(cards && cards.length > 0){
      let cw = cards[0].scale * CARD_WIDTH * 0.5;
      let ch = cards[0].scale * CARD_HEIGHT * 0.5;
      x -= ((cards.length * cw * 0.5) - cw);
      return each(cards, (c, i) => c.merge({
        x : x + (i * cw),
        y : y,
        z : 0,
        angle : angle
      }));
    }
  }
}
