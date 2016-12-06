import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './RoomLobbyModal.scss';
import Dialog from 'react-toolbox/lib/dialog';
import { Button } from 'react-toolbox/lib/button';
import AvatarPicker from 'components/ui/button/AvatarPicker';
import { random } from 'lodash';

@themr('RoomLobbyModal', defaultTheme)
class RoomLobbyModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      players: PropTypes.array.isRequired
    }
    
    state = {
      code: '',
      codeError: '',
      index: 0,
      player0: false,
      player1: true,
      player2: true,
      player3: true,
    }
    
    handlePlayerChange = (field, value) => {
      this.setState({...this.state, [field]: value});
    };
    
    handleAvatarChange = (index, type, value) => {
      
    }
    
    handleStart = () => {
      
    }
    
    renderPlayers = (players) => {
      return players.map((value, index) => this.renderAvatar(index, value.avatar, index > 0));
    }
    
    renderAvatar(index, avatar, botToggle = true){
      return (
        <AvatarPicker
          key={`avatar_${index}`}
          onChange={(type, value) => this.handleAvatarChange(index, type, value)}
          value={avatar}
          botToggle={botToggle}
          picker={botToggle}
        />
      );
    }
  
    render() {
      const { theme, open, players } = this.props;
      return (
        <Dialog active={open} theme={theme}>
          <small>Waiting for players :</small>
          <div className={theme.avatars}>
            {this.renderPlayers(players)}
          </div>
          <div className={theme.buttons}>
            <Button label="Start!" raised primary onClick={this.handleStart}/>
          </div>
        </Dialog>
      );
    }
}
export default RoomLobbyModal;
