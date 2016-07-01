'use strict';

import React, {
  Component,
  AppState,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  View,
  Image,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';

import Layout from './Layout';
import Colors from './Colors';

export default class NavBarMain extends Component {
  constructor(props) {
    super(props);

    this.notifCounter = null;
    this.msgCounter = null;
    this.state = { notificationCount: 0, messageCount: 0, hasMessages: false };
  }

  componentDidMount() {
    this._getNotifs();
    this._getMsgs();
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));

    try {
      this.notifCounter.close();
      this.msgCounter.close();
      this.notifCounter = null;
      this.msgCounter = null;
    } catch(e) {
      console.log(e);
    }
  }

  _handleAppStateChange(appState) {
    if(appState === "active") {
      if(this.notifCounter == null) {
        this._getNotifs();
      }

      if(this.msgCounter == null) {
        this._getMsgs();
      }
    }
  }

  _getNotifs() {
    this.notifCounter = Api.notifications(this.props.token).countSocket(
      function(socket) {
        this.notifCounter = socket;
      }.bind(this),
      function(res) {
        let data = JSON.parse(res.data);

        this.setState({ notificationCount: data.count });
        this.props.onBadge(data.count, this.state.messageCount);
      }.bind(this),
      err => console.log(err)
    );
  }

  _getMsgs() {
    this.msgCounter = Api.messages(this.props.token).unreadSocket(
      function(socket) {
        this.msgCounter = socket;
      }.bind(this),
      function(res) {
        let data = JSON.parse(res.data);
        this.setState({ hasMessages: data.unread });
        this.props.onBadge(this.state.notificationCount, 0);
      }.bind(this),
      err => console.log(err)
    );
  }

  _notifs() {
    if(this.state.notificationCount > 0) {
      return <Icon style={styles.icon} name="notifications" size={24} color={Colors.accent} />;
    }

    return <Icon style={styles.icon} name="notifications-none" size={24} color={Colors.darkGrey} />;
  }

  _msgs() {
    if(this.state.hasMessages === true) {
      return <Icon style={styles.icon} name="message" size={24} color={Colors.accent} />;
    }

    return <Icon style={styles.icon} name="message" size={24} color={Colors.darkGrey} />;
  }

  _currentTab(name) {
    return this.props.currentTab === name;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableHighlight
            style={[styles.iconContainer, {flex: 3}]}
            onPress={this.props.onLogoPress} >
            <Image source={require('./images/logo.png')} />
          </TouchableHighlight>
          <TextInput
            editable={true}
            placeholder="Search"
            style={styles.search} />
          <TouchableHighlight style={styles.iconContainer} onPress={this.props.onNotificationPress}>
            {this._notifs()}
          </TouchableHighlight>
          <TouchableHighlight style={styles.iconContainer} onPress={this.props.onMessagePress}>
            {this._msgs()}
          </TouchableHighlight>
        </View>
        <View style={styles.row}>
          <TouchableHighlight
            onPress={() => this.props.onTabPress('feed')}
            style={[styles.tab, this._currentTab('feed') ? styles.tabSelected : {}]}>
            <Text>Feed</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.props.onTabPress('matches')}
            style={[styles.tab, this._currentTab('matches') ? styles.tabSelected : {}]}>
            <Text>Matches</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.props.onTabPress('events')}
            style={[styles.tab, this._currentTab('events') ? styles.tabSelected : {}]}>
            <Text>Events</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

NavBarMain.propTypes = {
  token: React.PropTypes.string.isRequired,
  onLogoPress: React.PropTypes.func,
  onNotificationPress: React.PropTypes.func,
  onMessagesPress: React.PropTypes.func,
  onTabPress: React.PropTypes.func,
  onBadge: React.PropTypes.func,
  currentTab: React.PropTypes.oneOf(['none', 'feed', 'matches', 'events'])
};

NavBarMain.defaultProps = {
  currentTab: 'none',
  onLogoPress: () => {},
  onNotificationPress: () => {},
  onMesagePress: () => {},
  onBadge: () => {},
  onTabPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    height: Layout.lines(7),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // to offset the padding of the container
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: Layout.lines(1.5)
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  iconContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
  },
  search: {
    flex: 9,
    height: Layout.lines(2.5),
    paddingHorizontal: Layout.lines(0.75),
    marginBottom: Layout.lines(0.75),
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.lightGrey,
    fontSize: Layout.lines(1)
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey
  },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey
  },
  pill: {
    borderRadius: Layout.lines(0.75),
    paddingVertical: Layout.lines(0.17),
    paddingHorizontal: Layout.lines(0.5),
    marginRight: Layout.lines(0.25),
    backgroundColor: Colors.lightGrey
  },
  pillText: {
    fontWeight: 'bold',
    fontSize: Layout.lines(0.75),
    color: Colors.darkGrey
  },
  matches: {
    fontSize: Layout.lines(1),
    color: Colors.darkGrey
  },
  friends: {
    fontSize: Layout.lines(1),
    color: Colors.darkGrey
  }
});

module.exports = NavBarMain;
