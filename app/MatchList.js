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
import Layout from './Layout';
import Colors from './Colors';

import MatchRow from './MatchRow';

class MatchList extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { matches: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: false, showFilters: false };
  }

  componentDidMount() {
    this.getMatches(true);
  }

  getMatches(refresh = false) {
    var page = refresh ? 1 : this.state.page + 1;

    Api.matches(this.props.token).get(page)
    .then(matches => refresh ? matches : this.state.matches.concat(matches).filter((m) => m !== null) ) // either refresh the items or append them
    .then(matches => this.setState({
      matches: matches,
      dataSource: this.state.dataSource.cloneWithRows(matches),
      page: page,
      isRefreshing: false
    }))
    .catch(err => console.log("error:", err));
  }

  _renderRow(match) {
    return (
      <MatchRow
        key={match.user.username}
        navigator={this.props.navigator}
        token={this.props.token}
        user={match.user}
        username={match.user.username}
        birthdate={match.user.birthdate}
        location={match.user.location}
        match={match.match}
      />
    );
  }

  _searchFilters() {
    if(this.state.showFilters === true) {
      return (
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeader}>Search Parameters</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._searchFilters()}
        {this._noMatches()}
        <ListView
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          onEndReached={() => this.getMatches()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.getMatches(true);
                this.setState({isRefreshing: true});
              }}
              tintColor="rgb(191,191,191)"
              title="Loading..."
            />
          }
        />
      </View>
    );
  }

  _noMatches() {
    if(this.state.isRefreshing === false && this.state.matches.length < 1) {
      return <Text style={{padding: Layout.lines(1), textAlign: 'center', color: Colors.darkGrey}}>Nothing to show!</Text>;
    }
  }
}

MatchList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: Layout.lines(0.75)
  },
  filterContainer: {
    backgroundColor: Colors.baseDark,
    padding: Layout.lines(1),
    marginHorizontal: -Layout.lines(0.75)
  },
  filterHeader: {
    color: 'white'
  }
});

module.exports = MatchList;
