import { connect } from 'react-redux';
import Room from './Room';
import { playerAction } from './RoomModule';
import { setupRound, updateGame, mergeGame, playerTurnEnd } from 'components/game/Flow/FlowModule';

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
    setupRound: (node) => dispatch(setupRound(node)),
    updateGame: (key, value, sendRemote) => dispatch(updateGame(key, value, sendRemote)),
    mergeGame: (value, sendRemote) => dispatch(mergeGame(value, sendRemote)),
    playerTurnEnd: (playerID) => dispatch(playerTurnEnd(playerID))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
