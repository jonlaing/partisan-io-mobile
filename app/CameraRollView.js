'use strict';

import React, {
  Component,
  ScrollView,
  CameraRoll,
  TouchableHighlight,
  Image,
  StyleSheet,
  View
} from 'react-native';

import Layout from './Layout';
import Colors from './Colors';

class CameraRollView extends Component {
  constructor(props) {
    super(props);

    this.state = { photos: [], selected: [], after: undefined };
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

    if(this.state.after !== undefined) {
      fetchParams.after = this.state.after;
    }

    CameraRoll.getPhotos(fetchParams, this._storePhotos.bind(this), this._logError.bind(this));
  }

  _storePhotos(data) {
    const assets = data.edges;
    const photos = assets.map( asset => asset.node.image );
    this.setState({ photos: photos });
  }

  _logError(err) {
    console.log(err);
  }

  _selectImage(uri) {
    let selected = this.state.selected;

    if(this.props.multiple === true) {
      selected.push(uri);
    } else {
      selected = [uri];
    }

    this.setState({ selected: selected });

    // If we only want one image, then just finish up
    if(this.props.multiple === false) {
      this.props.onFinish(selected);
    }
  }

  _renderImage(photo) {
    return (
      <TouchableHighlight key={photo.uri} onPress={() => this._selectImage(photo.uri)}>
        <Image source={{ uri: photo.uri }} style={styles.photo} />
      </TouchableHighlight>
    );
  }

  render() {
    if(this.props.show === false) {
      return <View />;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.photoGrid}>
          { this.state.photos.map(photo => this._renderImage(photo) ) }
        </View>
      </ScrollView>
    );
  }
}

CameraRollView.propTypes = {
  batchSize: React.PropTypes.number,
  multiple: React.PropTypes.bool,
  show: React.PropTypes.bool,
  onFinish: React.PropTypes.func.isRequired
};

CameraRollView.defaultProps = {
  batchSize: 25,
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
    paddingTop: Layout.lines(2),
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
  }
});

module.exports = CameraRollView;
