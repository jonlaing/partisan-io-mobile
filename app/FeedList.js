'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  TouchableHighlight,
  RefreshControl,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenuNav from 'react-native-side-menu';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Colors from './Colors';
import Layout from './Layout';

import SideMenu from './SideMenu';
import NavBar from './NavBar';
import FeedRow from './FeedRow';

class FeedList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state = { items: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: true, hasFriends: true };
  }

  componentDidMount() {
    this.getFeed(true);
    Api.friends(this.props.token).count().then(count => this.setState({hasFriends: count > 0}));
    this.props.navigator.props.eventEmitter.addListener('post-success', this._handlePostSuccess.bind(this));
  }

  // Conditions as to whether a feed item should be updated in the ListView
  _rowHasChanged(r1, r2) {
    if(r1.id !== r2.id) {
      return true;
    }

    if(r1.record.updated_at !== r2.record.updated_at) {
      return true;
    }

    if(r1.record.like_count !== r2.record.like_count) {
      return true;
    }

    if(r1.record.comment_count !== r2.record.comment_count) {
      return true;
    }

    return false;
  }

  getFeed(refresh = false) {
    var page = refresh ? 1 : this.state.page + 1;

    Api.feed(this.props.token).get(page)
    .then(res => JSON.parse(res._bodyInit))
    .then(data => data.feed_items)
    .then(items => refresh ? items : this.state.items.concat(items) ) // either refresh the items or append them
    .then(items => this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
      page: page,
      isRefreshing: false
    }))
    .catch((err) => {
      console.log(err);
      this.setState({isRefreshing: false});
    });
  }

  _handlePostSuccess() {
    this.getFeed(true);
  }

  _handleHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _handlePost() {
    this.props.navigator.push(Router.postComposer(this.props.token));
  }

  _renderRow(item) {
    return (
      <FeedRow
        key={item.id}
        token={this.props.token}
        navigator={this.props.navigator}
        item={item}
      />
    );
  }


  render() {
    return (
      <SideMenuNav ref="sidemenu" menu={<SideMenu navigator={this.props.navigator} token={this.props.token} />}>
        <View style={styles.container}>
          {this._noFriends()}
          {this._noFeed()}
          <ListView
            scrollToTop={true}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            onEndReached={() => this.getFeed()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.setState({isRefreshing: true});
                  this.getFeed(true);
                }}
                tintColor="rgb(191,191,191)"
                title="Loading..."
              />
            }
          />
        </View>
        <NavBar
          title="Feed"
          leftButton={ <Icon name="bars" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={this._handleHamburger.bind(this)}
          rightButton={ <Icon name="pencil-square-o" color="rgb(255,255,255)" size={24} /> }
          rightButtonPress={this._handlePost.bind(this)}
        />
      </SideMenuNav>
    );
  }

  _noFeed() {
    if(this.state.isRefreshing === false && this.state.items.length < 1 && this.state.hasFriends === true) {
      return <Text style={{padding: Layout.lines(1), textAlign: 'center', color: Colors.darkGrey}}>Nothing to show!</Text>;
    }
  }

  _noFriends() {
    if(this.state.hasFriends === false) {
      return (
        <View style={styles.noFriendsContainer}>
          <Text style={styles.noFriendsHeader}>You don't have any friends!</Text>
          <View style={styles.noFriendsFrown}>
            <Icon name="frown-o" color={Colors.grey} size={Layout.lines(4)} />
          </View>
          <Text style={styles.noFriendsParagraph}>
            Well, not on Partisan, anyway. Find matches to fill up your feed
            with posts from other people who have similar political opinions to yours.
          </Text>
          <View style={styles.noFriendsHR} />
          <TouchableHighlight
            style={styles.noFriendsButton}
            underlayColor={Colors.actionHighlight2}
            onPress={() => this.props.navigator.push(Router.matches(this.props.token, false))}>
            <Text style={styles.noFriendsButtonText}>Find Matches!</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

FeedList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.lightGrey,
    paddingTop: Layout.lines(4),
    paddingHorizontal: Layout.lines(0.75)
  },
  noFriendsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: Layout.lines(1),
    padding: Layout.lines(1),
    backgroundColor: 'white',
    minHeight: Layout.lines(24)
  },
  noFriendsHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: Layout.lines(1.25),
    color: Colors.darkGrey,
    paddingBottom: Layout.lines(1)
  },
  noFriendsFrown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.lines(1)
  },
  noFriendsParagraph: {
    flex: 3,
    paddingVertical: Layout.lines(1),
    lineHeight: Layout.lines(1.5)
  },
  noFriendsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.lines(1),
    marginVertical: Layout.lines(1),
    borderWidth: 1,
    borderColor: Colors.action,
    borderRadius: Layout.lines(0.5)
  },
  noFriendsButtonText: {
    textAlign: 'center',
    fontSize: Layout.lines(1),
    color: Colors.action
  }
});

module.exports = FeedList;
