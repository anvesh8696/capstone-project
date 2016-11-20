import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './DeckCard.scss';
import classNames from 'classnames';
import {Motion, spring} from 'react-motion';

@themr('DeckCard', theme)
export default class DeckCard extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    suit: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }
  
  static defaultProps = {
    suit: 'diamond',
    value: '10',
    x: 0,
    y: 0
  }
  
  cardMotion(x, y) {
    return {
      WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${1})`,
      transform: `translate3d(${x}px, ${y}px, 0) scale(${1})`
    };
  }
  
  render() {
    const cardClass = classNames(theme.card, theme[`suit${this.props.suit}`]);
    let {x, y} = this.props;
    let style = {x: spring(x), y: spring(y)};
    return (
      <Motion style={style}>
        {
          ({x, y}) => (
            <div className={theme.move}>
              <div className={cardClass} style={this.cardMotion(x, y)}>
                <p>{this.props.value}</p>
              </div>
            </div>
          )
        }
      </Motion>
      
    );
  }
}
