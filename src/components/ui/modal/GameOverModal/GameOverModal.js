import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './GameOverModal.scss';
import Dialog from 'react-toolbox/components/dialog';
import {Button} from 'react-toolbox/components/button';
import Cup from '-!babel!svg-react!static/svg/cup.svg?name=Cup';

@themr('GameOverModal', defaultTheme)
class GameOverModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      onDone: PropTypes.func.isRequired,
      winner: PropTypes.string.isRequired
    }
  
    render() {
      const { theme, open, onDone, winner } = this.props;
      return (
        <Dialog active={open}>
          <div className={theme.dialogContent}>
            <h3>{winner} Wins!</h3>
            <Cup width={200} height={200}/>
          </div>
          <div className={theme.buttons}>
            <Button label="Done" raised primary onClick={onDone}/>
          </div>
        </Dialog>
      );
    }
}
export default GameOverModal;
