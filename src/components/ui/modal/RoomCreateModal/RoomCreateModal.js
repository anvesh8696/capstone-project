import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './RoomCreateModal.scss';
import Dialog from 'react-toolbox/components/dialog';
import { Button } from 'react-toolbox/components/button';
import { Tab, Tabs } from 'react-toolbox/components/tabs';
import Input from 'react-toolbox/components/input';
import FreeForAll from '-!babel!svg-react!static/svg/freeforall.svg?name=FreeForAll';
import Teams from '-!babel!svg-react!static/svg/teams.svg?name=Teams';
import { random } from 'lodash';
import utils from 'react-toolbox/components/utils/utils';
import classNames from 'classnames';

@themr('RoomCreateModal', defaultTheme)
class RoomCreateModal extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      open: PropTypes.bool.isRequired,
      router: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }
    
    state = {
      code: '',
      codeError: '',
      index: 0,
      modeIndex: 0
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
    
    handleModeClick = (index) => {
      this.setState({...this.state, modeIndex: index});
    }
    
    renderM = (ModeSVG, mode, index, selectedIndex, ariakey) => {
      const { theme } = this.props;
      const aria = {
        'role': 'radio',
        'tabIndex': index === selectedIndex ? 0 : -1,
        'aria-describedby': `${ariakey}_desc_${index}`
      };
      const modeClasses = classNames(
        theme.mode,
        index === selectedIndex ? theme.modeSelected : ''
      );
      return (
        <div className={modeClasses} {...aria} onClick={() => this.handleModeClick(index)}>
          <ModeSVG className={theme.notouch} width={200} height={200} role="presentation" aria-hidden="true"/>
          <div id={aria['aria-describedby']}>{mode}</div>
        </div>
      );
    }
    
    renderModes = (ariakey) => {
      const { theme } = this.props;
      const { modeIndex } = this.state;
      const aria = {
        'role': 'radiogroup',
        'aria-labelledby': ariakey
      };
      return (
        <div className={theme.modeContainer} {...aria}>
          {this.renderM(Teams, 'Teams', 0, modeIndex, ariakey)}
          {this.renderM(FreeForAll, 'Free For All', 1, modeIndex, ariakey)}
        </div>
      );
    }
  
    render() {
      const { theme, open } = this.props;
      const ariakey = `mode_${utils.ruuid()}`;
      return (
        <Dialog active={open} theme={theme}>
          <Tabs index={this.state.index} theme={theme} onChange={this.handleTabChange}>
            <Tab label="Create Room" theme={theme} >
              <small id={ariakey}>How to play :</small>
              {this.renderModes(ariakey)}
              <footer className={theme.buttons}>
                <Button label="Create!" raised primary onClick={this.handleCreateRoom}/>
              </footer>
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
              <footer className={theme.buttons}>
                <Button label="Join!" raised primary
                  onClick={this.handleJoinRoom}
                  disabled={this.state.codeError != ''}
                />
              </footer>
            </Tab>
          </Tabs>
        </Dialog>
      );
    }
}
export default RoomCreateModal;
