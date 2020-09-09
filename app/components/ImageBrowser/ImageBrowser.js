import * as MediaLibrary from 'expo-media-library';

import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import React from 'react';
import ImageTile from './ImageTile';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default class ImageBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            selected: [],
            after: null,
            hasNextPage: true,
            badgeColor: this.props.badgeColor ? this.props.badgeColor : '#007aff',
        };
    }

    componentDidMount() {
        this.getPhotos();
    }

    selectImage = index => {
        let newSelected = Array.from(this.state.selected);

        if (newSelected.indexOf(index) === -1) {
            newSelected.push(index);
        } else {
            const deleteIndex = newSelected.indexOf(index);
            newSelected.splice(deleteIndex, 1);
        }

        if (newSelected.length > this.props.max) return;
        if (newSelected.length === 0) newSelected = [];

        this.setState({ selected: newSelected });
    };

    getPhotos = () => {
        let params = { first: 500, sortBy: MediaLibrary.SortBy.creationTime };
        if (this.state.after) params.after = this.state.after;
        if (!this.state.hasNextPage) return;
        MediaLibrary.getAssetsAsync(params).then(assets => {
            this.processPhotos(assets);
        });
    };

    processPhotos = assets => {
        if (this.state.after === assets.endCursor) return;

        let displayAssets;
        if (this.props.mediaSubtype == null) {
            displayAssets = assets.assets;
        } else {
            displayAssets = assets.assets.filter(asset => {
                return asset.mediaSubtypes.includes(this.props.mediaSubtype);
            });
        }

        this.setState({
            photos: [...this.state.photos, ...displayAssets],
            after: assets.endCursor,
            hasNextPage: assets.hasNextPage,
        });
    };

    getItemLayout = (data, index) => {
        let length = width / 4;
        return { length, offset: length * index, index };
    };

    prepareCallback = () => {
        let { selected, photos } = this.state;
        const selectedPhotos = selected.map(i => photos[i]);
        const assetsInfo = Promise.all(selectedPhotos.map(i => MediaLibrary.getAssetInfoAsync(i)));
        this.props.callback(assetsInfo);
    };

    renderHeader = () => {
        let selectedCount = this.state.selected.length;

        let headerText = `${selectedCount} ${
            this.props.headerSelectText ? this.props.headerSelectText : 'Selected'
            }`;
        if (selectedCount === this.props.max) headerText = headerText + ' (Max)';
        const headerCloseText = this.props.headerCloseText ? this.props.headerCloseText : 'Close';
        const headerDoneText = this.props.headerDoneText ? this.props.headerDoneText : 'Done';
        // const headerButtonColor = this.props.headerButtonColor ? this.props.headerButtonColor : '#007aff';

        return (
            <View style={styles.header}>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 10,
                        fontSize: 20,
                        paddingVertical: 5,
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                    onPress={() => {
                        console.log('BEFORE EMPTY');
                        return this.props.callback(Promise.resolve([]));
                    }}>
                    <Text>{headerCloseText}</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>{headerText}</Text>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 10,
                        fontSize: 16,
                        paddingVertical: 5,
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                    onPress={() => {
                        console.log('BEFORE PREPARE');
                        return this.prepareCallback();
                    }}>
                    <Text >{headerDoneText}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderImageTile = ({ item, index }) => {
        const selected = this.state.selected.indexOf(index) !== -1;
        const selectedItemCount = this.state.selected.indexOf(index) + 1;

        return (
            <ImageTile
                item={item}
                selectedItemCount={selectedItemCount}
                index={index}
                camera={false}
                selected={selected}
                selectImage={this.selectImage}
                badgeColor={this.state.badgeColor}
            />
        );
    };

    renderLoading = () => {
        return (
            <View style={styles.emptyContent}>
                <ActivityIndicator
                    size="large"
                    color={this.props.loadingColor ? this.props.loadingColor : '#bbb'}
                />
            </View>
        );
    };

    renderEmpty = () => {
        return (
            <View style={styles.emptyContent}>
                <Text style={styles.emptyText}>
                    {this.props.emptyText ? this.props.emptyText : 'No image'}
                </Text>
            </View>
        );
    };

    renderImages = () => {
        return (
            <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={this.state.photos}
                numColumns={4}
                renderItem={this.renderImageTile}
                keyExtractor={(_, index) => index}
                onEndReached={() => {
                    this.getPhotos();
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={this.renderEmpty}
                initialNumToRender={24}
                getItemLayout={this.getItemLayout}
            />
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    {this.renderHeader()}
                    {this.renderImages()}
                </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 50,
    },
    headerText: {
        fontSize: 16,
        lineHeight: 19,
    },
    emptyContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#bbb',
        fontSize: 20,
    },
});