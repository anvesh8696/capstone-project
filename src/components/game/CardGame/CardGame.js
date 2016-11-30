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
import { getPlayerIndex, isPlayerTurn } from 'utils/RoomUtil';
import { updateCard, getDrawPileIndex, getDiscardPileIndex, getPileCards, getSelectedCards } from 'utils/GameUtil';

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
    let pile = getPlayerIndex(this.props.room.players, id);
    console.log(pile, id, this.props.room, isPlayerTurn(this.props.room, id), isCardInPile(card, pile))
    // Player's cards are only clickable when it's their turn
    if(isPlayerTurn(this.props.room, id) && isCardInPile(card, pile)){
      updateCard(this.props.game.cards, {...card, selected: !card.selected}, this.props.updateGame);
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
    if(isPlayerTurn(this.props.room, id)){
      let draw = getDrawPileIndex(this.props.game.pileDefs);
      let cards = getPileCards(this.props.game.cards, draw);
      if(cards.length > 0){
        let c = cards[cards.length - 1].merge({
          pile: getPlayerIndex(this.props.room.players, id),
          flipped: false
        });
        updateCard(this.props.game.cards, c, this.props.updateGame);
        
        // make sure player cards are unselected
        let pile = getPlayerIndex(this.props.room.players, id);
        cards = getSelectedCards(this.props.game.cards, pile);
        each(cards, (c) => {
          if(c.selected){
            updateCard(this.props.game.cards, c.merge({
              selected: false
            }), this.props.updateGame);
          }
        });
        
        this.props.playerTurnEnd(id);
        window.dispatchEvent(new Event('resize'));
      }
    }
  }
  
  handleDone = () => {
    const { id } = this.props.me;
    if(isPlayerTurn(this.props.room, id)){
      let pile = getPlayerIndex(this.props.room.players, id);
      let cards = getSelectedCards(this.props.game.cards, pile);
      let discard = getDiscardPileIndex(this.props.game.pileDefs);
      each(cards, (c) => {
        updateCard(this.props.game.cards, c.merge({
          pile: discard,
          flipped: false,
          selected: false, 
          angleOffset: random(0, 45)
        }), this.props.updateGame);
      });
      if(cards.length > 0){
        this.props.playerTurnEnd(id);
        window.dispatchEvent(new Event('resize'));
      }
    }
  }

  render() {
    const { theme, game } = this.props;
    const { players } = this.props.room;
    const { id } = this.props.me;
    const playerIndex = getPlayerIndex(players, id);
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
