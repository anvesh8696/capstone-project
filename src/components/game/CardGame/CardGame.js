import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './CardGame.scss';
import Deck from 'components/Deck/Deck';
import PlayerButtonBar from 'components/PlayerButtonBar';
import { isCardInPile, updateCards, addCardsToPile, addDrawCardToPile } from 'utils/PileUtil';
import { find, findIndex } from 'lodash';
import PlayerAvatars from 'components/PlayerAvatars';
import { getPlayerIndex, isPlayerTurn } from 'utils/RoomUtil';
import { updateCard, getDiscardPileIndex, getLastDiscard, getSelectedCards, markLastInPile, getDrawPileIndex } from 'utils/GameUtil';
import GameOverModal from 'components/ui/modal/GameOverModal';
import ActionList from 'components/ui/list/ActionList';

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
      
      // unselect prev selected card
      let lastSelected = find(cards, {selected: true});
      if(lastSelected){
        updateCard(cards, {...lastSelected, selected: false}, this.props.updateGame);
      }
      
      updateCard(cards, {...card, selected: !card.selected}, this.props.updateGame);
    }
  }
  
  handleDeckKeyDown = (event, card) => {
    /*
    onKeyDown: (event) => {
            const c = event.keyCode;
            const dir = c === 37 || c === 38 ? -1 : c === 39 || c === 40 ? 1 : 0;
            const max = headers.length;
            let nidx = ((idx + dir) % max + max) % max;
            if (nidx !== idx){
              const id = event.currentTarget.id;
              const next = headers[nidx];
              if (this.navigationNode && this.navigationNode.children[nidx]) {
                this.navigationNode.children[nidx].focus();
              }
              nidx = id.substring(0, id.lastIndexOf('_') + 1) + nidx;
              this.handleHeaderClick(nidx);
              next.props.onClick && next.props.onClick(event);
            }
          }
          */
    const c = event.keyCode;
    
    // Enter : selects and submits the card if card matches 
    if(c == 13){
      if(!card.selected){
        this.handleCardClick(card);
      }
      setTimeout(this.handleDone, 100);
    }
  }
  
  handleDeckUpdate = (msg) => {
    const { mergeGame, updateGame } = this.props;
    if(msg.type === 'merge'){
      mergeGame(msg.data);
    }else if(msg.type === 'update'){
      updateGame(msg.keys, msg.data);
    }
  }
  
  handleDraw = () => {
    const { id } = this.props.me;
    const { piles, pileDefs } = this.props.game;
    let { cards } = this.props.game;
    
    if(isPlayerTurn(this.props.room, id)){
      let playerPile = getPlayerIndex(this.props.room.players, id);
      let drawPile = getDrawPileIndex(pileDefs);
      
      cards = addDrawCardToPile(cards, piles, pileDefs, playerPile, false);
      
      // mark last card in discard pile
      cards = markLastInPile(cards, drawPile);
      
      // mark last card in player hand
      cards = markLastInPile(cards, playerPile);
      
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
      
      if(selected.length > 0){
        
        // add selected card to discard pile
        cards = addCardsToPile(cards, selected, discard, false, true);
        
        // mark last card in discard pile
        cards = markLastInPile(cards, discard);
        
        // mark last card in player hand
        cards = markLastInPile(cards, pile);
        
        cards = updateCards(piles, cards, pile, this.props.room.players.length);
        this.props.updateGame(['game', 'cards'], cards);
        this.props.playerTurnEnd(id);
      }
    }
  }

  render() {
    const { theme, game, room, onDone } = this.props;
    const { cards } = game;
    const { players, winner, actions } = this.props.room;
    const { id } = this.props.me;
    const { playerTurn } = room;
    const playerIndex = getPlayerIndex(players, id);
    const playerTurnIndex = getPlayerIndex(players, playerTurn);
    const disableDone = find(cards, {selected: true}) === undefined;
    return (
      <div className={theme.page} role="application">
        <GameOverModal open={room.isGameOver} winner={winner} onDone={onDone}/>
        <ActionList actions={actions} />
        <PlayerAvatars players={players} playerIndex={playerIndex} playerTurnIndex={playerTurnIndex} />
        <PlayerButtonBar disableDone={disableDone} onDraw={this.handleDraw} onDone={this.handleDone}/>
        <Deck ref="deck"
          action={''}
          {...game}
          playerIndex={playerIndex}
          totalPlayers={players.length}
          theme={theme}
          onCardClick={this.handleCardClick}
          onKeyDown={this.handleDeckKeyDown}
          onUpdate={this.handleDeckUpdate}
        />
      </div>
    );
  }
}
export default CardGame;
