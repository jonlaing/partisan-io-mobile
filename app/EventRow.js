'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text
} from 'react-native';

import moment from 'moment';

import Layout from './Layout';
import Colors from './Colors';

export default class EventRow extends Component {
  _header() {
    if(this.props.coverPhotoUri.length > 0) {
      return (
        <Image style={styles.coverPhoto} resizeMode="cover" source={{uri: this.props.coverPhotoUri}}>
          <Text style={styles.coverPhotoText}>{this.props.title}</Text>
        </Image>
      );
    }

    return <Text>{this.props.title}</Text>;
  }

  _rsvp() {
    if(this.props.rsvp === "host") {
      return (
        <View style={styles.rsvpContainer}>
          <View style={styles.rsvp}>
            <Text style={styles.rsvpText}>Hosting</Text>
          </View>
        </View>
      );
    }

    let rsvp = this.props.rsvp === "" ? "RSVP" : this.props.rsvp.charAt(0).toUpperCase() + this.props.rsvp.substr(1);

    return (
      <View style={styles.rsvpContainer}>
        <TouchableHighlight style={styles.rsvp} onPress={this.props.onRSVP}>
          <Text style={styles.rsvpText}>{rsvp}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    let date = moment(this.props.startDate);
    let month = date.format('MMM');
    let day = date.format('D');
    let time = date.format('LT');

    let hosts = `@${this.props.hosts.map(u => u.username).join(", @")}`;


    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.onPress}>
          {this._header()}
        </TouchableHighlight>
        <View style={styles.infoContainer}>
          <View style={styles.dateContainer}>
            <View style={styles.date}>
              <Text style={styles.month}>{month}</Text>
              <Text style={styles.day}>{day}</Text>
            </View>
            {this._rsvp()}
          </View>
          <TouchableHighlight style={{flex: 4}} onPress={this.props.onPress}>
            <View style={styles.info}>
              <View style={styles.detail}>
                <Text style={styles.label}>Hosted by:</Text>
                <Text style={{flex: 1}}>{hosts}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Where:</Text>
                <Text style={{flex: 1}}>{this.props.location}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Time:</Text>
                <Text style={{flex: 1}}>{time}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Match:</Text>
                <Text style={{flex: 1}}>{this.props.match}%</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

EventRow.propTypes = {
  eventID: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  startDate: React.PropTypes.string.isRequired,
  endDate: React.PropTypes.string.isRequired,
  rsvp: React.PropTypes.string.isRequired,
  location: React.PropTypes.string,
  coverPhotoUri: React.PropTypes.string,
  onPress: React.PropTypes.func,
  onRSVP: React.PropTypes.func
};

EventRow.defaultProps = {
  location: "Everywhere",
  coverPhotoUri: "",
  onPress: () => {},
  onRSVP: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: Layout.lines(1),
    borderRadius: Layout.lines(0.25),
    overflow: 'hidden'
  },
  coverPhoto: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: Layout.lines(6),
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
    flex: 1,
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
  }

});

module.exports = EventRow;
