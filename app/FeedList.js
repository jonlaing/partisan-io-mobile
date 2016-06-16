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

import Post from './Post';
import NoFriends from './NoFriends';
import PostComposeButton from './PostComposeButton';

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.postSuccessListener = null;
    this.parentNav = this.props.navigator.props.parentNavigator || this.props.navigator;

    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state = {
      posts: [],
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
    this.postSuccessListener = this.parentNav.props.eventEmitter.addListener('post-success', this._handlePostSuccess.bind(this));
    this.postDeleteListener = this.parentNav.props.eventEmitter.addListener('post-delete', this._handlePostDelete.bind(this));
  }

  componentWillUnmount() {
    try {
      this.postSuccessListener.remove();
      this.postDeleteListener.remove();
    } catch(e) {
      console.log(e);
    }
  }

  // Conditions as to whether a post should be updated in the ListView
  _rowHasChanged(r1, r2) {
    if(r1.id !== r2.id) {
      return true;
    }

    if(r1.updated_at !== r2.updated_at) {
      return true;
    }

    if(r1.like_count !== r2.like_count) {
      return true;
    }

    if(r1.liked !== r2.liked) {
      return true;
    }

    if(r1.child_count !== r2.child_count) {
      return true;
    }

    if(r1.parent !== r2.parent) {
      return true;
    }

    return false;
  }

  getFeed(refresh = false) {
    var page = refresh ? 0 : this.state.page + 1;
    let api = () => Api.feed(this.props.token).get(page);

    if(this._hasParent()) {
      switch(this.props.parentType) {
              case 'event':
                      api = () => Api.events(this.props.token).posts(this.props.parentID, page);
                      break;
              default:
                      throw "Unkown parent type";
      }
    }

    api().then(posts => refresh ? posts : this.state.posts.concat(posts) ) // either refresh the post or append them
    .then(posts => this.setState({
      posts: posts,
      dataSource: this.state.dataSource.cloneWithRows(posts),
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

  _handlePostDelete() {
    this.getFeed(true);
  }

  _handlePost() {
    this.parentNav.push(Router.postComposer(this.props.token, this.props.parentType, this.props.parentID));
  }

  _handleLike(post) {
    return function() {
      let id = '';

      if(this._hasParent() || post.parent_type === '') {
        id = post.id;
      } else {
        id = post.parent_id.String;
      }

      // optimistically update like
      this._updateLike(post);

      Api.posts(this.props.token).like(id)
      .catch(err => console.log(err));
    };
  }

  _handleDelete(id) {
    Api.posts(this.props.token).destroy(id)
    .then(() => this.props.navigator.props.eventEmitter.emit('post-delete'))
    .catch(err => console.log(err));
  }

  _updateLike(p) {
    let posts = JSON.parse(JSON.stringify(this.state.posts)); // stupid deep copy, there's gotta be a better way
    let hasParent = p.parent_id.Valid && p.parent_type === "post";

    posts = posts.map((post) => {
      if(post.id === p.id) {
        if(hasParent === true) {
          post.parent.liked = !post.parent.liked;
          post.parent.like_count = post.parent.liked ? post.parent.like_count + 1 : post.parent.like_count - 1;
        } else {
          post.liked = !post.liked;
          post.like_count = post.liked ? post.like_count + 1 : post.like_count - 1;
        }
      }

      return post;
    });

    this.setState({ posts: posts, dataSource: this.state.dataSource.cloneWithRows(posts) });
  }

  _renderRow(post) {
    if(post.parent != null) {
      return (
        <Post
          key={post.id}
          token={this.props.token}
          navigator={this.parentNav}
          postID={post.id}
          username={post.user.username}
          avatar={post.user.avatar_thumbnail_url}
          createdAt={post.created_at}
          action={post.action}
          body={post.body}
          attachments={post.attachments}
          likeCount={post.like_count}
          liked={post.liked}
          commentCount={post.child_count}
          onLike={this._handleLike(post).bind(this)}
          onComment={() => this.parentNav.push(Router.postScreen(post.id, this.props.token, true))}
          onFlag={() => this.parentNav.push(Router.flag('post', post.id, this.props.token))}
          onDelete={this._handleDelete.bind(this)}
          onHashtagPress={() => {}}
          onUserTagPress={() => {}}
          onHeaderPress={() => this.parentNav.push(Router.postScreen(post.parent.id, this.props.token, false))}
          isMine={post.user_id === this.parentNav.props.user.id}
          parent={post.parent}
        />
      );
    }

    return (
      <Post
        key={post.id}
        token={this.props.token}
        navigator={this.parentNav}
        postID={post.id}
        username={post.user.username}
        avatar={post.user.avatar_thumbnail_url}
        createdAt={post.created_at}
        action={post.action}
        body={post.body}
        attachments={post.attachments}
        likeCount={post.like_count}
        liked={post.liked}
        commentCount={post.child_count}
        onLike={this._handleLike(post).bind(this)}
        onComment={() => this.parentNav.push(Router.postScreen(post.id, this.props.token, true))}
        onFlag={() => this.parentNav.push(Router.flag('post', post.id, this.props.token))}
        onDelete={this._handleDelete.bind(this)}
        onHashtagPress={() => {}}
        onUserTagPress={() => {}}
        onHeaderPress={() => this.parentNav.push(Router.postScreen(post.id, this.props.token, true))}
        isMine={post.user_id === this.parentNav.props.user.id}
      />
    );
  }

  _feed() {
    if(this.state.hasFriends !== false) {
      return (
        <ListView
          scrollToTop={true}
          onScroll={this.props.onScroll}
          scrollEventThrottle={500}
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
      );
    }

    return <View />;
  }

  _postButton() {
    return <PostComposeButton onPress={this._handlePost.bind(this)} />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this._noFriends()}
        {this._noFeed()}
        {this._feed()}
        {this._postButton()}
      </View>
    );
  }

  _noFeed() {
    if(this.state.isRefreshing === false && this.state.posts.length < 1 && this.state.hasFriends === true) {
      return <Text style={{padding: Layout.lines(1), textAlign: 'center', color: Colors.darkGrey}}>Nothing to show!</Text>;
    }
  }

  _noFriends() {
    if(!this._hasParent() && this.state.hasFriends === false) {
      return <NoFriends token={this.props.token} navigator={this.props.navigator} />;
    }
  }

  _hasParent() {
    return this.props.parentType !== '' && this.props.parentID !== '';
  }
}

FeedList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  parentType: React.PropTypes.string,
  parentID: React.PropTypes.string,
  onScroll: React.PropTypes.func
};

FeedList.defaultProps = {
  parentType: '',
  parentID: '',
  onScroll: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  }
});

module.exports = FeedList;
