import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './RoomLobbyModal.scss';
import { Button } from 'react-toolbox/components/button';
import Avatar from 'components/ui/button/AvatarPicker/Avatar';
import { find } from 'lodash';

@themr('RoomLobbyModal', defaultTheme)
class RoomLobbyModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      players: PropTypes.array.isRequired,
      kickPlayer: PropTypes.func.isRequired,
      addBot: PropTypes.func.isRequired,
      setupRound: PropTypes.func.isRequired
    }
    
    renderPlayers = (players) => {
      return players.map((value, index) => this.renderAvatar(index, value.avatar, value.name, value.bot === true));
    }
    
    renderAvatar(index, avatar, name, bot = true){
      const { theme, kickPlayer } = this.props;
      if(bot){
        return (
          <div className={theme.avatarContainer} key={`avatar_${index}`}>
            <Avatar index={avatar} />
            <Button icon="close" floating accent mini aria-label={`Remove ${name}`}
              className={theme.remove} onClick={()=>kickPlayer(index, true)}/>
            <div>{`Ai: ${name}`}</div>
          </div>
        );
      }
      return (
        <div className={theme.avatarContainer} key={`avatar_${index}`}>
          <Avatar index={avatar}/>
          <div>{name}</div>
        </div>
      );
    }
  
    render() {
      const { theme, addBot, setupRound, players } = this.props;
      const ready = find(players, {name: 'Empty Slot'}) != undefined;
      return (
        <div className={theme.page}>
          <div className={theme.dialog}>
            <small>Play with bots or invite friends :</small>
            <div className={theme.avatars}>
              {this.renderPlayers(players)}
            </div>
            <div className={theme.buttons}>
              <Button label="Add Bot" raised primary disabled={!ready} onClick={addBot}/>
              <Button label="Start!" raised primary disabled={ready} onClick={setupRound}/>
            </div>
          </div>
        </div>
      );
    }
}
export default RoomLobbyModal;
