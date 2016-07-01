'use strict';

import React, {
  Component,
  StyleSheet,
  ScrollView,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';

import Api from './Api';
import formatter from './utils/formatter';
import Layout from './Layout';
import Colors from './Colors';

import LoadingScreen from './LoadingScreen';
import NavBar from './NavBar';
import Avatar from './Avatar';
import LookingFor from './LookingForWidget';
import FriendButton from './FriendButton';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = { user: null, match: 0 };
  }

  componentDidMount() {
    this._fetchProfile();
  }

  _fetchProfile() {
    Api.profile(this.props.token).get(this.props.userID)
    .then(data => this.setState({ user: data.user, match: data.match }))
    .catch(err => console.log(err));
  }

  _match() {
    if(this.props.userID === this.props.navigator.props.user.id) {
      return <View />;
    }

    return (
      <View style={styles.matchContainer}>
        <Text style={styles.matchText}>{this.state.match}% Match</Text>
      </View>
    );
  }

  _friendButton() {
    if(this.props.userID === this.props.navigator.props.user.id) {
      return <View />;
    }

    return <FriendButton token={this.props.token} userID={this.props.userID} onAccept={() => this.props.navigator.props.eventEmitter.emit('friend-accept')} />;
  }

  render() {
    if(this.state.user === null) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.navBarExtend} />
            <Avatar style={styles.avatar} url={this.state.user.avatar_url} lightbox={true} navigator={this.props.navigator} />
            <View style={styles.basicDetails}>
              <Text style={styles.basicDetailsText}>{formatter.age(this.state.user.birthdate)}</Text>
              <Text style={styles.basicDetailsText}>{formatter.cityState(this.state.user.location)}</Text>
              <Text style={styles.basicDetailsText}>{formatter.gender(this.state.user.gender)}</Text>
            </View>
            {this._match()}
            <View style={styles.lookingForContainer}>
              <Text style={styles.header}>LOOKING FOR:</Text>
              <LookingFor value={this.state.user.looking_for} />
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.header}>SUMMARY:</Text>
              <Text style={styles.summaryText}>{this.state.user.summary}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.friendContainer}>
          {this._friendButton()}
        </View>
        <NavBar
          title={'@' + this.state.user.username}
          leftButton={<Icon name="chevron-left" color="rgb(255,255,255)" size={24} />}
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

Profile.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  userID: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: Layout.lines(4),
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    padding: Layout.lines(1),
    backgroundColor: 'white'
  },
  navBarExtend: {
    position: 'absolute',
    left: 0,
    top: -Layout.lines(15),
    right: 0,
    height: Layout.lines(18),
    backgroundColor: Colors.base
  },
  avatar: {
    width: Layout.lines(6),
    height: Layout.lines(6),
    backgroundColor: 'white',
    borderWidth: Layout.lines(0.25),
    borderRadius: Layout.lines(0.5),
    borderColor: 'white',
    marginBottom: Layout.lines(1)
  },
  header: {
    fontSize: Layout.lines(0.75),
    textAlign: 'center',
    marginBottom: Layout.lines(0.75)
  },
  basicDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Layout.lines(0.75)
  },
  basicDetailsText: {
    marginHorizontal: Layout.lines(1)
  },
  lookingForContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.lines(0.75)
  },
  summaryContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.lines(1.25)
  },
  summaryText: {
    fontSize: Layout.lines(0.85),
    lineHeight: Layout.lines(1.5)
  },
  friendContainer: {
    height: Layout.lines(5)
  },
  matchContainer: {
    marginVertical: Layout.lines(1),
    paddingHorizontal: Layout.lines(2),
    paddingVertical: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  matchText: {
    fontSize: Layout.lines(2),
    fontWeight: "200"
  }
});

module.exports = Profile;
