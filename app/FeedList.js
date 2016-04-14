'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
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
import NoFriends from './NoFriends';
import NotifBadge from './NotifBadge';

var _menuOpen = false;

class FeedList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state = {
      items: [],
      dataSource: ds.cloneWithRows([]),
      page: 1,
      isRefreshing: false,
      menuOpen: false,
      hasFriends: true,
      notificationCount: 0
    };
  }

  componentDidMount() {
    this.getFeed(true);
    this._getNotifs();
    Api.friendships(this.props.token).count().then(count => this.setState({hasFriends: count > 0})).catch(err => console.log(err));
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

    if(r1.record.liked !== r2.record.liked) {
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
    .then(res => res.json())
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

  _getNotifs() {
    Api.notifications(this.props.token).countSocket(
      function(res) {
        let data = JSON.parse(res.data);
        if(!_menuOpen && this.state.notificationCount !== data.count) {
          this.setState({ notificationCount: data.count });
        }
      }.bind(this),
      err => console.log(err)
    );
  }

  _handlePostSuccess() {
    this.getFeed(true);
  }

  _handleHamburger() {
    _menuOpen = !_menuOpen;
    this.refs.sidemenu.openMenu(true);
  }

  _handlePost() {
    this.props.navigator.push(Router.postComposer(this.props.token));
  }

  _handleLike(postID) {
    return function() {
      Api.posts(this.props.token).like(postID)
      .then(res => res.json())
      .then(data => {
        let items = JSON.parse(JSON.stringify(this.state.items)); // stupid deep copy, there's gotta be a better way

        items = items.map((item) => {
          if(item.record.post.id === data.record_id) {
            item.record.liked = data.liked;
            item.record.like_count = data.like_count;
          }

          return item;
        });

        this.setState({ items: items, dataSource: this.state.dataSource.cloneWithRows(items) });
      })
      .catch(err => console.log(err));
    };
  }

  _renderRow(item) {
    return (
      <FeedRow
        key={item.id}
        token={this.props.token}
        navigator={this.props.navigator}
        item={item}
        onLike={this._handleLike(item.record.post.id).bind(this)}
      />
    );
  }


  render() {
    return (
      <SideMenuNav ref="sidemenu" menu={ <SideMenu navigator={this.props.navigator} token={this.props.token} notificationCount={this.state.notificationCount} /> }>
        <View style={styles.container}>
          {this._noFriends()}
          {this._noFeed()}
          <ListView
            scrollToTop={true}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
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
          badgeLeft={<NotifBadge active={this.state.notificationCount > 0} />}
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
      return <NoFriends token={this.props.token} navigator={this.props.navigator} />;
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
  }
});

module.exports = FeedList;
