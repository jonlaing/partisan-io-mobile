/*global fetch  */
'use strict';
import React, {
  Component,
  StyleSheet,
  ListView,
  RefreshControl,
  View
} from 'react-native';

import FeedRow from './FeedRow';

class FeedList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = { items: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: true };
  }

  componentWillMount() {
    this._getFeed(true);
  }

  _getFeed(refresh = false) {
    if(this.props.token.length <= 0) {
      return;
    }

    var page = refresh ? 1 : this.state.page;

    fetch('http://localhost:4000/api/v1/feed?page=' + page, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': this.props.token
      }
    })
    .then(res => JSON.parse(res._bodyInit))
    .then(data => data.feed_items)
    .then(items => refresh ? items : this.state.items.concat(items) ) // either refresh the items or append them
    .then(items => this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
      page: (refresh ? 1 : this.state.page + 1),
      isRefreshing: false
    }));
  }

  _renderRow(item) {
    return (
      <FeedRow
        key={item.id}
        item={item}
      />
    );
  }

  render() {
    return (
      <View style={this.props.margin ? styles.containerWithMargin : styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          onEndReached={() => this._getFeed()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.setState({isRefreshing: true});
                this._getFeed(true);
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
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgb(242,242,242)',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10
  },
  containerWithMargin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgb(242,242,242)',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginTop: 64
  }
});

module.exports = FeedList;
