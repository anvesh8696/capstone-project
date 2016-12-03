import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './AvatarPicker.scss';
import {IconButton} from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import Avatar0 from '-!babel!svg-react!static/svg/avatar0.svg';
import Avatar1 from '-!babel!svg-react!static/svg/avatar1.svg';
import Avatar2 from '-!babel!svg-react!static/svg/avatar2.svg';
import Avatar3 from '-!babel!svg-react!static/svg/avatar3.svg';
import Avatar4 from '-!babel!svg-react!static/svg/avatar4.svg';
import Avatar5 from '-!babel!svg-react!static/svg/avatar5.svg';
import Avatar6 from '-!babel!svg-react!static/svg/avatar6.svg';
import AvatarBot from '-!babel!svg-react!static/svg/noavatar.svg';

const Avatarlist = [Avatar0, Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6];

@themr('AvatarPicker', defaultTheme)
class AvatarPicker extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      botToggle: PropTypes.bool.isRequired
    }
    
    static defaultProps = {
      botToggle: true
    }
    
    state = {
      avatar: 0,
      isBot: false
    }
    
    renderAvatar(avatarIndex, botToggle, isBot){
      let AvatarSvg = !isBot || !botToggle ? Avatarlist[avatarIndex] : AvatarBot;
      return <AvatarSvg width={100} height={100}/>;
    }
    
    renderBotToggle(shouldRender){
      if(shouldRender){
        return (
          <Switch
            checked={this.state.isBot}
            label="Bot"
            onChange={this.handleBotChange}
          />
        );
      }
    }
    
    handleBotChange = () => {
      let value = this.state.isBot;
      this.setState({...this.state, isBot: !value});
    }
    
    handleAvatarClick = () => {
      if(!this.state.isBot){
        let value = (this.state.avatar + 1) % (Avatarlist.length);
        this.setState({...this.state, avatar: value});
      }
    }
  
    render() {
      const { theme, botToggle } = this.props;
      return (
        <div className={theme.avatar}>
          <IconButton primary theme={theme} onClick={this.handleAvatarClick}>
            {this.renderAvatar(this.state.avatar, botToggle, this.state.isBot)}
          </IconButton>
          {this.renderBotToggle(botToggle)}
        </div>
      );
    }
}
export default AvatarPicker;