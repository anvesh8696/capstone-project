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
    players: PropTypes.array.isRequired,
    playerIndex: PropTypes.number.isRequired
  }
  
  renderAvatar(name, index, totalPlayers) {
    const { theme } = this.props;
    const player = classNames(theme[`p${(index%totalPlayers)}`]);
    return (
      <div className={player} key={`avatar_${index}`}>
        <Chip theme={theme}>
          <Avatar style={{backgroundColor: 'deepskyblue'}} title={name} />
          <span>{name}</span>
        </Chip>
      </div>
    );
  }
  
  render() {
    const { theme, players, playerIndex } = this.props;
    const totalPlayers = players.length;
    return (
      <div className={theme.container}>
        { players.map((p, i) => this.renderAvatar(p.name, i + (totalPlayers-playerIndex), totalPlayers)) }
      </div>
    );
  }
}
