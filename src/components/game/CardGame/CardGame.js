import React, { Component, PropTypes, findDOMNode } from 'react';
import ReactDOM from 'react-dom';
import { findIndex } from 'lodash';
import { themr } from 'react-css-themr';
import defaultTheme from './CardGame.scss';
import Deck from 'components/Deck/Deck';
import deckTheme from 'components/Deck/Deck.scss';
import PlayerButtonBar from 'components/PlayerButtonBar';
import { cardIndex, isCardInPile, updateCards, addCardsToPile, addDrawCardToPile } from 'utils/PileUtil';
import { each, random, findLastIndex, findLast } from 'lodash';
import PlayerAvatars from 'components/PlayerAvatars';
import { getPlayerIndex, isPlayerTurn } from 'utils/RoomUtil';
import { updateCard, getDrawPileIndex, getDiscardPileIndex, getLastDiscard, getSelectedCards } from 'utils/GameUtil';
import GameOverModal from 'components/ui/modal/GameOverModal';

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
    playerTurnEnd: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
  }
  
  handleCardClick = (card) => {
    const { id } = this.props.me;
    const { cards, pileDefs } = this.props.game;
    
    let pile = getPlayerIndex(this.props.room.players, id);
    // Player's cards are only clickable when it's their turn
    if(isPlayerTurn(this.props.room, id) && isCardInPile(card, pile)){
      
      let prevCard = getLastDiscard(cards, pileDefs);
      
      // must match prev card suit or value
      if(prevCard){
        if(card.suit != prevCard.suit && card.value != prevCard.value){
          return;
        }
      }
      
      updateCard(cards, {...card, selected: !card.selected}, this.props.updateGame);
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
    const { piles, pileDefs } = this.props.game;
    let { cards } = this.props.game;
    
    if(isPlayerTurn(this.props.room, id)){
      let playerPile = getPlayerIndex(this.props.room.players, id);
      
      cards = addDrawCardToPile(cards, piles, pileDefs, playerPile, false);
      
      // make sure player cards are unselected
      cards = cards.map((c) => c.pile == playerPile ? c.merge({selected: false}) : c);
      cards = updateCards(piles, cards, playerPile, this.props.room.players.length);
      
      this.props.updateGame(['game', 'cards'], cards);
      this.props.playerTurnEnd(id);
    }
  }
  
  handleDone = () => {
    const { id } = this.props.me;
    const { pileDefs, piles } = this.props.game;
    let { cards } = this.props.game;
    
    if(isPlayerTurn(this.props.room, id)){
      let pile = getPlayerIndex(this.props.room.players, id);
      let selected = getSelectedCards(cards, pile);
      let discard = getDiscardPileIndex(pileDefs);
      
      cards = addCardsToPile(cards, selected, discard, false, true);
      
      if(selected.length > 0){
        cards = updateCards(piles, cards, pile, this.props.room.players.length);
        this.props.updateGame(['game', 'cards'], cards);
        this.props.playerTurnEnd(id);
      }
    }
  }

  render() {
    const { theme, game, room, onDone } = this.props;
    const { players, winner } = this.props.room;
    const { id } = this.props.me;
    const { playerTurn } = room;
    const playerIndex = getPlayerIndex(players, id);
    const playerTurnIndex = getPlayerIndex(players, playerTurn);
    return (
      <div className={theme.page}>
        <GameOverModal open={room.isGameOver} winner={winner} onDone={onDone}/>
        <PlayerAvatars players={players} playerIndex={playerIndex} playerTurnIndex={playerTurnIndex} />
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
