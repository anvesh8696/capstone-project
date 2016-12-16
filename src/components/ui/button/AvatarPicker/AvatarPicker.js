import React, { Component, PropTypes } from 'react';
import { themr } from 'react-css-themr';
import defaultTheme from './AvatarPicker.scss';
import Avatar, { Avatarlist } from './Avatar';

@themr('AvatarPicker', defaultTheme)
class AvatarPicker extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    ariakey: PropTypes.string.isRequired
  }
  
  static defaultProps = {
    value: 0
  }
  
  handleAvatarClick = () => {
    const { value } = this.props;
    this.changeAvatar(value + 1, Avatarlist.length);
  }
  
  handleKeyDown = (event) => {
    const c = event.keyCode;
    const dir = c === 37 || c === 38 ? -1 : c === 39 || c === 40 ? 1 : 0;
    const { value } = this.props;
    
    // arrow keys select next or prev avatar
    if(dir != 0){
      this.changeAvatar(value + dir, Avatarlist.length);
    }
  }
  
  /**
   * Let parent know the avatar changed
   */
  changeAvatar(idx, max){
    let next = (idx % max + max) % max;
    this.props.onChange('value', next);
    
    // focus after short delay for DOM update
    setTimeout(() => {
      this.refs.avatar.focus();
    }, 300);
  }
  
  renderA = (avatar, index, length, selectedIndex, ariakey) => {
    const { theme } = this.props;
    const aria = {
      'role': 'radio',
      'tabIndex': index === selectedIndex ? 0 : -1,
      'key': `${ariakey}_a_${index}`,
      'aria-checked': (index === selectedIndex).toString(),
      'aria-label': avatar.desc
    };
    // hide overlapping radio buttons
    if(index != selectedIndex){
      return (
        <div {...aria} className={theme.hidden}></div>
      );
    }
    return (
      <div ref="avatar" {...aria} className={theme.avatar}>
        <Avatar index={index} width={100} height={100} />
      </div>
    );
  }

  render() {
    const { theme, value, ariakey } = this.props;
    const aria = {
      'role': 'radiogroup',
      'aria-labelledby': ariakey
    };
    return (
      <div className={theme.avatarFlex} {...aria}>
        <div className={theme.avatarContainer} onClick={this.handleAvatarClick} onKeyDown={this.handleKeyDown}>
          {Avatarlist.map((a, i) => this.renderA(a, i, Avatarlist.length, value, ariakey))}
        </div>
      </div>
    );
  }
}
export default AvatarPicker;
