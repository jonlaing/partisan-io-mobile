/*global fetch  */
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

import Net from './Network';
import Router from './Router';
import Colors from './Colors';
import Layout from './Layout';

import FeedRow from './FeedRow';

class FeedList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state = { items: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: true };
  }

  componentDidMount() {
    this.getFeed(true);
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
    if(this.props.token.length <= 0) {
      return;
    }

    var page = refresh ? 1 : this.state.page + 1;

    Net.feed(this.props.token).get(page)
    .then(res => JSON.parse(res._bodyInit))
    .then(data => data.feed_items)
    .then(items => refresh ? items : this.state.items.concat(items) ) // either refresh the items or append them
    .then(items => this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
      page: page,
      isRefreshing: false
    }));
  }

  _handlePostSuccess() {
    this.getFeed(true);
  }

  _handleHamburger() {
    let navigator = this.props.navigator;

    if(navigator.props.onHamburger !== undefined) {
      navigator.props.onHamburger();
      return;
    }

    console.log("No hamburger behavior defined for navigator");
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
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableHighlight style={styles.navBarLeft} onPress={this._handleHamburger.bind(this)}>
            <Icon name="bars" color="rgb(255,255,255)" size={24} />
          </TouchableHighlight>
          <View style={styles.navBarTitle}>
            <Text style={styles.navBarTitleText}>Feed</Text>
          </View>
          <TouchableHighlight style={styles.navBarRight} onPress={this._handlePost.bind(this)}>
            <Icon name="pencil-square-o" color="rgb(255,255,255)" size={24} />
          </TouchableHighlight>
        </View>
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
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    height: Layout.lines(4),
    padding: Layout.lines(0.75),
    position: 'absolute',
    top: 0,
    left: 0,
   right: -Layout.lines(1.5), // to offset the padding of the container
    backgroundColor: Colors.base,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  navBarLeft: {
    width: 24
  },
  navBarTitle: {
    flex: 1
  },
  navBarTitleText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  navBarRight: {
    width: 24
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.lightGrey,
    paddingTop: Layout.lines(4),
    paddingHorizontal: Layout.lines(0.75)
  }
});

module.exports = FeedList;
