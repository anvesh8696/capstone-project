import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import theme from './Deck.scss';
import DeckCard from './DeckCard';

@themr('Deck', theme)
export default class Deck extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired
  }
  
  render() {
    return (
      <div className = {theme.deck}>
        <DeckCard />
        <DeckCard suit = {'spade'} value = {'J'}/>
        <DeckCard suit = {'heart'} value = {'Q'}/>
        <DeckCard suit = {'club'} value = {'K'}/>
      </div>
    );
  }
}
