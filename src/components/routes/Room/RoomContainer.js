import { connect } from 'react-redux';
import Room from './Room';
import { playerAction } from './RoomModule';
import { setupRoom, setupRound, updateGame, mergeGame, playerTurnEnd, kickPlayer, addBot } from 'components/game/Flow/FlowModule';

const mapStateToProps = (state) => {
  return {
    game: state.flow.game,
    room: state.flow.room,
    me: state.flow.me
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buttonAction: (action) => dispatch(playerAction(action)),
    setupRoom: (roomID) => dispatch(setupRoom(roomID)),
    updateGame: (key, value, sendRemote) => dispatch(updateGame(key, value, sendRemote)),
    mergeGame: (value, sendRemote) => dispatch(mergeGame(value, sendRemote)),
    playerTurnEnd: (playerID) => dispatch(playerTurnEnd(playerID)),
    kickPlayer: (index, bot) => dispatch(kickPlayer({index, bot})),
    addBot: () => dispatch(addBot()),
    setupRound: () => dispatch(setupRound())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
