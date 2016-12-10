import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './AvatarPicker.scss';
import {IconButton} from 'react-toolbox/components/button';
import Switch from 'react-toolbox/components/switch';
import Avatar0 from '-!babel!svg-react!static/svg/avatar0.svg';
import Avatar1 from '-!babel!svg-react!static/svg/avatar1.svg';
import Avatar2 from '-!babel!svg-react!static/svg/avatar2.svg';
import Avatar3 from '-!babel!svg-react!static/svg/avatar3.svg';
import Avatar4 from '-!babel!svg-react!static/svg/avatar4.svg';
import Avatar5 from '-!babel!svg-react!static/svg/avatar5.svg';
import Avatar6 from '-!babel!svg-react!static/svg/avatar6.svg';
import AvatarBot from '-!babel!svg-react!static/svg/noavatar.svg';
import classNames from 'classnames';

const Avatarlist = [
  {desc:'Male Black Shirt', svg: Avatar0},
  {desc:'Girl White Shirt', svg: Avatar1},
  {desc:'Male Orange Shirt', svg: Avatar2},
  {desc:'Girl Purple Shirt', svg: Avatar3},
  {desc:'Male Blue Shirt', svg: Avatar4},
  {desc:'Girl Blue Shirt', svg: Avatar5},
  {desc:'Male Santa', svg: Avatar6}
];

@themr('AvatarPicker', defaultTheme)
class AvatarPicker extends Component {
  
    static propTypes = {
      theme: PropTypes.object.isRequired,
      picker: PropTypes.bool.isRequired,
      botToggle: PropTypes.bool.isRequired,
      isBot: PropTypes.bool.isRequired,
      value: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired,
      ariakey: PropTypes.string.isRequired
    }
    
    static defaultProps = {
      picker: true,
      botToggle: true,
      isBot: false,
      value: 0
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
      this.props.onChange('isBot', !value);
    }
    
    /**
     * Let parent know the avatar changed
     */
    handleAvatarClick = () => {
      if(!this.props.isBot || !this.props.botToggle){
        let next = (this.props.value + 1) % (Avatarlist.length);
        this.props.onChange('value', next);
        
        // focus after short delay for DOM update
        setTimeout(() => {
          this.refs.avatar.focus();
        }, 300);
      }
    }
    
    renderA = (avatar, index, length, selectedIndex, ariakey) => {
      const AvatarSvg = avatar.svg;
      const { theme } = this.props;
      const aria = {
        'role': 'radio',
        'tabIndex': index === selectedIndex ? 0 : -1,
        'aria-describedby': `${ariakey}_desc_${index}`,
        'key': `${ariakey}_a_${index}`,
        'aria-checked': (index === selectedIndex).toString()
      };
      // hide overlapping radio buttons
      if(index != selectedIndex){
        return (
          <div {...aria} className={theme.hidden}></div>
        );
      }
      return (
        <div ref="avatar" {...aria} className={theme.avatar}>
          <AvatarSvg width={100} height={100} role="presentation" aria-hidden="true"/>
          <span className={theme.avatarDesc} id={aria['aria-describedby']}>{avatar.desc}</span>
        </div>
      );
    }
  
    render() {
      const { theme, botToggle, isBot, value, picker, ariakey } = this.props;
      const aria = {
        'role': 'radiogroup',
        'aria-labelledby': ariakey
      };
      return (
        <div className={theme.avatarFlex} {...aria}>
          <div className={theme.avatarContainer} onClick={this.handleAvatarClick}>
            {Avatarlist.map((a, i) => this.renderA(a, i, Avatarlist.length, value, ariakey))}
          </div>
          {this.renderBotToggle(botToggle)}
        </div>
      );
    }
}
export default AvatarPicker;
