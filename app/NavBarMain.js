'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  View,
  Image,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';
import Router from './Router';

import Layout from './Layout';
import Colors from './Colors';

export default class NavBarMain extends Component {
  constructor(props) {
    super(props);

    this.notifCounter = null;
    this.state = { notificationCount: 0 };
  }

  componentDidMount() {
    this._getNotifs();
  }

  componentWillUnmount() {
    try {
      this.notifCounter.close();
    } catch(e) {
      console.log(e);
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
          <TouchableHighlight style={styles.iconContainer} onPress={() => this.props.navigator.push(Router.notificationScreen(this.props.token))}>
            {this._notifs()}
          </TouchableHighlight>
          <TouchableHighlight style={styles.iconContainer} onPress={() => this.props.navigator.push(Router.messageList(this.props.token))}>
            <Icon style={styles.icon} name="message" size={24} color={Colors.darkGrey} />
          </TouchableHighlight>
        </View>
        <View style={styles.row}>
          <TouchableHighlight
            onPress={() => !this._currentTab('feed') ? this.props.navigator.replace(Router.feed(this.props.token)) : {}}
            style={[styles.tab, this._currentTab('feed') ? styles.tabSelected : {}]}>
            <Text>Feed</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => !this._currentTab('matches') ? this.props.navigator.replace(Router.matches(this.props.token)) : {}}
            style={[styles.tab, this._currentTab('matches') ? styles.tabSelected : {}]}>
            <Text>Matches</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => !this._currentTab('friends') ? this.props.navigator.replace(Router.friends(this.props.token)) : {}}
            style={[styles.tab, this._currentTab('friends') ? styles.tabSelected : {}]}>
            <Text>Friends</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

NavBarMain.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  onLogoPress: React.PropTypes.func,
  currentTab: React.PropTypes.oneOf(['none', 'feed', 'matches', 'friends'])
};

NavBarMain.defaultProps = {
  currentTab: 'none',
  onLogoPress: () => {}
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
