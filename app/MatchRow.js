'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Utils from './Utils';
import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';

class MatchRow extends Component {
  _avatar(style) {
    if(this.props.user !== undefined) {
      return <Avatar user={this.props.user} style={style}/>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._avatar(styles.avatar)}
        <View style={styles.stats}>
          <Text style={styles.user}>@{this.props.username}</Text>
          <View style={styles.extraInfoContainer}>
            <Text style={styles.extraInfo}>{Utils.age(this.props.birthdate)}</Text>
            <Text style={styles.extraInfo}>{Utils.cityState(this.props.location)}</Text>
          </View>
          <View style={styles.matchContainer}>
            <Text style={styles.matchLabel}>Match:</Text>
            <Text style={styles.match}>{this.props.match}%</Text>
          </View>
        </View>
      </View>
    );
  }
}

MatchRow.propTypes = {
  username: React.PropTypes.string.isRequired,
  birthdate: React.PropTypes.oneOfType([ React.PropTypes.number, React.PropTypes.string ]),
  location: React.PropTypes.string.isRequired,
  match: React.PropTypes.number.isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: Layout.lines(1),
    marginTop: Layout.lines(1),
    backgroundColor: 'white'
  },
  stats: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  avatar: {
    height: Layout.lines(5),
    width: Layout.lines(5),
    marginRight: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  user: {
    marginBottom: Layout.lines(0.25),
    fontSize: Layout.lines(1),
    color: Colors.action
  },
  extraInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  extraInfo: {
    flex: 1,
    marginRight: Layout.lines(1),
    fontSize: Layout.lines(0.75)
  },
  matchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: Layout.lines(0.75)
  },
  matchLabel: {
    flex: 1,
    marginRight: Layout.lines(0.5),
    fontSize: Layout.lines(1.25),
    color: Colors.grey
  },
  match: {
    flex: 1,
    fontSize: Layout.lines(1.25),
    color: Colors.darkGrey
  }
});

module.exports = MatchRow;
