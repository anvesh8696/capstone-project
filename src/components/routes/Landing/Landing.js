import React, { Component, PropTypes } from 'react';
import { Panel} from 'react-toolbox';
import { themr } from 'react-css-themr';
import defaultTheme from './Landing.scss';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';
import { Button } from 'react-toolbox/lib/button';
import { Tab, Tabs } from 'react-toolbox';
import { random } from 'lodash';
import AvatarPicker from 'components/ui/button/AvatarPicker';

@themr('Landing', defaultTheme)
class Landing extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
      }).isRequired
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
  
    render() {
      const { theme } = this.props;
      return (
        <Panel>
          <div className={theme.page}>
            <Dialog active={Boolean(true)}>
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                <Tab label="Create Room">
                  <small>Choose avatar and which opponents are bots</small>
                  <div className={theme.avatars}>
                    <AvatarPicker botToggle={false}/>
                    <AvatarPicker />
                    <AvatarPicker />
                    <AvatarPicker />
                  </div>
                  <div className={theme.buttons}>
                    <Button label="Create!" raised primary onClick={this.handleCreateRoom}/>
                  </div>
                </Tab>
                <Tab label="Join Room">
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
                  <div className={theme.buttons}>
                    <Button label="Join!" raised primary
                      onClick={this.handleJoinRoom}
                      disabled={this.state.codeError != ''}
                    />
                  </div>
                </Tab>
              </Tabs>
            </Dialog>
          </div>
        </Panel>
      );
    }
}
export default Landing;
