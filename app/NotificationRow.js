'user strict';
import React, {
  Component,
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';

class NotificationRow extends Component {
  _avatar(user) {
    let url = user.avatar_thumbnail_url;
    if(url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <Image
          style={styles.avatar}
          source={{uri: url}}
        />
      );
    } else {
      return (<View style={styles.avatar}/>);
    }
  }

  _notifText(notif) {
    let username = notif.user.username;
    let action = notif.notification.record_type;
    let recordType = notif.record.record_type;

    switch(action) {
        case "user_tag":
          return "@" + username + " tagged you in a " + recordType;
        case "like":
          return "@" + username + " liked your " + recordType;
        default:
          return "Crazy notification...";
    }
  }

  _handlePress() {
    let action = this.props.notif.notification.record_type;
    let record = this.props.notif.record;

    switch(action) {
      case "user_tag":
      case "like":
        if(record.record_type === "post") {
          this.props.navigator.push(Router.postScreen(record.record_id, this.props.token));
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this._handlePress.bind(this)}>
        <View style={styles.container} >
          {this._avatar(this.props.notif.user)}
          <View style={styles.textContainer}>
            <Text>{this._notifText(this.props.notif)}</Text>
            <Text style={styles.time}>{moment(this.props.notif.notification.created_at).fromNow()}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

NotificationRow.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  notif: React.PropTypes.object.isRequired
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
