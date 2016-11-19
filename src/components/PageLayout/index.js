import React, { Component, PropTypes } from 'react';
import { Layout, NavDrawer, Navigation } from 'react-toolbox';
import { themr } from 'react-css-themr';
import theme from './theme.scss';
import navTheme from './Nav.scss';

export default function (Wrapped){
  
  @themr('PageLayout', theme)
  class PageLayout extends Component {
    
      static propTypes = {
        location: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
      }
    
      state = {
        drawerActive: false,
        drawerPinned: false
      };
  
      toggleDrawerActive = () => {
        this.setState({...this.state, drawerActive: !this.state.drawerActive });
      };
  
      toggleDrawerPinned = () => {
        this.setState({...this.state, drawerPinned: !this.state.drawerPinned });
      }
  
      render() {
        const { pathname } = this.props.location;
        const { theme } = this.props;
        const routes = [
          { href:'#/', label: 'Home', icon: 'room', active:(pathname == '/')}
        ];
        return (
          <Layout theme = {theme}>
            <NavDrawer active = {this.state.drawerActive}
              pinned = {this.state.drawerPinned}
              permanentAt = "md"
              onOverlayClick = { this.toggleDrawerActive }>
              <Navigation type = "vertical" routes = {routes} className = {theme.nav} />
            </NavDrawer>
            <Wrapped
              toggleDrawerActive = {this.toggleDrawerActive}
            />
          </Layout>
        );
      }
  }
  return PageLayout;
}
