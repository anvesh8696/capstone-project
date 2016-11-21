import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import PageLayout from 'components/PageLayout';
import Landing from 'components/routes/Landing';
import Editor from 'components/routes/Editor';
import EditorSideBar from 'components/routes/Editor/EditorSideBarContainer';

export default class Routes extends Component {
  
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  
  state = {
    ready: false
  }
  
  renderLoading(){
    return (
      <div>LOADING</div>
    );
  }
  
  renderRoutes(){
    return (
      <Router history={ this.props.history }>
        <Route path="/" component={ PageLayout(Landing, null) } />
        <Route path="/editor" component={ PageLayout(Editor, EditorSideBar) } />
      </Router>
    );
  }
  
  componentDidMount(){
    this.setState({...this.state, ready: true});
  }
  
  render() {
    let content = this.state.ready ? this.renderRoutes() : this.renderLoading();
    return (
      <Provider store={this.props.store}>
        {content}
      </Provider>
    );
  }
}
