import React, { Component, PropTypes } from 'react';
import { chain, debounce, each, findIndex, random } from 'lodash';
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';
import {resetPositions, randomPositions, suitRowPositions,
  centroidPositions, flip, sort, shuffle, boundry, merge} from './CardUtil';
import { updatePiles, updateCards } from './PileUtil';

export const CARD_WIDTH = 150;
export const CARD_HEIGHT = 220;

@themr('Deck', theme)
export default class Deck extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    playerIndex: PropTypes.number.isRequired,
    totalPlayers: PropTypes.number.isRequired,
    cards: PropTypes.array.isRequired,
    piles: PropTypes.object.isRequired,
    pileDefs: PropTypes.array.isRequired,
    onCardClick: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  }
  
  state = {
    dealTimer: 0
  }
  
  debounceResize = null;
  
  componentWillUnmount(){
    window.removeEventListener('resize', this.debounceResize);
  }
  
  componentDidMount(){
    this.debounceResize = debounce(() => this.handleResize(), 50, {'maxWait': 50});
    window.addEventListener('resize', this.debounceResize);
    
    //this.handleResize();
  }
  
  handleResize = () => {
    let { piles, cards, playerIndex, totalPlayers } = this.props;
    
    if(cards.length > 0){
      let scale = cards.length > 0 ? cards[0].scale : 0.5;
      let offset = (CARD_WIDTH > CARD_HEIGHT ? CARD_WIDTH: CARD_HEIGHT) * scale;
      let b = boundry(this.refs.node, offset);
      let nPiles = updatePiles(piles, b);
      let nCards = updateCards(nPiles, cards, playerIndex, totalPlayers);
      this.props.onUpdate({type:'merge', data:{piles:nPiles, cards:nCards}});
    }
  };
  
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
        case 'done':
          this.playerDone(0);
          break;
        case 'deal':
          // let t = setTimeout(()=>{
          //   this.setState({
          //     ...this.state,
          //     dealTimer:0,
          //     cards: deal(this.props.cards, this.state.players, boundry(this.refs.node, this.props.cards[0].scale))
          //   });
          // }, 1500);
          // this.setState({...this.state, dealTimer:t, cards: flip(resetPositions(this.props.cards), true)});
          this.dealCards();
          break;
        case 'suits':
          this.setState({...this.state, cards: suitRowPositions(this.props.cards, this.state.types, boundry(this.refs.node, this.props.cards[0].scale))});
          break;
        case 'shuffle':
          this.setState({...this.state, cards: shuffle(this.props.cards, this.centerX(), this.centerY())});
          break;
        case 'sort':
          this.setState({...this.state, cards: sort(this.props.cards, this.centerX(), this.centerY())});
          break;
        case 'fan':
          this.setState({...this.state, cards: centroidPositions(this.props.cards, this.centerX(), this.centerY())});
          break;
        case 'random':
          this.setState({...this.state, cards: randomPositions(this.props.cards, boundry(this.refs.node, this.props.cards[0].scale))});
          break;
        case 'flip':
          this.setState({...this.state, cards: flip(this.props.cards)});
          break;
        case 'hand_select_random':
          this.handSelectRandomCards();
          break;
        default:
          this.setState({...this.state, cards: resetPositions(this.props.cards)});
      }
    }
  }
  
  handSelectRandomCards = () => {
    let playerID = this.state.player.id;
    let pile = this.props.piles[playerID];
    
    pile.selectCard(3);
  }
  
  playerDone = (player) => {
    if(this.isPlayerTurn(player)){
      let playerPile = this.getPlayerPile(player);
      let discardPile = this.getDiscardPile();
      let c = playerPile.getSelectedCards();
      
      if(c && c.length > 0){
        merge(c, {flipped: false, selected: false, angleOffset: random(0, 45)});
        discardPile.addCards(c, true);
        playerPile.updatePosition(this.refs.node);
        // Prevent button spam
        this.state.playerTurn = -1;
      }
    }
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
        
        playerPile.addCards(c, true);
        this.setState({...this.state});
      }
    }
  }
  
  isTeammate = (id) => {
    let playerID = this.state.player.id;
    let teamID = findIndex(this.state.game.teams, (t) => { return t.indexOf(playerID) != -1; });
    let team = this.state.game.teams[teamID];
    console.log('isteammate', playerID, team, teamID)
    return team && team.indexOf(id) != -1;
  }
  
  isPlayerTurn = (player) => this.state.playerTurn === player
  
  getDrawPile = () => {
    let p = this.props.piles;
    return p.length > 2 ? p[p.length - 2] : null;
  }
  
  getDiscardPile = () => {
    let p = this.props.piles;
    return p.length > 1 ? p[p.length - 1] : null;
  }
  
  getPlayerPile = (player) => {
    let playerID = player || this.state.player.id;
    return this.props.piles[playerID];
  }
  
  isPlayerCard = (card, player) => {
    let playerID = player || this.state.player.id;
    let pile = this.props.piles[playerID];
    return pile.isCardInPile(card);
  }
  
  centerX = () => {
    let b = boundry(this.refs.node, this.props.cards[0].scale);
    return b.x + ((b.width - b.x) * 0.5);
  }
  
  centerY = () => {
    let b = boundry(this.refs.node, this.props.cards[0].scale);
    return b.y + ((b.height - b.y) * 0.5);
  }
  
  renderCards(cards, action) {
    const { onCardClick } = this.props;
    return chain(each(cards, (card, key) => {
      card.set('order', Math.round(card.x - card.y + card.z));
    }))
    .orderBy('order', 'asc')
    .each((card, key) => {
      card.set('order', key);
    })
    .map(c => <DeckCard {...c} onClick={() => onCardClick(c)}/>)
    .value();
  }
  
  render() {
    const { cards } = this.props;
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
