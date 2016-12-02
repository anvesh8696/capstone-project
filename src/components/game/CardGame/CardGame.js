import React, { Component, PropTypes, findDOMNode } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './CardGame.scss';
import Deck from 'components/Deck/Deck';
import deckTheme from 'components/Deck/Deck.scss';
import PlayerButtonBar from 'components/PlayerButtonBar';
import { cardIndex, isCardInPile, updateCards } from 'utils/PileUtil';
import { each, random, findLastIndex, findLast } from 'lodash';
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
    const { piles, pileDefs } = this.props.game;
    let { cards } = this.props.game;
    
    if(isPlayerTurn(this.props.room, id)){
      let draw = getDrawPileIndex(pileDefs);
      let cardsB = getPileCards(cards, draw);
      if(cardsB.length > 0){
        let playerPile = getPlayerIndex(this.props.room.players, id);
        let c = findLast(cards, { pile: draw });
        let insert = findLastIndex(cards, { pile: playerPile }) + 1;
        cards = this.insertCard(cards, c.merge({
          pile: playerPile,
          flipped: false,
          selected: false,
          angleOffset: 0
        }), insert);
        
        // make sure player cards are unselected
        cards = cards.map((c) => c.pile == playerPile ? c.merge({selected: false}) : c);
        cards = updateCards(piles, cards, playerPile, this.props.room.players.length);
        this.props.updateGame(['game', 'cards'], cards);
        this.props.playerTurnEnd(id);
      }
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
      each(selected, (c) => {
        let insert = findLastIndex(cards, { pile: discard }) + 1;
        cards = this.insertCard(cards, c.merge({
          pile: discard,
          flipped: false,
          selected: false,
          angleOffset: random(0, 45)
        }), insert);
      });
      if(selected.length > 0){
        cards = updateCards(piles, cards, pile, this.props.room.players.length);
        this.props.updateGame(['game', 'cards'], cards);
        this.props.playerTurnEnd(id);
      }
    }
  }
  
  insertCard(cards, card, insertIndex, updateGame) {
    let prev = null;
    let b = null;
    let oldIndex = cardIndex(cards, card.key);
    
    // Remove the prev position
    if(oldIndex != -1){
      cards = cards.slice(0, oldIndex).concat(cards.slice(oldIndex + 1));
    }
    
    // Insert at index and shift other cards
    cards = cards.map(function (value, index) {
      if(index < insertIndex){
        return value;
      } else if (index == insertIndex) {
        prev = value;
        return card;
      } else {
        b = prev;
        prev = value;
        return b;
      }
    });
    
    // Add the tail card back into the array
    if(prev && prev != cards[cards.length - 1]){
      cards = cards.concat([prev]);
    }
    return cards;
    //updateGame(['game', 'cards'], cards);
  }

  render() {
    const { theme, game, room } = this.props;
    const { players } = this.props.room;
    const { id } = this.props.me;
    const { playerTurn } = room;
    const playerIndex = getPlayerIndex(players, id);
    const playerTurnIndex = getPlayerIndex(players, playerTurn);
    return (
      <div className={theme.page}>
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
