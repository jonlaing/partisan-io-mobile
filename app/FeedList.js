'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Colors from './Colors';
import Layout from './Layout';

import FeedRow from './FeedRow';
import NoFriends from './NoFriends';
import PostComposeButton from './PostComposeButton';

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.postListener = null;
    this.parentNav = this.props.navigator.props.parentNavigator;

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
    Api.friendships(this.props.token).count().then(count => this.setState({hasFriends: count > 0})).catch(err => console.log(err));
    this.postListener = this.parentNav.props.eventEmitter.addListener('post-success', this._handlePostSuccess.bind(this));
  }

  componentWillUnmount() {
    try {
      this.postListener.remove();
    } catch(e) {
      console.log(e);
    }
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

  _handlePost() {
    this.parentNav.push(Router.postComposer(this.props.token));
  }

  _handleLike(postID) {
    return function() {
      // optimistically update like
      this._updateLike(postID);

      Api.posts(this.props.token).like(postID)
      .catch(err => console.log(err));
    };
  }

  _updateLike(postID) {
    let items = JSON.parse(JSON.stringify(this.state.items)); // stupid deep copy, there's gotta be a better way

    items = items.map((item) => {
      if(item.record.post.id === postID) {
        item.record.liked = !item.record.liked;
        item.record.like_count = item.record.liked ? item.record.like_count + 1 : item.record.like_count - 1;
      }

      return item;
    });

    this.setState({ items: items, dataSource: this.state.dataSource.cloneWithRows(items) });
  }

  _renderRow(item) {
    return (
      <FeedRow
        key={item.id}
        token={this.props.token}
        navigator={this.parentNav}
        item={item}
        onLike={this._handleLike(item.record.post.id).bind(this)}
      />
    );
  }


  render() {
    return (
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
        <PostComposeButton onPress={this._handlePost.bind(this)} />
      </View>
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
    backgroundColor: 'white'
  }
});

module.exports = FeedList;
