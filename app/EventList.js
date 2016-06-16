'use strict';

import React, {
  Component,
  ActionSheetIOS,
  StyleSheet,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

import ActionButton from './ActionButton';
import EventRow from './EventRow';

class EventList extends Component {
  constructor(props) {
    super(props);


    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { events: [], dataSource: ds.cloneWithRows([]), page: 0, isRefreshing: false, showFilters: false };
  }

  componentDidMount() {
    let parentNav = this.props.navigator.props.parentNavigator;
    this.parentNav = parentNav != null ? parentNav : this.props.navigator;

    this.getEvents(true);
    this.eventCreate = this.props.navigator.props.eventEmitter.addListener('create-event', () => this.getEvents(true));
    this.eventDestroy = this.props.navigator.props.eventEmitter.addListener('destroy-event', () => this.getEvents(true));
  }

  componentWillUnmount() {
    try {
      this.eventCreate.remove();
      this.eventDestroy.remove();
    } catch(e) {
      console.log("err:", e);
    }
  }

  getEvents(refresh = false) {
    var page = refresh ? 0 : this.state.page + 1;

    let api = () => Api.events(this.props.token).list(page);

    if(this.props.subscriptions === true) {
      api = () => Api.events(this.props.token).listSubscriptions(page);
    }

    api().then(events => refresh ? events : this.state.events.concat(events).filter((m) => m !== null) ) // either refresh the items or append them
    .then(events => this.setState({
      events: events,
      dataSource: this.state.dataSource.cloneWithRows(events),
      page: page,
      isRefreshing: false
    }))
    .catch(err => console.log("error:", err));
  }

  _handleCreate() {
    this.parentNav.push(Router.eventComposer(this.props.token));
  }

  _renderRow(event) {
    return (
      <EventRow
        eventID={event.id}
        title={event.title}
        startDate={event.start_date}
        endDate={event.end_date}
        location={event.location}
        match={event.match}
        hosts={event.hosts}
        rsvp={event.rsvp}
        coverPhotoUri={event.cover_photo_url}
        onPress={() => this.parentNav.push(Router.eventScreen(event.id, this.props.token)) }
        onRSVP={this._actionSheet(event.id).bind(this)}
      />
    );
  }

  _searchFilters() {
    if(this.state.showFilters === true) {
      return (
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeader}>Search Parameters</Text>
        </View>
      );
    }
  }

  _actionSheet(eventID) {
    return () => {
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
                        this._updateRSVP(eventID, "going");

                        Api.events(this.props.token).going(eventID)
                        .then((resp) => console.log(resp))
                        .catch(err => console.log("err:", err));
                        break;
                case 1:
                        this._updateRSVP(eventID, "maybe");

                        Api.events(this.props.token).maybe(eventID)
                        .then((resp) => console.log(resp))
                        .catch(err => console.log("err:", err));
                        break;
                case 2:
                        this._updateRSVP(eventID, "");

                        Api.events(this.props.token).unsubscribe(eventID)
                        .then((resp) => console.log(resp))
                        .catch(err => console.log("err:", err));
                        break;
                default:
                        break;
        }
      });
    };
  }

  _nothing() {
    if(this.state.events.length < 1) {
      return <Text>Nothing to show!</Text>;
    }

    return <View />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this._searchFilters()}
        {this._nothing()}
        <ListView
          contentContainerStyle={{paddingTop: Layout.lines(1)}}
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          onEndReached={() => this.getEvents()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.getEvents(true);
                this.setState({isRefreshing: true});
              }}
              tintColor="rgb(191,191,191)"
              title="Loading..."
            />
          }
        />
        <ActionButton icon="add" onPress={this._handleCreate.bind(this)} />
      </View>
    );
  }

  _updateRSVP(eventID, rsvp) {
    // goddamn deep copy...
    let events = JSON.parse(JSON.stringify(this.state.events)).map(e => {
      if(e.id === eventID) {
        e.rsvp = rsvp;
      }

      return e;
    });

    this.setState({events: events, dataSource: this.state.dataSource.cloneWithRows(events)});
  }
}

EventList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  subscriptions: React.PropTypes.bool
};

EventList.defaultProps = {
  subscriptions: false
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: Layout.lines(0.75)
  },
  filterContainer: {
    backgroundColor: Colors.baseDark,
    padding: Layout.lines(1),
    marginHorizontal: -Layout.lines(0.75)
  },
  filterHeader: {
    color: 'white'
  }
});

module.exports = EventList;
