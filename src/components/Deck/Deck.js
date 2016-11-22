import React, { Component, PropTypes } from 'react';
import { chain, chunk, slice, sortBy, each, shuffle as shuf } from 'lodash'; 
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';
import { cardDefaults } from './DeckCard';
import {resetPositions, randomPositions, suitRowPositions,
  centroidPositions, dealCards, flip, sort, shuffle, boundry} from './CardUtil';
import Pile from './Pile';

export const CARD_WIDTH = 150;
export const CARD_HEIGHT = 220;

@themr('Deck', theme)
export default class Deck extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired
  }
  
  state = {
    open: false,
    suits: ['spade', 'heart', 'club', 'diamond'],
    types: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    cards: [],
    players: 4,
    dealTimer: 0,
    piles: [],
    deal: 7,
    game: {
      pileDefs: [
        {x:.5,y:1,o:'ROW'},{x:0,y:.5,r:90},{x:.5,y:0,o:'ROW'},{x:1,y:.5,r:270},{x:.05,y:.05,r:-45},{x:.5,y:.5}
      ]
    }
  }
  
  componentDidMount(){
    let cards = this.createCards();
    this.setState({cards: cards});
  }
  
  componentWillReceiveProps(nextProps){
    // the cards need to update  
    if(nextProps.hasOwnProperty('action')){
      let { action } = nextProps;
      
      if(action.indexOf('$') != -1){
        action = action.split('$')[0];
      }
      
      if(this.state.dealTimer > 0){
        return;
      }
      
      switch(action){
        case 'deal':
          // let t = setTimeout(()=>{
          //   this.setState({
          //     ...this.state,
          //     dealTimer:0,
          //     cards: deal(this.state.cards, this.state.players, boundry(this.state.cards[0], this.refs.node))
          //   });
          // }, 1500);
          // this.setState({...this.state, dealTimer:t, cards: flip(resetPositions(this.state.cards), true)});
          this.dealCards();
          break;
        case 'suits':
          this.setState({...this.state, cards: suitRowPositions(this.state.cards, this.state.types, boundry(this.state.cards[0], this.refs.node))});
          break;
        case 'shuffle':
          this.setState({...this.state, cards: shuffle(this.state.cards, this.centerX(), this.centerY())});
          break;
        case 'sort':
          this.setState({...this.state, cards: sort(this.state.cards, this.centerX(), this.centerY())});
          break;
        case 'fan':
          this.setState({...this.state, cards: centroidPositions(this.state.cards, this.centerX(), this.centerY())});
          break;
        case 'random':
          this.setState({...this.state, cards: randomPositions(this.state.cards, boundry(this.state.cards[0], this.refs.node))});
          break;
        case 'flip':
          this.setState({...this.state, cards: flip(this.state.cards)});
          break;
        case 'hand_select_random':
        default:
          this.setState({...this.state, cards: resetPositions(this.state.cards)});
      }
    }
  }
  
  dealCards = () => {
    let { cards, deal, players } = this.state;
    
    //1. Seperate Cards into chunks (player piles, draw pile)
    let chunks = dealCards(cards, players, deal);
    
    //2. Create piles for each player and each game pile
    let piles = this.createPiles(players + 2);
    
    //3. Add cards to piles
    each(chunks, (c, i) => {
      piles[i].setCards(c, true);
    });
    
    //4. Animate cards going to each pile
    //5. Pile has "organizer" to make them look proper
    //console.table(cards);
    
    this.setState({cards: cards, piles: piles});
  }
  
  createCards = () => {
    const {suits, types} = this.state;
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
    return c;
  }
  
  createPiles(piles){
    let { pileDefs } = this.state.game;
    let pi = [];
    let p;
    let d;
    for(let i = 0; i<piles; i++){
      d = pileDefs[i];
      p = new Pile(i, pileDefs[i]);
      p.setBoard(this.refs.node);
      //TODO: Abstract this out to parent state
      //p.setAnchor(d.x, d.y, d.r || 0);
      //this.setPileAnchor(p, i);
      pi.push(p);
    }
    return pi;
  }
  
  centerX = () => {
    let b = boundry(this.state.cards[0], this.refs.node);
    return b.x + ((b.width - b.x) * 0.5);
  }
  
  centerY = () => {
    let b = boundry(this.state.cards[0], this.refs.node);
    return b.y + ((b.height - b.y) * 0.5);
  }
  
  renderCards(cards, action) {
    return chain(each(cards, (card, key) => {
      card.order = Math.round(card.x - card.y + card.z);
    }))
    .orderBy('order', 'asc')
    .each((card, key) => {
      card.order = key;
    })
    .map(c => <DeckCard {...c} />)
    .value();
  }
  
  render() {
    const { cards } = this.state;
    const { action, theme } = this.props;
    return (
      <div ref="node" className={theme.board}>
        {
          this.renderCards(cards, action)
        }
      </div>
    );
  }
}
