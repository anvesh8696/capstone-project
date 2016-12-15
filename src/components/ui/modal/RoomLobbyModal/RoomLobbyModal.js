import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './RoomLobbyModal.scss';
import { Button } from 'react-toolbox/components/button';
import Avatar from 'components/ui/button/AvatarPicker/Avatar';
import { find } from 'lodash';
import ReactDOM from 'react-dom';

@themr('RoomLobbyModal', defaultTheme)
class RoomLobbyModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      players: PropTypes.array.isRequired,
      kickPlayer: PropTypes.func.isRequired,
      addBot: PropTypes.func.isRequired,
      setupRound: PropTypes.func.isRequired
    }
    
    /**
     * Set focus on createTab when Modal opens
     *
     */
    componentDidMount(){
      setTimeout(() => {
        ReactDOM.findDOMNode(this.refs.focus).focus();
      }, 250);
    }
    
    renderPlayers = (players) => {
      return players.map((value, index) => this.renderAvatar(index, value.avatar, value.name, value.bot === true));
    }
    
    renderAvatar(index, avatar, name, bot = true){
      const { theme, kickPlayer } = this.props;
      if(bot){
        return (
          <div className={theme.avatarContainer} key={`avatar_${index}`} aria-label={`${name}'s Avatar`}>
            <Avatar index={avatar} />
            <Button icon="close" floating accent mini aria-label={`Remove ${name}`}
              className={theme.remove} onClick={()=>kickPlayer(index, true)}/>
            <div aria-hidden="true">{`Ai: ${name}`}</div>
          </div>
        );
      }
      const label = name === 'Empty Slot' ? name : 'Your Avatar';
      return (
        <div className={theme.avatarContainer} key={`avatar_${index}`} aria-label={label}>
          <Avatar index={avatar}/>
          <div aria-hidden="true">{name}</div>
        </div>
      );
    }
  
    render() {
      const { theme, addBot, setupRound, players } = this.props;
      const ready = find(players, {name: 'Empty Slot'}) != undefined;
      return (
        <div className={theme.page} role="application">
          <div className={theme.dialog} role="dialog" aria-labelledby="roomLobbyDialogTitle">
            <small id="roomLobbyDialogTitle" ref="focus">Play with bots or invite friends :</small>
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
