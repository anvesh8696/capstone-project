import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './DeckCard.scss';
import classNames from 'classnames';
import { Motion, spring } from 'react-motion';
import utils from 'react-toolbox/components/utils/utils';

export const cardDefaults = {
  suit: 'diamond',
  value: '10',
  id: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 0.5,
  angle: 0,
  order: 0,
  pile: 0,
  angleOffset: 0,
  flipped: false,
  selected: false,
  clickable: false
};

export const cardDealDefaults = {
  x: 0,
  y: 0,
  z: 0,
  pile: 0,
  lastInPile: false,
  angleOffset: 0,
  selected: false,
  clickable: false
};

@themr('DeckCard', theme)
export default class DeckCard extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    suit: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    angle: PropTypes.number.isRequired,
    angleOffset: PropTypes.number.isRequired,
    lastInPile: PropTypes.bool.isRequired,
    pile: PropTypes.number.isRequired,
    order: PropTypes.number.isRequired,
    flipped: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    clickable: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired
  }
  
  static defaultProps = cardDefaults
  
  cardMotion(x, y, scale, angle, order) {
    return {
      WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${angle}deg)`,
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${angle}deg)`,
      zIndex: order
    };
  }
  
  createAria(value, suit, pile, flipped, lastInPile) {
    // player card
    if(pile === 0){
      return {
        'role': 'radio',
        'aria-label': `${value} of ${suit}s`,
        'tabIndex': '0'
      };
    }
    // discard card
    else if(pile === 5){
      if(lastInPile){
        return {
          'aria-label': `last played card is ${value} of ${suit}s`,
          'tabIndex': 0
        };
      }
    }
    // team card
    else if(flipped === false){
      return {
        'aria-label': `${value} of ${suit}s`,
        'tabIndex': 0
      };
    }
    // default is not selectable
    return {
      'aria-hidden': true,
      'tabIndex': -1
    };
  }
  
  render() {
    let {x, y, scale, angle, angleOffset, flipped,
      selected, clickable, order, suit, value, pile, onClick, onKeyDown, lastInPile} = this.props;
    let style = {x: spring(x), y: spring(y), angle: spring(angle + angleOffset)};
    const front = classNames(theme.front,
      flipped ? theme.flipped : '',
      selected ? theme.selected : '',
      theme[`suit${this.props.suit}`]);
    const back = classNames(theme.back,
      flipped ? theme.flipped : '',
      selected ? theme.selected : '');
    const inner = classNames(theme.inner,
      clickable ? theme.clickable : '',
      selected ? theme.selected : '');
    const aria = this.createAria(value, suit, pile, flipped, lastInPile);
    
    return (
      <Motion style={style}>
        {
          ({x, y, angle}) => (
            <div className={theme.move} style={this.cardMotion(x, y, scale, angle, order)}>
              <div className={theme.originb}></div>
              <div className={inner} onClick={onClick} onKeyDown={(e)=>{onKeyDown(e)}} {...aria}>
                <div className={front}>
                  <p aria-hidden="true">{value}</p>
                </div>
                <div className={back}></div>
                <div className={theme.origin}></div>
              </div>
            </div>
          )
        }
      </Motion>
      
    );
  }
}
