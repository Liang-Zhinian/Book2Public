import React, {Component, ErrorUtils} from 'react'
import {DeviceEventEmitter, Alert, StyleSheet, Text, TouchableOpacity, View, Image, processColor} from 'react-native'
import {MapView} from 'react-native-amap3d'
import Spinner from '../Common/Spinner';
import {regeocodeLocation} from "../../api";
import screen from "../../common/screen";

var Geolocation = require('Geolocation');


const styles = StyleSheet.create({
    customIcon: {
        width: 40,
        height: 40,
    },
    customInfoWindow: {
        backgroundColor: '#8bc34a',
        padding: 10,
        borderRadius: 10,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#689F38',
        marginBottom: 5,
    },
    customMarker: {
        backgroundColor: '#ffffff00',
        alignItems: 'center',
        borderRadius: 5,
        padding: 5,

    },
    markerIcon: {
        width: 25,
        height: 25,
        color: '#eeeeee'
    },
    markerText: {
        color: '#fff',
    },
})

export default class AMap3D extends Component {
    static navigationOptions = {
        title: '添加标记',
    };

    static defaultProps = {
        zoomEnabled: true,
        scrollEnabled: true,
    };
    state = {
        isLoading: true,
        time: new Date(),
        zoomEnabled: true,
        scrollEnabled: true,
        rotateEnabled: false,
        tiltEnabled: false,
        locationEnabled: true,
        showsCompass: false,
        showsScale: true,
        showsZoomControls: true,
        showsLocationButton: false,
        logs: [],
        coordinate: {
            latitude: 0,
            longitude: 0,
        },
        region: {
            longitudeDelta: 0,
            latitudeDelta: 0,
            latitude: 0,
            longitude: 0,
        },
        formatted_address: '',
        markerKey: null,
        markerIndex: null,
    };

    selectedAddress = '';
    language = 'EN'; // or 'CN'

    componentDidMount() {

        this.mounted = true;
        setInterval(() => {
            if (this.mounted) {
                this.setState({time: new Date()})
            }
        }, 1000)


    }

    componentWillUnmount() {
        this.mounted = false
    }

    _coordinates = [
        {
            latitude: 39.806901,
            longitude: 116.397972,
        },
        {
            latitude: 39.806901,
            longitude: 116.297972,
        },
        {
            latitude: 39.906901,
            longitude: 116.397972,
        },
        {
            latitude: 39.706901,
            longitude: 116.397972,
        },
    ];


    _log(event, data) {
        this.setState({
            logs: [
                {
                    key: Date.now(),
                    time: new Date().toLocaleString(),
                    event,
                    data: JSON.stringify(data, null, 2),
                },
                ...this.state.logs,
            ],
        })
    }

    _logPressEvent = ({nativeEvent}) => {
        this._log('onPress', nativeEvent)
    };
    _logLongPressEvent = ({nativeEvent}) => this._log('onLongPress', nativeEvent);
    _logLocationEvent = ({nativeEvent}) => this._log('onLocation', nativeEvent);

