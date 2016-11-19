import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './DeckCard.scss';
import classNames from 'classnames';

@themr('DeckCard', theme)
export default class DeckCard extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    suit: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }
  
  static defaultProps = {
    suit: 'diamond',
    value: '10'
  }
  render() {
    const cardClass = classNames(theme.card, theme[`suit${this.props.suit}`]);
    return (
      <div className={cardClass}>
        <p>{this.props.value}</p>
      </div>
    );
  }
}
