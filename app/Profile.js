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
import Utils from './Utils';
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

    this.state = { user: null, profile: null, match: 0 };
  }

  componentDidMount() {
    this._fetchProfile();
  }

  _fetchProfile() {
    Api.profile(this.props.token).get(this.props.userID)
    .then(data => this.setState({ user: data.user, profile: data.profile, match: data.match }))
    .catch(err => console.log(err));
  }

  render() {
    if(this.state.user === null || this.state.profile === null) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.navBarExtend} />
            <Avatar style={styles.avatar} user={this.state.user} />
            <View style={styles.basicDetails}>
              <Text style={styles.basicDetailsText}>{Utils.age(this.state.user.birthdate)}</Text>
              <Text style={styles.basicDetailsText}>{Utils.cityState(this.state.user.location)}</Text>
              <Text style={styles.basicDetailsText}>{Utils.gender(this.state.user.gender)}</Text>
            </View>
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>{Utils.match(this.state.match)} Match</Text>
            </View>
            <View style={styles.lookingForContainer}>
              <Text style={styles.header}>LOOKING FOR:</Text>
              <LookingFor value={this.state.profile.looking_for} />
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.header}>SUMMARY:</Text>
              <Text style={styles.summaryText}>{this.state.profile.summary}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.friendContainer}>
          <FriendButton token={this.props.token} userID={this.props.userID} />
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
  userID: React.PropTypes.number.isRequired
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
