import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';
import { sortBy, forEach } from 'lodash';

@themr('Deck', theme)
export default class Deck extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired
  }
  
  state = {
    open: false,
    suits: ['spade', 'heart', 'club', 'diamond'],
    types: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    cards: []
  }
  
  componentDidMount(){
    this.setState({cards: this.createCards()});
  }
  
  createCards = () => {
    const {suits, types} = this.state;
    let c=[];
    let t = suits.length * types.length;
    for(let i=0; i<t; i++){
      c.push({
        key: 'key_' + i,
        suit: suits[Math.floor(i / types.length)],
        value: types[i % types.length],
        so: i,
        x: 0,
        y: 0,
        scale: 0.5,
        angle: 0
      });
    }
    return c;
  }
  
  handleMouseDown = () => {
    this.setState({open: !this.state.open});
    
    if(this.state.open){
      this.resetPositions();
    }else{
      // this.sortPositions();
      this.centroidPositions(this.centerX(), this.centerY(), 100);
    }
  }
  
  randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  randomX = () => {
    let w = this.refs.node.clientWidth;
    return this.randomInt(0, w - 150);
  }
  
  randomY = () => {
    let h = this.refs.node.clientHeight;
    return this.randomInt(0, h - 220);
  }
  
  centerX = () => {
    return this.refs.node.clientWidth / 2;
  }
  
  centerY = () => {
    return this.refs.node.clientHeight / 2;
  }
  
  resetPositions(){
    const { cards } = this.state;
    let newCards = forEach(cards, (c) => {
      c.x = 0;
      c.y = 0;
      c.angle = 0;
    });
    this.setState({cards: newCards});
  }
  
  randomPositions() {
    const { cards } = this.state;
    let newCards = forEach(cards, (c) => {
      c.x = this.randomX();
      c.y = this.randomY();
      c.angle = 0;
    });
    this.setState({cards: newCards});
  }
  
  sortPositions(){
    const {cards, types} = this.state;
    let col, row;
    let newCards = forEach(sortBy(cards, 'so'), (c, i) => {
      col = i % types.length;
      row = Math.floor(i / types.length);
      c.x = col * (150 * c.scale);
      c.y = row * (220 * c.scale);
      c.angle = 0;
    });
    this.setState({cards: newCards});
  }
  
  centroidPositions(cx=0, cy=0, r=50){
    const {cards} = this.state;
    let step = 360 / cards.length;
    let a, dy, dx;
    let newCards = forEach(sortBy(cards, 'so'), (c, i) => {
      a = step * i * (Math.PI/180);
      c.x = cx + r * Math.cos(a);
      c.y = cy + r * Math.sin(a);
      dy = cy - c.y;
      dx = cx - c.x;
      c.angle = -90 + (Math.atan2(dy, dx) * 180 / Math.PI);
    });
    this.setState({cards: newCards});
  }
  
  renderCards(cards) {
    return cards.map(c => {
    return (
      <DeckCard
        {...c}
        />
    )});
  }
  
  render() {
    const { cards } = this.state;
    return (
      <div ref="node" className={theme.deck}>
        <button
          onMouseDown={this.handleMouseDown}>
          Switch
        </button>
        {
          this.renderCards(cards)
        }
      </div>
    );
  }
}
