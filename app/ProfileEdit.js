'use strict';

import React, {
  Component,
  AsyncStorage,
  Dimensions,
  LayoutAnimation,
  StyleSheet,
  DatePickerIOS,
  TouchableHighlight,
  ScrollView,
  TextInput,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import moment from 'moment';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';
import Avatar from './Avatar';
import LookingFor from './LookingFor';
import LookingForWidget from './LookingForWidget';
import UploadAvatar from './UploadAvatar';

var {height} = Dimensions.get('window');

export default class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: this.props.user.avatar_thumbnail_url,
      birthdate: new Date(this.props.user.birthdate),
      postalCode: this.props.user.postal_code,
      gender: this.props.user.gender,
      lookingFor: this.props.user.looking_for,
      summary: this.props.user.summary,

      showLookingFor: false,
      showBirthdate: false,
      showAvatar: false
    };
  }

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _lookingForStyle() {
    if(this.state.showLookingFor === true) {
      return [styles.lookingForEdit, {top: 0}];
    }

    return styles.lookingForEdit;
  }

  _birthdateStyle() {
    if(this.state.showBirthdate === true) {
      return [styles.birthdateEdit, {top: height * 2 / 3}];
    }

    return styles.birthdateEdit;
  }

  _avatarStyle() {
    if(this.state.showAvatar === true) {
      return [styles.avatarEdit, {top: 0}];
    }

    return styles.avatarEdit;
  }

  _handleLookingFor(resp) {
    this.setState({lookingFor: resp.user.looking_for, showLookingFor: false});
    this._updateUser(resp.user);
  }

  _handleSummaryFocus() {
    this.summary.measure((fx, fy, w, h, px, py) => this.scrollView.scrollTo({y: py - Layout.lines(8)}));
  }

  _handleAvatarUpload(user) {
    this.setState({avatar: user.avatar_thumbnail_url, showAvatar: false});
    this._updateUser(user);
  }

  _updateUser(user) {
    AsyncStorage.setItem('user', JSON.stringify(user)).catch(err => console.log(err));
    this.props.navigator.props.eventEmitter.emit('user-change');
  }

  _saveUser() {
    Api.profile(this.props.token).update(
      this.state.postalCode,
      this.state.birthdate,
      this.state.gender,
      this.state.lookingFor,
      this.state.summary
    )
    .then(resp => this._updateUser(resp.user))
    .then(() => this.props.navigator.pop())
    .catch(err => console.log(err));
  }

  render() {
    let birthdate = this.state.birthdate;
    if(moment(birthdate).isBefore('1900-12-31')) {
      birthdate = new Date();
    }

    return (
      <View style={{ flex: 1, position: 'relative'}}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScrollView style={styles.scrollView} ref={c => this.scrollView = c}>
            <View style={styles.container}>
              <View style={styles.navBarExtend} />
              <TouchableHighlight style={styles.avatarContainer} onPress={() => this.setState({showAvatar: true, showBirthdate: false})}>
                <View>
                  <Avatar style={styles.avatar} url={this.state.avatar} />
                </View>
              </TouchableHighlight>
              <View style={styles.basicDetails}>
                <View style={styles.basicDetailsItem}>
                  <View style={styles.basicLabel}>
                    <Icon name="location-on" size={24} color={Colors.darkGrey} style={styles.basicDetailsIcon}/>
                    <Text style={styles.basicDetailsText}>Postal Code:</Text>
                  </View>
                  <TextInput
                    style={styles.basicInput}
                    onChangeText={text => this.setState({postalCode: text})}
                    value={this.state.postalCode}
                  />
                </View>
                <View style={styles.basicDetailsItem}>
                  <View style={styles.basicLabel}>
                    <Icon name="blur-on" size={24} color={Colors.darkGrey} style={styles.basicDetailsIcon}/>
                    <Text style={styles.basicDetailsText}>Gender:</Text>
                  </View>
                  <TextInput
                    style={styles.basicInput}
                    onChangeText={text => this.setState({gender: text})}
                    value={this.state.gender}
                  />
                </View>
                <TouchableHighlight onPress={() => this.setState({showBirthdate: true, showLookingFor: false, showAvatar: false})}>
                  <View style={styles.basicDetailsItem}>
                    <View style={styles.basicLabel}>
                      <Icon name="event" size={24} color={Colors.darkGrey} style={styles.basicDetailsIcon}/>
                      <Text style={styles.basicDetailsText}>Birthdate:</Text>
                    </View>
                    <TextInput
                      style={styles.basicInput}
                      editable={false}
                      value={moment(birthdate).format("MMMM Do YYYY")}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              <TouchableHighlight onPress={() => this.setState({showLookingFor: true, showBirthdate: false}) }>
                <View style={styles.lookingForContainer}>
                  <Text style={styles.header}>LOOKING FOR:</Text>
                  <LookingForWidget value={this.state.lookingFor} />
                </View>
              </TouchableHighlight>
              <View style={styles.summaryContainer}>
                <Text style={styles.header}>SUMMARY:</Text>
                <TextInput
                  ref={c => this.summary = c}
                  onFocus={this._handleSummaryFocus.bind(this)}
                  style={[styles.basicInput, {height: 200}]}
                  onChangeText={val => this.setState({summary: val})}
                  value={this.state.summary}
                  placeholder="Tell us about yourself"
                  multiline={true}
                />
              </View>
            </View>
          </ScrollView>
          <KeyboardSpacer />
          <NavBar
            title="Edit Profile"
            leftButton={<Icon name="chevron-left" color="rgb(255,255,255)" size={24} />}
            leftButtonPress={() => this.props.navigator.pop()}
            rightButton={<Text style={styles.save}>Save</Text>}
            rightButtonPress={this._saveUser.bind(this)}
          />
        </View>
        <View style={this._lookingForStyle()}>
          <LookingFor
            token={this.props.token}
            navigator={this.props.navigator}
            initialLookingFor={this.state.lookingFor}
            onSubmit={this._handleLookingFor.bind(this)}
          />
        </View>
        <View style={this._birthdateStyle()}>
          <DatePickerIOS
            style={{flex: 1}}
            onDateChange={(date) => this.setState({birthdate: date, showBirthdate: false})}
            date={birthdate}
            maximumDate={new Date()}
            mode="date"
          />
        </View>
        <View style={this._avatarStyle()}>
          <UploadAvatar token={this.props.token} onSuccess={this._handleAvatarUpload.bind(this)} onCancel={() => this.setState({showAvatar: false})} />
        </View>
      </View>
    );
  }
}

