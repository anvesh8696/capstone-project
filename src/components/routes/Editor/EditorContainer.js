import { connect } from 'react-redux';
import Editor from './Editor';
import { playerAction } from './EditorModule';

const mapStateToProps = (state) => {
  return {
    deckAction: state.editor.deckAction
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buttonAction: (action) => dispatch(playerAction(action)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