    render() {
        if (this.state.isLoading) {
            <Spinner/>
        }

        let languageCode = 1;
        let language = this.props.language || this.language;
        if (language.toUpperCase() == 'CN') {
            languageCode = 0
        }

        return (
            <MapView style={[StyleSheet.absoluteFill,this.props.style]}
                     language={languageCode}
                     coordinate={this.props.coordinate}
                     locationInterval={10000}
                     zoomLevel={this.props.zoomLevel}
                     zoomEnabled={this.props.zoomEnabled}
                     scrollEnabled={this.props.scrollEnabled}
                     rotateEnabled={this.state.rotateEnabled}
                     tiltEnabled={this.state.tiltEnabled}
                     locationEnabled={this.state.locationEnabled}
                     onLocation={this._onLocationEvent}
                     showsCompass={this.state.showsCompass}
                     showsScale={this.state.showsScale}
                     showsLocationButton={this.state.showsLocationButton}
                     showsZoomControls={false}
                     onPress={this._onPressEvent}
                     onLongPress={this._onLongPressEvent}
                     region={this.props.region}
                     onStatusChangeComplete={({nativeEvent}) => {
                         this.props._onStatusChangeComplete && this.props._onStatusChangeComplete();
                         this.setState({
                             region: {
                                 longitudeDelta: nativeEvent.longitudeDelta,
                                 latitudeDelta: nativeEvent.latitudeDelta,
                                 ...this.props.coordinate
                             }
                         });
                         // console.log('onStatusChangeComplete Delta', nativeEvent)
                     }}
                     onReGeocodeSearchCompleteIOS={({nativeEvent}) => {
                         console.log(nativeEvent)
                         DeviceEventEmitter.emit('amap.onMapClickDone', {addressName: nativeEvent.title})
                     }}
            >
                {this.props.coordinate &&
                <MapView.Marker
                    infoWindowDisabled={true}
                    // active
                    draggable
                    key={'marker_chosen_location'}
                    icon={() => (
                        <View style={styles.customMarker}>
                            <Image source={require('../../img/nearby/location.png')}
                                   style={[styles.markerIcon, {tintColor: '#019eff', resizeMode: 'contain',}]}/>
                        </View>
                    )}
                    // title={this.state.formatted_address || "Your chosen location"}
                    // description={this.state.time.toLocaleTimeString()}
                    // onPress={this._onMarkerPress}
                    onDragEnd={this._onDragEvent}
                    // onInfoWindowPress={this._onInfoWindowPress}
                    coordinate={this.props.coordinate}
                />
                }
                {this._generateMarkers(this.props.coordinates)}
                {
                    this.props.circle && this.props.circle.enabled && <MapView.Circle
                        strokeWidth={screen.onePixel}
                        // strokeWidth={StyleSheet.hairlineWidth}
                        strokeColor="rgba(0, 0, 0, 0.9)"
                        fillColor="rgba(0, 0, 255, 0.15)"
                        radius={this.props.circle.radius || 10000}
                        coordinate={this.props.coordinate}
                    />
                }
            </MapView>
        )
    }

    //#region events
    _onMarkerPress = (key) => {
        this.props.onMarkerPress && this.props.onMarkerPress(key);
    }
    _onInfoWindowPress = () => {
        //Alert.alert('onInfoWindowPress')
    }

    _onDragEvent = ({nativeEvent}) => {
        // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);
    }

    _onPressEvent = ({nativeEvent}) => {
        this._logPressEvent(nativeEvent);
        if (!nativeEvent.longitude || !nativeEvent.latitude) return;
        // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);
        this.props.onPressEvent && this.props.onPressEvent();
    }

    _onLongPressEvent = ({nativeEvent}) => {
        this._logLongPressEvent(nativeEvent);
        this._setCoordinate(nativeEvent);
        // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);
        // let formatted_address = regeocodeLocation(nativeEvent.longitude, nativeEvent.latitude);
        // console.log(formatted_address)
        // this.props.onFormattedAddressReceived(formatted_address);
        this.props.onLongPressEvent && this.props.onLongPressEvent(nativeEvent);

        // this.setState({locationEnabled: false});
    };

    //
    fetching = false;
    _onLocationEvent = ({nativeEvent}) => {


        // if (this.props.coordinate.latitude == 0 &&
        //     this.props.coordinate.longitude == 0) {
        //     this._setCoordinate(nativeEvent);
        this.setState({
            coordinate: {
                latitude: nativeEvent.latitude,
                longitude: nativeEvent.longitude,
            }
        })
        // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);
        // let formatted_address = regeocodeLocation(nativeEvent.longitude, nativeEvent.latitude);
        // this.props.onFormattedAddressReceived(formatted_address);
        // }

        // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);

        // t2 = new Date();

        // this._setCoordinate(nativeEvent);
        //
        // this._log('onLocation', nativeEvent);
        //

        // if (!this.fetching) {
        //     this.fetching = true
        //     if (!this.state.formatted_address) {
        //         // this._setCoordinate(nativeEvent);
        //         // this._regeocode(nativeEvent.longitude, nativeEvent.latitude);
        //         let formatted_address = regeocodeLocation(nativeEvent.longitude, nativeEvent.latitude);
        //         this.props.onFormattedAddressReceived(formatted_address);
        //     }
        //
        //     setTimeout(()=>{
        //         this.fetching = false
        //     }, 5000);
        // }

    }