ProfileEdit.propTypes = {
  token: React.PropTypes.string.isRequired,
  user: React.PropTypes.object.isRequired,
  onFinish: React.PropTypes.func
};

ProfileEdit.defaultProps = {
  onFinish: () => {}
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
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
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
    marginBottom: Layout.lines(0.75)
  },
  basicDetailsItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Layout.lines(0.5),
    paddingLeft: Layout.lines(1),
    paddingRight: Layout.lines(1),
    paddingBottom: Layout.lines(0.5),
    height: Layout.lines(4)
  },
  basicLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  basicDetailsIcon: {
    marginTop: Layout.lines(0.25),
    marginRight: Layout.lines(1)
  },
  basicDetailsText: {
    color: Colors.darkGrey,
    fontSize: Layout.lines(1)
  },
  basicInput: {
    flex: 1,
    paddingHorizontal: Layout.lines(0.5),
    marginLeft: Layout.lines(0.5),
    marginVertical: Layout.lines(0.5),
    backgroundColor: Colors.lightGrey,
    borderRadius: Layout.lines(0.25)
  },
  lookingForContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.lines(0.75)
  },
  lookingForEdit: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height
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
  birthdateEdit: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height / 3,
    backgroundColor: 'white'
  },
  avatarEdit: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: 'white'
  },
  save: {
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = ProfileEdit;
