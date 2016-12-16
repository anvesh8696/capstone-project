import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './HelpModal.scss';
import Dialog from 'react-toolbox/components/dialog';
import { Button } from 'react-toolbox/components/button';
import ReactDOM from 'react-dom';

@themr('HelpModal', defaultTheme)
class HelpModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      onDone: PropTypes.func.isRequired
    }
    
    /**
     * Set focus on Modal open
     *
     */
    componentDidUpdate(prevProps, prevState){
      if(this.props.open != prevProps.open && this.props.open){
        setTimeout(() => {
          ReactDOM.findDOMNode(this.refs.helpModal).focus();
        }, 250);
      }
    }
  
    render() {
      const { theme, open, onDone } = this.props;
      return (
        <Dialog active={open} theme={theme}>
          <div className={theme.dialogContent}>
            <ul role="list">
              <li role="listitem" tabIndex="0" ref="helpModal">
                <h4>Basic Rules</h4>
                <p>
                At the start of the game, each player is given 7 cards.
                The remaining cards are put face down in the draw pile.
                One card is taken from the draw pile and is placed face up in the center discard pile.
                The starting player is chosen at random.
                They must match the last discard pile card, or take one from the draw pile.
                A player's turn is over after they draw, or match the discard pile card.
                The next player is chosen clockwise.
                </p>
              </li>
              <li role="listitem" tabIndex="0">
                <h4>Card Matching</h4>
                <p>A card is considered matching if the suit, or face value match the last card in the discard pile.</p>
              </li>
              <li role="listitem" tabIndex="0">
                <h4>How to win?</h4>
                <p>The game is over when one of the players has no cards left.</p>
              </li>
              <li role="listitem" tabIndex="0">
                <h4>Teams</h4>
                <p>
                When playing a Teams game, teammates sit across the table from one another and can see eachothers cards.
                A team wins when any of it's players has no cards left.
                </p>
              </li>
            </ul>
          </div>
          <footer className={theme.buttons}>
            <Button label="Done" raised primary onClick={onDone}/>
          </footer>
        </Dialog>
      );
    }
}
export default HelpModal;
