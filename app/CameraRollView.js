'use strict';

import React, {
  Component,
  ListView,
  CameraRoll,
  TouchableHighlight,
  Image,
  StyleSheet,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from './Layout';
import Colors from './Colors';

class CameraRollView extends Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = { photos: [], selected: [], ds: ds.cloneWithRows([]), after: undefined };
  }

  componentDidMount() {
    if(this.props.multiple === true) {
      console.warn("CameraRollView: prop 'multiple' has not been fully implemented");
    }

    this._getPhotos();
  }

  _getPhotos() {
    let fetchParams = {
      first: this.props.batchSize
    };

    if(this.state.after != null) {
      fetchParams.after = this.state.after;
    }

    CameraRoll.getPhotos(fetchParams)
    .then(data => this._storePhotos(data))
    .catch(err => this._logError(err));
  }

  _storePhotos(data) {
    const assets = data.edges;
    const newPhotos = assets.map( asset => asset.node.image );
    const page_info = data.page_info;

    let after;

    if(page_info.has_next_page) {
      after = page_info.end_cursor;
    }

    let photos = this.state.photos.concat(newPhotos);

    this.setState({ photos: photos, ds: this.state.ds.cloneWithRows(photos), after: after });
  }

  _logError(err) {
    console.log(err);
  }

  _selectImage(photo) {
    let selected = this.state.selected;

    if(this.props.multiple === true) {
      selected.push(photo);
    } else {
      selected = [photo];
    }

    this.setState({ selected: selected });

    // If we only want one image, then just finish up
    if(this.props.multiple === false) {
      this.props.onFinish(selected);
    }
  }

  _renderImage(photo) {
    return (
      <TouchableHighlight key={photo.uri} onPress={() => this._selectImage(photo)} style={styles.photo}>
        <Image source={{ uri: photo.uri }} style={styles.photo} />
      </TouchableHighlight>
    );
  }

  render() {
    if(this.props.show === false) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.cancel} onPress={this.props.onCancel}>
          <Icon name="close" size={32} color="white"/>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.ds}
          emptySectionHeaders={true}
          onEndReached={() => this._getPhotos()}
          renderRow={(row) => this._renderImage(row)}
          contentContainerStyle={styles.photoGrid}
        />
      </View>
    );
  }
}

CameraRollView.propTypes = {
  batchSize: React.PropTypes.number,
  multiple: React.PropTypes.bool,
  show: React.PropTypes.bool,
  onFinish: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired
};

CameraRollView.defaultProps = {
  batchSize: 24,
  multiple: false,
  show: true
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Layout.lines(4),
    backgroundColor: Colors.darkGrey
  },
  photoGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  photo: {
    width: Layout.lines(6),
    height: Layout.lines(6),
    marginBottom: Layout.lines(1)
  },
  cancel: {
    position: 'absolute',
    right: Layout.lines(1),
    top: Layout.lines(1),
    width: 32,
    height: 32
  }
});

module.exports = CameraRollView;
