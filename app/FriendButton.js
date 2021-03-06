'use strict';

import React, {
  Component,
  Alert,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

class FriendButton extends Component {
  constructor(props) {
    super(props);

    this.state = { friendship: {}, fetched: false };
  }

  componentDidMount() {
    Api.friendships(this.props.token).get(this.props.userID)
    .then(data => this.setState({friendship: data.friendship, fetched: true}))
    .catch(err => {
      console.log(err);
      this.setState({fetched: true});
    });
  }

  _handlePress() {
    if(this.state.friendship.confirmed === false && this.state.friendship.user_id === this.props.userID) {
      Api.friendships(this.props.token).confirm(this.props.userID)
      .then(data => { this.setState({friendship: data.friendship}); return data.friendship; })
      .then((friendship) => this.props.onAccept(friendship))
      .catch(err => this._handleError(err));
    } else {
      Api.friendships(this.props.token).request(this.props.userID)
      .then((data) => { console.log(data); this.setState({friendship: data.friendship}); })
      .catch(err => this._handleError(err));
    }
  }

  _handleError(err) {
    if(err.response && err.response.status === 403) {
      Alert.alert(
        'Cannot request friendship',
        'This person is not looking for enemies, and your match percentage is too low to friend them.'
      );
    }

    console.log(err);
  }

  render() {
    if(this.state.fetched === false) {
      return <View style={styles.container} />;
    }

    if(this.state.friendship !== undefined) {
      if(this.state.friendship.confirmed === true) {
        return (
          <TouchableHighlight style={{flex: 1}}>
            <View style={[styles.container, {backgroundColor: Colors.lightGrey}]}>
              <Icon style={styles.icon} name="check" color={Colors.base} size={24} />
              <Text style={[styles.text, {color: Colors.base}]}>Friends</Text>
            </View>
          </TouchableHighlight>
        );
      }

      // if it was initiated by this person, then you can confirm
      if(this.state.friendship.confirmed === false && this.state.friendship.user_id === this.props.userID) {
        return (
          <TouchableHighlight style={{flex: 1}} onPress={this._handlePress.bind(this)}>
            <View style={styles.container}>
              <Icon style={styles.icon} name="reply" color="rgb(255,255,255)" size={24} />
              <Text style={styles.text}>Confirm Friendship</Text>
            </View>
          </TouchableHighlight>
        );
      }

      if(this.state.friendship.confirmed === false && this.state.friendship.user_id !== this.props.userID) {
        return (
          <TouchableHighlight style={{flex: 1}} >
            <View style={[styles.container, {backgroundColor: Colors.grey}]}>
              <Icon style={styles.icon} name="ellipsis-h" color={Colors.darkGrey} size={24} />
              <Text style={[styles.text, {color: Colors.darkGrey}]}>Request Sent</Text>
            </View>
          </TouchableHighlight>
        );
      }
    }

    return (
      <TouchableHighlight style={{flex: 1}} onPress={this._handlePress.bind(this)}>
        <View style={styles.container}>
          <Icon style={styles.icon} name="user-plus" color="rgb(255,255,255)" size={24} />
          <Text style={styles.text}>Add Friend</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

FriendButton.propTypes = {
  token: React.PropTypes.string.isRequired,
  userID: React.PropTypes.string.isRequired,
  onAccept: React.PropTypes.func
};

FriendButton.defaultProps = {
  onAccept: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.action
  },
  icon: {
    marginHorizontal: Layout.lines(1)
  },
  text: {
    marginHorizontal: Layout.lines(1),
    fontSize: Layout.lines(1),
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = FriendButton;
