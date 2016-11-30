import React, { Component, PropTypes, findDOMNode } from 'react';
import ReactDOM from 'react-dom';
import { findIndex } from 'lodash';
import { themr } from 'react-css-themr';
import defaultTheme from './CardGame.scss';
import Deck from 'components/Deck/Deck';
import deckTheme from 'components/Deck/Deck.scss';
import PlayerButtonBar from 'components/PlayerButtonBar';
import { organize, isCardInPile } from 'components/Deck/PileUtil';
import { each, random } from 'lodash';
import PlayerAvatars from 'components/PlayerAvatars';

@themr('CardGame', defaultTheme)
class CardGame extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    buttonAction: PropTypes.func.isRequired,
    updateGame: PropTypes.func.isRequired,
    mergeGame: PropTypes.func.isRequired,
    playerTurnEnd: PropTypes.func.isRequired
  }
  
  handleCardClick = (card) => {
    
    const { id } = this.props.me;
    let pile = this.getPlayerIndex(id);
    
    // Player's cards are only clickable when it's their turn
    if(this.isPlayerTurn(id) && isCardInPile(card, pile)){
      this.updateCard({...card, selected: !card.selected});
    }
  }
  
  handleDeckUpdate = (msg) => {
    if(msg.type === 'merge'){
      this.props.mergeGame(msg.data);
    }else if(msg.type === 'update'){
      this.props.updateGame(msg.keys, msg.data);
    }
  }
  
  handleDraw = () => {
    const { id } = this.props.me;
    if(this.isPlayerTurn(id)){
      let draw = this.getDrawPileIndex();
      let cards = this.getPileCards(draw);
      if(cards.length > 0){
        let c = cards[cards.length - 1].merge({
          pile: this.getPlayerIndex(id),
          flipped: false
        });
        this.updateCard(c);
        
        // make sure player cards are unselected
        let pile = this.getPlayerIndex(id);
        cards = this.getSelectedCards(pile);
        each(cards, (c) => {
          if(c.selected){
            this.updateCard(c.merge({
              selected: false
            }));
          }
        });
        
        this.props.playerTurnEnd(pile);
        window.dispatchEvent(new Event('resize'));
      }
    }
  }
  
  handleDone = () => {
    const { id } = this.props.me;
    if(this.isPlayerTurn(id)){
      let pile = this.getPlayerIndex(id);
      let cards = this.getSelectedCards(pile);
      let discard = this.getDiscardPileIndex();
      each(cards, (c) => {
        this.updateCard(c.merge({
          pile: discard,
          flipped: false,
          selected: false, 
          angleOffset: random(0, 45)
        }));
      });
      if(cards.length > 0){
        this.props.playerTurnEnd(this.getPlayerIndex(id));
        window.dispatchEvent(new Event('resize'));
      }
    }
  }
  
  isPlayerTurn = (player) => this.props.room.playerTurn === player

  getSelectedCards = (pile) => {
    let cards = [];
    each(this.props.game.cards, (c) => {
      if(c.selected && c.pile == pile){
        cards.push(c);
      }
    });
    return cards;
  }
  
  getPileCards = (pile) => {
    let cards = [];
    each(this.props.game.cards, (c) => {
      if(c.pile == pile){
        cards.push(c);
      }
    });
    return cards;
  }
  
  getPlayerIndex = (playerID) => {
    const { players } = this.props.room;
    return findIndex(players, (p) => p.id == playerID);
  }
  
  getDiscardPileIndex = () => {
    return 5;
    return this.props.game.pileDefs.length - 1;
  }
  
  getDrawPileIndex = () => {
    return 4;
    return this.props.game.pileDefs.length - 1;
  }
  
  updateCard = (card) => {
    const { cards } = this.props.game;
    let indexToUpdate = findIndex(cards, (o) => o.key == card.key);
    this.props.updateGame(['cards', indexToUpdate], card);
  }

  render() {
    const { theme, game } = this.props;
    const { players } = this.props.room;
    const { id } = this.props.me;
    const playerIndex = this.getPlayerIndex(id);
    return (
      <div className={theme.page}>
        <PlayerAvatars players={players} playerIndex={playerIndex}/>
        <PlayerButtonBar onDraw={this.handleDraw} onDone={this.handleDone}/>
        <Deck ref="deck"
          action={''}
          {...game}
          playerIndex={playerIndex}
          totalPlayers={players.length}
          theme={theme}
          onCardClick={this.handleCardClick}
          onUpdate={this.handleDeckUpdate}
        />
      </div>
    );
  }
}
export default CardGame;
