import React, { Component, PropTypes } from 'react';
import { chain, debounce, each, findIndex, random } from 'lodash'; 
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
    player: {
      id: 0
    },
    game: {
      teams: [
        [0, 2],
        [1, 3]
      ],
      pileDefs: [
        {x:.5,y:1,o:'ROW'},{x:0,y:.5,r:90},{x:.5,y:0,o:'ROW'},{x:1,y:.5,r:270},{x:.05,y:.05,r:-45},{x:.5,y:.5}
      ]
    }
  }
  
  debounceResize = null;
  
  componentDidMount(){
    let cards = this.createCards();
    this.setState({cards: cards});
    this.debounceResize = debounce(() => this.handleResize(), 50, {'maxWait': 50});
    window.addEventListener('resize', this.debounceResize);
  }
  
  handleResize = () => {
    each(this.state.piles, (p) => {
      p.updatePosition();
    });
    this.forceUpdate();
  };
  
  componentWillUnmount(){
    window.removeEventListener('resize', this.debounceResize);
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
        case 'draw':
          this.drawCard(random(0, 3));
          break;
        case 'deal':
          // let t = setTimeout(()=>{
          //   this.setState({
          //     ...this.state,
          //     dealTimer:0,
          //     cards: deal(this.state.cards, this.state.players, boundry(this.refs.node, this.state.cards[0].scale))
          //   });
          // }, 1500);
          // this.setState({...this.state, dealTimer:t, cards: flip(resetPositions(this.state.cards), true)});
          this.dealCards();
          break;
        case 'suits':
          this.setState({...this.state, cards: suitRowPositions(this.state.cards, this.state.types, boundry(this.refs.node, this.state.cards[0].scale))});
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
          this.setState({...this.state, cards: randomPositions(this.state.cards, boundry(this.refs.node, this.state.cards[0].scale))});
          break;
        case 'flip':
          this.setState({...this.state, cards: flip(this.state.cards)});
          break;
        case 'hand_select_random':
          this.handSelectRandomCards();
          break;
        default:
          this.setState({...this.state, cards: resetPositions(this.state.cards)});
      }
    }
  }
  
  handSelectRandomCards = () => {
    let playerID = this.state.player.id;
    let pile = this.state.piles[playerID];
    
    pile.selectCard(3);
  }
  
  drawCard = (player) => {
    let drawPile = this.getDrawPile();
    let playerPile = this.getPlayerPile(player);
    
    if(drawPile){
      if(!drawPile.hasCards()){
        //TODO: Add cards from discard pile minus top card
        //TODO: Shuffle
      }
      // Add to player pile
      let c = drawPile.getFirstCard();
      if(c){
        
        //Flip the card over if teammate
        if(this.isTeammate(player)){
          c.flipped = false;
        }
        
        playerPile.addCard(c, true);
        this.setState({...this.state});
      }
    }
  }
  
  dealCards = () => {
    let { cards, deal, players } = this.state;
    
    //1. Seperate Cards into chunks (player piles, draw pile)
    let chunks = dealCards(cards, players, deal);
    
    //2. Create piles for each player and each game pile
    let piles = this.createPiles(players + 2);
    
    //3. Add cards to piles and updates positions
    //let playerID = this.state.player.id;
    each(chunks, (c, i) => {
      c = flip(c, !this.isTeammate(i));
      // if(i === playerID){
      //   //c = c.map((e) => ({...e, clickable: true}));
      //   each(c, (e) => {e.clickable = true});
      //   //console.log(i, playerID, c);
      // }
      piles[i].setCards(c, true);
    });
    
    this.setState({cards: cards, piles: piles});
  }
  
  isTeammate = (id) => {
    let playerID = this.state.player.id;
    let teamID = findIndex(this.state.game.teams, (t) => { return t.indexOf(playerID) != -1; });
    let team = this.state.game.teams[teamID];
    return team && team.indexOf(id) != -1;
  }
  
  isPlayerTurn = () => {
    //TODO: add turn system control
    // - submit card?
    // - create in a way that a NPC / RPC can use the same code
    return true;
  }
  
  getDrawPile = () => {
    let p = this.state.piles;
    return p.length > 2 ? p[p.length - 2] : null;
  }
  
  getPlayerPile = (player) => {
    let playerID = player || this.state.player.id;
    return this.state.piles[playerID];
  }
  
  isPlayerCard = (card, player) => {
    let playerID = player || this.state.player.id;
    let pile = this.state.piles[playerID];
    return pile.isCardInPile(card);
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
    for(let i = 0; i<piles; i++){
      p = new Pile(i, pileDefs[i]);
      p.setBoard(this.refs.node);
      pi.push(p);
    }
    return pi;
  }
  
  centerX = () => {
    let b = boundry(this.refs.node, this.state.cards[0].scale);
    return b.x + ((b.width - b.x) * 0.5);
  }
  
  centerY = () => {
    let b = boundry(this.refs.node, this.state.cards[0].scale);
    return b.y + ((b.height - b.y) * 0.5);
  }
  
  onHandleCardClick = (card) => {
    console.log('onHandleCardClick', card);
    
    //TODO: Check if the card is in the players hand
    if(this.isPlayerTurn() && this.isPlayerCard(card)){
      card.selected = !card.selected;
      this.setState({cards: this.state.cards});
    }
  }
  
  renderCards(cards, action) {
    return chain(each(cards, (card, key) => {
      card.order = Math.round(card.x - card.y + card.z);
    }))
    .orderBy('order', 'asc')
    .each((card, key) => {
      card.order = key;
    })
    .map(c => <DeckCard {...c} onClick={() => this.onHandleCardClick(c)}/>)
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
