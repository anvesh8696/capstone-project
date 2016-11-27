import React, { Component, PropTypes } from 'react'; 
import { themr } from 'react-css-themr';
import theme from './PlayerAvatars.scss';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import classNames from 'classnames';

@themr('PlayerAvatars', theme)
export default class PlayerAvatars extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired
  }
  
  renderAvatar(name, index) {
    const { theme } = this.props;
    const player = classNames(theme[`p${index}`]);
    return (
      <div className={player}>
        <Chip theme={theme}>
          <Avatar style={{backgroundColor: 'deepskyblue'}} title={name} />
          <span>{name}</span>
        </Chip>
      </div>
    );
  }
  
  render() {
    const { theme, players } = this.props;
    return (
      <div className={theme.container}>
        { players.map((p, i) => this.renderAvatar(p.name, i)) }
      </div>
    );
  }
}
