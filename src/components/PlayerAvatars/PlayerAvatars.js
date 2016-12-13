import React, { Component, PropTypes } from 'react'; 
import { themr } from 'react-css-themr';
import theme from './PlayerAvatars.scss';
import Avatar from 'react-toolbox/components/avatar';
import Chip from 'react-toolbox/components/chip';
import classNames from 'classnames';
import utils from 'react-toolbox/components/utils/utils';

@themr('PlayerAvatars', theme)
export default class PlayerAvatars extends Component {
  
  static propTypes = {
    theme: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    playerIndex: PropTypes.number.isRequired,
    playerTurnIndex: PropTypes.number.isRequired
  }
  
  renderAvatar(name, index, totalPlayers, ariakey) {
    const { theme, playerTurnIndex } = this.props;
    const player = classNames(
      theme[`p${(index%totalPlayers)}`],
      playerTurnIndex == (index%totalPlayers) ? theme.selected : ''
    );
    const aria = {
      'tabIndex':'-1',
      'role':'radio'
    };
    return (
      <div className={player} key={`avatar_${index}`} {...aria}>
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
    const ariakey = `avatars_${utils.ruuid()}`;
    const aria = {
      'role': 'radiogroup',
      'aria-labelledby': ariakey
    };
    return (
      <div className={theme.container} {...aria}>
        { players.map((p, i) => this.renderAvatar(p.name, i + (totalPlayers-playerIndex), totalPlayers), ariakey) }
      </div>
    );
  }
}
