import { connect } from 'react-redux';
import EditorSideBar from './EditorSideBar';
import {dealCards, shuffleCards, sortCards, fanCards, flipCards, randomCards, handSelectRandomCards} from './EditorModule';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dealCards: () => dispatch(dealCards()),
    shuffleCards: () => dispatch(shuffleCards()),
    sortCards: () =>dispatch(sortCards()),
    fanCards: () => dispatch(fanCards()),
    flipCards: () => dispatch(flipCards()),
    randomCards: () => dispatch(randomCards()),
    handSelectRandomCards: () => dispatch(handSelectRandomCards())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorSideBar);