    //#endregion

    _generateMarkers = (coordinates) => {
        if (!coordinates) return;
        let markers = [];
        for (let i = 0; i < coordinates.length; i++) {
            markers.push(this._generateMarker(coordinates[i], i, i));
        }
        return markers;
    };

    _scrollToMarker(index) {
        this.setState({markerKey: index});
    }

    _generateMarker = (coordinate, key, index) => {
        if (!coordinate) return;
        let tintColor = '#ff1d9f';
        this.state.markerKey === key ? tintColor = '#ff820b' : tintColor;
        return <MapView.Marker
            infoWindowDisabled={true}
            // title={coordinate.title || 'Your chosen location'}
            description={coordinate.title || this.state.time.toLocaleTimeString()}
            icon={() => (
                <View style={styles.customMarker}>
                    <Image source={require('../../img/nearby/location.png')}
                           style={[styles.markerIcon, {tintColor: tintColor, resizeMode: 'contain', zIndex: 90,}]}/>
                </View>
            )}
            key={key}
            onPress={() => {
                this.setState({
                    markerKey: key,
                    // markerIndex: index
                });
                this._onMarkerPress(index);
            }}
            onDragEnd={this._onDragEvent}
            onInfoWindowPress={this._onInfoWindowPress}
            coordinate={{latitude: coordinate.latitude, longitude: coordinate.longitude}}
        >{coordinate.markerInfoWindow}</MapView.Marker>
    }

    _setCoordinate = (nativeEvent) => {
        const props = {...this.props}

        // if (nativeEvent.latitude == null ||
        //   nativeEvent.longitude == null ||
        //   (this.props.coordinate &&
        //     nativeEvent.latitude == this.props.coordinate.latitude &&
        //     nativeEvent.longitude == this.props.coordinate.longitude))
        //   return;
        if (props.coordinate) {
            if (props.coordinate.latitude && props.coordinate.longitude) {
                this.setState({
                    isLoading: false,
                    coordinate: {
                        latitude: props.coordinate.latitude,
                        longitude: props.coordinate.longitude,
                    }
                })
            }
        }
        // this.setState({
        //   isLoading: false,
        //   coordinate: {
        //     latitude: nativeEvent.latitude,
        //     longitude: nativeEvent.longitude,
        //   }
        // })
    }


    _regeocode = (longitude, latitude) => {
        let lo = longitude, la = latitude;
        let that = this;
        const api = 'http://restapi.amap.com/v3/geocode/regeo';
        const location = `${longitude},${latitude}`;
        const key = 'ee020207116b9d61aebdb6f08d9a319f';
        const url = `${api}?output=json&location=${location}&key=${key}&radius=1000&extensions=all`;
        fetch(url, {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
        })
            .then(resp => {
                return resp.json()
            })
            .then(json => {
                if (json.info != 'OK') return;

                var formatted_address = json.regeocode.aois.length > 0 ? json.regeocode.aois[0].name : json.regeocode.addressComponent.township.toString();

                if (Array.isArray(formatted_address) && formatted_address.length == 0) {
                    formatted_address = '';
                }
                that.setState({formatted_address});

                that.props.onFormattedAddressReceived(formatted_address);
                // that.fetching = false
                // t2 = new Date();
            })
            .catch(error => {
                setTimeout(() => {
                    this.regeocodeLocation(lo, la);
                }, 10);
            });
    }
}
