import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';

@themr('Deck', theme)
export default class Deck extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired
  }
  
  state = {
    open: false,
    cards: this.createCards()
  }
  
  createCards(){
    let s=['spade', 'heart', 'club', 'diamond'];
    let v=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    let c=[];
    let t = s.length * v.length;
    for(let i=0; i<t; i++){
      c.push({
        suit: s[Math.floor(i/v.length)],
        value: v[i%(v.length)] 
      });
    }
    return c;
  }
  
  handleMouseDown = () => {
    this.setState({open: !this.state.open});
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
  
  render() {
    const { cards } = this.state;
    return (
      <div ref="node" className={theme.deck}>
        <button
          onMouseDown={this.handleMouseDown}>
          Switch
        </button>
         {
          cards.map(c => {
          return (
            <DeckCard
              x={this.state.open ? this.randomX() : 0}
              y={this.state.open ? this.randomY() : 0}
              {...c}
              />
          )})
         }
      </div>
    );
  }
}
