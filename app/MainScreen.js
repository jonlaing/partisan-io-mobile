'use strict';

import React, {
  Component,
  View
} from 'react-native';

import SideMenuNav from 'react-native-side-menu';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';
import Layout from './Layout';

import NavBarMain from './NavBarMain';
import SideMenu from './SideMenu';

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this._menuOpen = false;

    this.state = { currentTab: 'feed', search: '', showEditor: '' };
  }

  componentDidMount() {
    if(this.props.openSideMenu) {
      this._handleHamburger();
    }
  }

  _handleHamburger() {
    this._menuOpen = !this._menuOpen;
    this.refs.sidemenu.openMenu(true);
  }

  _handleNotifPress() {
    this.props.navigator.push(Router.notifications(this.props.token));
  }

  _handleMessagePress() {
    this.props.navigator.push(Router.messageList(this.props.token));
  }

  _handleTabPress(tab) {
    if(this.state.currentTab === tab) {
      return;
    }

    switch(tab) {
            case 'feed':
                    this.refs.nav.replace(Router.feed(this.props.token));
                    break;
            case 'matches':
                    this.refs.nav.replace(Router.matches(this.props.token));
                    break;
            case 'events':
                    this.refs.nav.replace(Router.events(this.props.token));
                    break;
            default:
                    console.log("unknown tab");
                    break;
    }
    this.setState({currentTab: tab});
  }

  _handleBadge(notifCount, msgCount) {
    this.props.navigator.props.eventEmitter.emit('badge-change', notifCount + msgCount);
  }

  _handleSearch(search) {
    this.refs.nav.replace(Router.feed(this.props.token, search));
    this.setState({currentTab: 'feed'});
  }

  render() {
    return (
      <SideMenuNav ref="sidemenu" disableGestures={true} menu={
        <SideMenu
          navigator={this.props.navigator}
          token={this.props.token}
          onUserPress={() => this.props.navigator.push(Router.profileEdit(this.props.token, this.props.navigator.props.user))}
        />
      }>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ExNavigator
            initialRoute={Router.feed(this.props.token)}
            style={{flex: 1, paddingTop: Layout.lines(7)}}
            showNavigationBar={false}
            parentNavigator={this.props.navigator}
            eventEmitter={this.props.navigator.props.eventEmitter}
            ref="nav"
          />
          <NavBarMain
            token={this.props.token}
            onLogoPress={this._handleHamburger.bind(this)}
            onNotificationPress={this._handleNotifPress.bind(this)}
            onMessagePress={this._handleMessagePress.bind(this)}
            onTabPress={this._handleTabPress.bind(this)}
            onBadge={this._handleBadge.bind(this)}
            currentTab={this.state.currentTab}
            onSearch={this._handleSearch.bind(this)}
          />
        </View>
      </SideMenuNav>
    );
  }
}

MainScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  openSideMenu: React.PropTypes.bool
};

MainScreen.defaultProps = {
  openSideMenu: false
};

module.exports = MainScreen;
