'use strict';

import React, {
  Component,
  ActionSheetIOS,
  Alert,
  LayoutAnimation,
  StyleSheet,
  Image,
  SegmentedControlIOS,
  TouchableHighlight,
  ScrollView,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';
import FeedList from './FeedList';

const DESCRIPTION_INDEX = 0;
const DISCUSSION_INDEX = 1;

export default class EventScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      startDate: '',
      endDate: '',
      coverPhotoUri: '',
      location: '',
      hosts: [],
      match: 0,
      rsvp: '',
      summary: '',

      tabIndex: DESCRIPTION_INDEX,
      margin: 0
    };
  }

  componentDidMount() {
    this._getEvent();
    this.updateListener = this.props.navigator.props.eventEmitter.addListener('update-event', this._getEvent.bind(this));
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    try {
      this.updateListener.remove();
    } catch(e) {
      console.log("error removing listener", e);
    }
  }

  _getEvent() {
    Api.events(this.props.token).get(this.props.eventID)
    .then(data => data.event)
    .then(event => this.setState({
      title: event.title,
      startDate: event.start_date,
      endDate: event.end_date,
      coverPhotoUri: event.cover_photo_url,
      location: event.location,
      hosts: event.hosts,
      match: event.match,
      rsvp: event.rsvp,
      summary: event.summary
    }))
    .catch(err => console.log("err:", err));
  }

  _rsvp() {
    if(this.state.rsvp === "host") {
      return (
        <View style={styles.rsvpContainer}>
          <View style={styles.rsvp}>
            <Text style={styles.rsvpText}>Hosting</Text>
          </View>
        </View>
      );
    }

    let rsvp = this.state.rsvp === "" ? "RSVP" : this.state.rsvp.charAt(0).toUpperCase() + this.state.rsvp.substr(1);

    return (
      <View style={styles.rsvpContainer}>
        <TouchableHighlight style={styles.rsvp} onPress={this._handleRSVP.bind(this)}>
          <Text style={styles.rsvpText}>{rsvp}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _tab() {
    if(this.state.tabIndex === DISCUSSION_INDEX) {
      return <FeedList style={{flex: 1}} token={this.props.token} navigator={this.props.navigator} parentType="event" parentID={this.props.eventID} onScroll={this._handleScroll.bind(this)} />;
    }

    return (
      <ScrollView style={styles.description} onScroll={this._handleScroll.bind(this)} scrollEventThrottle={500}>
        <Text style={{fontWeight: 'bold', marginBottom: Layout.lines(1)}}>Description:</Text>
        <Text>{this.state.summary}</Text>
      </ScrollView>
    );
  }

  _moreButton() {
    if(this._isHosting()) {
      return <Icon name="more-vert" size={32} color='white' />;
    }

    return <View />;
  }

  _handleScroll() {
    if(this.state.margin === 0) {
      this.tabBar.measure( (_, fy) => {
        this.setState({ margin: -(fy - Layout.lines(5)) });
      });
      return;
    }
  }

  _handleRSVP() {
    let eventID = this.props.eventID;

    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Going',
        'Maybe',
        'Unsubscribe',
        'Cancel'
      ],
      cancelButtonIndex: 3,
      destructiveButtonIndex: 2
    },
    (index) => {
      switch(index) {
              case 0:
                      this.setState({rsvp: 'going'});

                      Api.events(this.props.token).going(eventID)
                      .catch(err => console.log("err:", err));
                      break;
              case 1:
                      this.setState({rsvp: 'maybe'});

                      Api.events(this.props.token).maybe(eventID)
                      .catch(err => console.log("err:", err));
                      break;
              case 2:
                      this.setState({rsvp: ''});

                      Api.events(this.props.token).unsubscribe(eventID)
                      .catch(err => console.log("err:", err));
                      break;
              default:
                      break;
      }
    });
  }

  _handleMore() {
    if(!this._isHosting()) {
      return;
    }

    let eventID = this.props.eventID;

    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Edit Event',
        'Manage Hosts',
        'Delete Event',
        'Cancel'
      ],
      cancelButtonIndex: 3,
      destructiveButtonIndex: 2
    },
    (index) => {
      switch(index) {
              case 0:
                      this.props.navigator.push(Router.eventComposer(this.props.token, eventID));
                      break;
              case 1:
                      this.props.navigator.push(Router.eventHosts(eventID, this.state.hosts, this.props.token));
                      break;
              case 2:
                      Alert.alert(
                        'Are you sure?',
                        'Deleting an event cannot be undone.',
                        [
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'Delete', onPress: () => this._handleDelete(), style: 'destructive'}
                        ]
                      );
                      break;
              default:
                      break;
      }
    });
  }

  _handleDelete() {
    Api.events(this.props.token).destroy(this.props.eventID)
    .then(() => this.props.navigator.pop())
    .then(() => this.props.navigator.props.eventEmitter.emit('destroy-event'))
    .catch(err => console.log("err:", err));
  }

  _style() {
    return [styles.container, {marginTop: this.state.margin}];
  }

  render() {
    let date = moment(this.state.startDate);
    let month = date.format('MMM');
    let day = date.format('D');
    let time = date.format('LT');

    let hosts = this.state.hosts.map((h) => <Text key={h.id} onPress={() => this.props.navigator.push(Router.profile(this.props.token, h.id))}>@{h.username}, </Text>);

    return (
      <View style={this._style()}>
        <View style={styles.header}>
          <View style={styles.coverPhotoContainer}>
            <Image style={styles.coverPhoto} source={{uri: this.state.coverPhotoUri}}>
              <Text style={styles.coverPhotoText}>{this.state.title}</Text>
            </Image>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.dateContainer}>
              <View style={styles.date}>
                <Text style={styles.month}>{month}</Text>
                <Text style={styles.day}>{day}</Text>
              </View>
              {this._rsvp()}
            </View>
            <TouchableHighlight style={styles.info} onPress={() => this.state.margin !== 0 ? this.setState({margin: 0}) : {}} >
              <View style={{flex: 1}}>
                <View style={styles.detail}>
                  <Text style={styles.label}>Hosted by:</Text>
                  <Text style={{flex: 1}}>{hosts}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.label}>Where:</Text>
                  <Text style={{flex: 1}}>{this.state.location}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={{flex: 1}}>{time}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.label}>Ends:</Text>
                  <Text style={{flex: 1}}>{moment(this.state.endDate).format('MMM D, LT')}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.label}>Match:</Text>
                  <Text style={{flex: 1}}>{this.state.match}%</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <SegmentedControlIOS
            ref={c => this.tabBar = c}
            style={styles.tabBar}
            values={['Description', 'Discussion']}
            selectedIndex={this.state.tabIndex}
            tintColor={Colors.base}
            onChange={(event) => {
              this.setState({tabIndex: event.nativeEvent.selectedSegmentIndex});
            }}
          />
        </View>
        {this._tab()}
        <NavBar
          title=""
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={32} /> }
          leftButtonPress={() => this.props.navigator.pop()}
          rightButton={this._moreButton()}
          rightButtonPress={this._handleMore.bind(this)}
          transparent={true}
        />
      </View>
    );
  }

  _isHosting() {
    let user = this.props.navigator.props.user;
    let hosts = this.state.hosts;

    for(let i = 0; i < hosts.length; i++) {
      if(hosts[i].id === user.id) {
        return true;
      }
    }

    return false;
  }
}

EventScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  eventID: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey
  },
  coverPhotoContainer: {
    height: Layout.lines(10)
  },
  coverPhoto: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: Layout.lines(0.5)
  },
  coverPhotoText: {
    color: 'white',
    fontSize: Layout.lines(1.25),
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: Layout.lines(1)
  },
  dateContainer: {
    flex: 1,
    width: Layout.lines(4)
  },
  date: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Layout.lines(0.25),
    borderColor: Colors.base,
    marginBottom: Layout.lines(1)
  },
  month: {
    color: Colors.base
  },
  day: {
    fontSize: Layout.lines(1.5),
    color: Colors.base
  },
  info: {
    flex: 4,
    flexDirection: 'column',
    marginLeft: Layout.lines(1)
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: Layout.lines(0.5)
  },
  label: {
    width: Layout.lines(5),
    fontWeight: 'bold'
  },
  rsvpContainer: {
  },
  rsvp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.lines(0.5),
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.action
  },
  rsvpText: {
    color: 'white'
  },
  tabBar: {
    margin: Layout.lines(1)
  },
  description: {
    flex: 1,
    padding: Layout.lines(1)
  }
});

module.exports = EventScreen;
