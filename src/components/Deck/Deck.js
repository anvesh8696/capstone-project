import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';
import { cardDefaults } from './DeckCard';
import {resetPositions, randomPositions, suitRowPositions, centroidPositions, deal, flip, sort, shuffle} from './CardUtil';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 220;

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
    dealTimer: 0
  }
  
  componentDidMount(){
    this.setState({cards: this.createCards()});
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
          let t = setTimeout(()=>{
            this.setState({
              ...this.state,
              dealTimer:0,
              cards: deal(this.state.cards, this.state.players, this.boundry())
            });
          }, 1500);
          this.setState({...this.state, dealTimer:t, cards: flip(resetPositions(this.state.cards), true)});
          break;
        case 'suits':
          this.setState({...this.state, cards: suitRowPositions(this.state.cards, this.state.types, this.boundry())});
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
          this.setState({...this.state, cards: randomPositions(this.state.cards, this.boundry())});
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
  
  boundry = () => {
    let c = this.state.cards[0];
    let cw = CARD_WIDTH * c.scale;
    return {
      x: -cw * 0.5,
      y: -CARD_HEIGHT * c.scale,
      width: this.refs.node.clientWidth - (cw + (cw * 0.5)),
      height: this.refs.node.clientHeight - CARD_HEIGHT
    };
  }
  
  centerX = () => {
    let b = this.boundry();
    return b.x + ((b.width - b.x) * 0.5);
  }
  
  centerY = () => {
    let b = this.boundry();
    return b.y + ((b.height - b.y) * 0.5);
  }
  
  renderCards(cards, action) {
    return cards.map(c => <DeckCard {...c} />);
  }
  
  render() {
    const { cards } = this.state;
    const { action } = this.props;
    return (
      <div ref="node" className={theme.deck}>
        {
          this.renderCards(cards, action)
        }
      </div>
    );
  }
}
