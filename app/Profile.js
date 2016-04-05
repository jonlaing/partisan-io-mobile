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

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = { user: null, profile: null, match: 0 };
  }

  componentDidMount() {
    Api.profile(this.props.token).get(this.props.userID)
    .then(resp => {
      if(resp.status === 200) {
        return JSON.parse(resp._bodyInit);
      } else {
        throw resp.statusText;
      }
    })
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
            <Text>Looking For: {this.state.profile.looking_for}</Text>
            <View style={styles.summaryContainer}>
              <Text>Summary:</Text>
              <Text>{this.state.profile.summary}</Text>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: Colors.base
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
    top: 0,
    right: 0,
    height: Layout.lines(3),
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
  basicDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  basicDetailsText: {
    marginHorizontal: Layout.lines(1)
  },
  summaryContainer: {
    marginVertical: Layout.lines(2)
  }
});

module.exports = Profile;
