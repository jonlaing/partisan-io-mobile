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
import ActionButton from './ActionButton';
import MatchFilter from './MatchFilter';

let empty = {
  empty: true
};

class MatchList extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      matches: [],
      dataSource: ds.cloneWithRows([]),
      distance: 105,
      page: 1,
      isRefreshing: false,
      showFilters: false };
  }

  componentDidMount() {
    this.getMatches(true);
  }

  getMatches(refresh = false) {
    let page = refresh ? 1 : this.state.page + 1;
    let distance = this.state.distance > 100 ? 0 : this.state.distance;

    Api.matches(this.props.token).get(page, distance)
    .then((matches) => {
      if(matches == null && refresh) {
        return [empty];
      }

      if(refresh) {
        return matches;
      } else {
        return this.state.matches.concat(matches).filter((m) => m !== null);
      }
    }) // either refresh the items or append them
    .then(matches => this.setState({
      matches: matches,
      dataSource: this.state.dataSource.cloneWithRows(matches),
      page: page,
      isRefreshing: false
    }))
    .catch(err => console.log("error:", err));
  }

  _handleFilter(filters) {
    this.setState({distance: filters.distance, showFilters: false});
    this.getMatches(true);
  }

  _distance() {
    if(this.state.distance > 100) {
      return "from everywhere";
    }

    return `within ${this.state.distance} miles`;
  }

  _renderRow(match) {
    if(match.empty === true) {
      return <Text style={{padding: Layout.lines(1), textAlign: 'center', color: Colors.darkGrey}}>Nothing to show!</Text>;
    }

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

  render() {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={{paddingHorizontal: Layout.lines(0.75)}}
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderHeader={() => <Text style={styles.showing}>Showing matches {this._distance()}…</Text>}
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
        <ActionButton icon="tune" onPress={() => this.setState({showFilters: true})}/>
        <MatchFilter show={this.state.showFilters} onFinish={this._handleFilter.bind(this)}/>
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
    position: 'relative',
    backgroundColor: Colors.lightGrey
  },
  filterContainer: {
    backgroundColor: Colors.baseDark,
    padding: Layout.lines(1),
    marginHorizontal: -Layout.lines(0.75)
  },
  filterHeader: {
    color: 'white'
  },
  showing: {
    marginTop: Layout.lines(1),
    textAlign: 'center',
    color: Colors.darkGrey
  }
});

module.exports = MatchList;
