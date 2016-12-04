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
      picker: PropTypes.bool.isRequired,
      botToggle: PropTypes.bool.isRequired,
      isBot: PropTypes.bool.isRequired,
      value: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired
    }
    
    static defaultProps = {
      picker: true,
      botToggle: true,
      isBot: false,
      value: 0
    }
    
    renderAvatar(theme, avatarIndex, picker, botToggle, isBot){
      let AvatarSvg = !isBot || !botToggle ? Avatarlist[avatarIndex] : AvatarBot;
      if(picker){
        return (
          <IconButton primary theme={theme} onClick={this.handleAvatarClick}>
            <AvatarSvg width={100} height={100}/>
          </IconButton>
        );
      }
      return <AvatarSvg width={100} height={100}/>;
    }
    
    renderBotToggle(shouldRender, isBot){
      if(shouldRender){
        return (
          <Switch
            checked={isBot}
            label="Bot"
            onChange={this.handleBotChange}
          />
        );
      }
    }
    
    handleBotChange = () => {
      let value = this.props.isBot;
      //this.setState({...this.state, isBot: !value});
      this.props.onChange('isBot', !value);
    }
    
    handleAvatarClick = () => {
      if(!this.props.isBot || !this.props.botToggle){
        let value = (this.props.value + 1) % (Avatarlist.length);
        this.props.onChange('value', value);
        //this.setState({...this.state, value: value});
      }
    }
  
    render() {
      const { theme, botToggle, isBot, value, picker } = this.props;
      return (
        <div className={theme.avatar}>
          {this.renderAvatar(theme, value, picker, botToggle, isBot)}
          {this.renderBotToggle(botToggle)}
        </div>
      );
    }
}
export default AvatarPicker;
