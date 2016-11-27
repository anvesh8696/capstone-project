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
    mergeGame: PropTypes.func.isRequired
    //playerDone
    //playerDrawCard
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
    
  }
  
  handleDone = () => {
    /*
    let playerPile = this.getPlayerPile(player);
      let discardPile = this.getDiscardPile();
      let c = playerPile.getSelectedCards();
      
      if(c && c.length > 0){
        merge(c, {flipped: false, selected: false, angleOffset: random(0, 45)});
        discardPile.addCards(c, true);
        playerPile.updatePosition(this.refs.node);
        // Prevent button spam
        this.state.playerTurn = -1;
      }
    */
    const { id } = this.props.me;
    if(this.isPlayerTurn(id)){
      let pile = this.getPlayerIndex(id);
      let cards = this.selectedCards(pile);
      let discard = this.getDiscardPile();
      each(cards, (c) => {
        /*
        this.updateCard({
          ...c, 
          pile: discard, 
          flipped: false, 
          selected: false, 
          angleOffset: random(0, 45)
        });
        */
        //organize(i, card, pile, cards)
        /*
        this.updateCard(c.merge({
          pile: discard,
          flipped: false,
          selected: false, 
          angleOffset: random(0, 45)
        }));
        */
        c = c.merge({
          pile: discard,
          flipped: false,
          selected: false, 
          angleOffset: random(0, 45)
        });
        this.updateCard(c);
      });
    }
        
    window.dispatchEvent(new Event('resize'));
      
      // Prevent button spam
      // this.state.playerTurn = -1;
  }
  
  
  selectedCards = (pile) => {
    let selected = [];
    each(this.props.game.cards, (c) => {
      if(c.selected && c.pile == pile){
        selected.push(c);
      }
    });
    return selected;
  }
  
  isPlayerTurn = (player) => this.props.room.playerTurn === player

  getPlayerIndex = (playerID) => {
    const { players } = this.props.room;
    return players.indexOf(playerID);
  }
  
  getDiscardPile = () => {
    return 5;
    return this.props.game.pileDefs.length - 1;
  }
  
  updateCard = (card) => {
    const { cards } = this.props.game;
    let indexToUpdate = findIndex(cards, (o) => o.key == card.key);
    this.props.updateGame(['cards', indexToUpdate], card);
  }

  render() {
    const { theme, game, buttonAction } = this.props;
    return (
      <div className={theme.page}>
        <PlayerAvatars players={[{name:'Jack'},{name:'Fill'},{name:'Ashley'},{name:'Brian'}]}/>
        <PlayerButtonBar onDraw={this.handleDraw} onDone={this.handleDone}/>
        <Deck ref="deck" action={''} {...game} theme={theme} onCardClick={this.handleCardClick} onUpdate={this.handleDeckUpdate}/>
      </div>
    );
  }
}
export default CardGame;
