import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import PageLayout from 'components/PageLayout';
import Landing from 'components/routes/Landing';
import { Provider } from 'react-redux';

export default class Routes extends Component {
  
  static propTypes = {
    store: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired
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
      <Router history = { this.props.history }>
        <Route path = "/" component = { PageLayout(Landing) } />
      </Router>
    );
  }
  
  componentDidMount(){
    this.setState({...this.state, ready: true});
  }
  
  render() {
    let content = this.state.ready ? this.renderRoutes() : this.renderLoading();
    return (
      <Provider store = {this.props.store}>
        {content}
      </Provider>
    );
  }
}
