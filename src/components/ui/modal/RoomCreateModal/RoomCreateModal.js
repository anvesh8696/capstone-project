import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './RoomCreateModal.scss';
import Dialog from 'react-toolbox/components/dialog';
import { Button } from 'react-toolbox/components/button';
import { Tab, Tabs } from 'react-toolbox/components/tabs';
import Input from 'react-toolbox/components/input';
import AvatarPicker from 'components/ui/button/AvatarPicker';
import Cup from '-!babel!svg-react!static/svg/cup.svg?name=Cup';
import { random } from 'lodash';

@themr('RoomCreateModal', defaultTheme)
class RoomCreateModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      router: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired,
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
    
    handleChange = (name, value) => {
      let error = this.state.codeError;
      
      // code only allows alpha-numeric
      if(name == 'code'){
        value = value.replace(/[^a-z0-9]/gi,'');
        if(value.length == 0){
          error = 'Invalid Code!';
        }else if(this.state.codeError != ''){
          error = '';
        }
      }
      this.setState({...this.state, [name]: value, codeError: error});
    }
    
    handleTabChange = (index) => {
      this.setState({index});
    };
    
    handleCreateRoom = () => {
      let roomID = random(0, 99999);
      
      this.props.router.push(`/room/${roomID}`);
    }
    
    handleJoinRoom = () => {
      let roomID = this.state.code;
      this.props.router.push(`/room/${roomID}`);
    }
    
    handleCodeInput = (e) => {
      //e.keyCode
    }
    
    handlePlayerChange = (field, value) => {
      this.setState({...this.state, [field]: value});
    };
    
    handleAvatarChange = (index, type, value) => {
      
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
          <Tabs index={this.state.index} theme={theme} onChange={this.handleTabChange}>
            <Tab label="Create Room" theme={theme} >
              <small>Choose opponents :</small>
              <div className={theme.avatars}>
                {this.renderPlayers(players)}
              </div>
              <div className={theme.buttons}>
                <Button label="Create!" raised primary onClick={this.handleCreateRoom}/>
              </div>
            </Tab>
            <Tab label="Join Room" theme={theme}>
              <small>Join a friend's game :</small>
              <div className={theme.tabBody}>
                <Input
                  type="text"
                  label="Room Code"
                  name="code"
                  icon="vpn_key"
                  value={this.state.code}
                  error={this.state.codeError}
                  onKeyPress={this.handleCodeInput}
                  onChange={this.handleChange.bind(this, 'code')}
                  maxLength={15}
                  className={theme.code}
                />
              </div>
              <div className={theme.buttons}>
                <Button label="Join!" raised primary
                  onClick={this.handleJoinRoom}
                  disabled={this.state.codeError != ''}
                />
              </div>
            </Tab>
          </Tabs>
        </Dialog>
      );
    }
}
export default RoomCreateModal;
