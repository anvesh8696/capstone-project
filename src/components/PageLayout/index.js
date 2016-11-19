import React, { Component, PropTypes } from 'react';
import { Layout, NavDrawer, Navigation } from 'react-toolbox';
import { themr } from 'react-css-themr';
import Empty from './Empty';
import theme from './theme.scss';

export default function (Wrapped, Sidebar){
  
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
          { href:'#/', label: 'Home', icon: 'room', active:(pathname == '/')},
          { href:'#/editor', label: 'Editor', icon: 'room', active:(pathname == '/editor')}
        ];
        return (
          <Layout theme={theme}>
            <NavDrawer active={this.state.drawerActive}
              pinned={this.state.drawerPinned}
              permanentAt="md"
              onOverlayClick={ this.toggleDrawerActive }>
              <Navigation type="vertical" routes={routes} className={theme.nav} />
            </NavDrawer>
            <Wrapped
              toggleDrawerActive={this.toggleDrawerActive}
            />
            { Sidebar ? <Sidebar /> : <Empty /> }
          </Layout>
        );
      }
  }
  return PageLayout;
}
