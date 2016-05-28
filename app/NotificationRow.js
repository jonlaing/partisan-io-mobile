'user strict';
import React, {
  Component,
  TouchableHighlight,
  View,
  Text,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';
import Avatar from './Avatar';

class NotificationRow extends Component {
  _notifText() {
    let username = this.props.username;
    let action = this.props.action;
    let recordType = this.props.recordType;

    switch(action) {
        case "user_tag":
          return "@" + username + " tagged you in a " + recordType;
        case "like":
          return "@" + username + " liked your " + recordType;
        case "comment":
          return `@${username} commented on your post`;
        case "friendaccept":
          return "@" + username + " accepted your friendship";
        case "friendrequest":
          // return `@${username} requested to be your friend`;
        default:
          return "Rouge notification... ¯\\_(ツ)_/¯";
    }
  }

  _handlePress() {
    let action = this.props.action;

    switch(action) {
      case "user_tag":
      case "like":
        if(action === "post") {
          this.props.navigator.push(Router.postScreen(this.props.recordID, this.props.token));
        }
        break;
      case "friendship":
      case "friendrequest":
              this.props.navigator.push(Router.profile(this.props.token, this.props.userID));
              break;
      default:
        break;
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this._handlePress.bind(this)}>
        <View style={styles.container} >
          <Avatar url={this.props.avatar} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text>{this._notifText()}</Text>
            <Text style={styles.time}>{moment(this.props.createdAt).fromNow()}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

NotificationRow.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  userID: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  avatar: React.PropTypes.string,
  recordID: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: 'rgb(242,242,242)',
    borderBottomWidth: 1
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  time: {
    fontSize: 12,
    color: 'rgb(191,191,191)'
  }
});

module.exports = NotificationRow;
