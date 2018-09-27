import React, {Component, PropTypes} from 'react';

import {Geolocation, MapTypes, MapView} from 'react-native-baidu-map';

import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Dimensions from 'Dimensions';

export default class BaiduMapDemo extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })

    constructor() {
        super();

        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 15,
            center: {
                longitude: 113.981718,
                latitude: 22.542449
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            markers: [{
                longitude: 113.981718,
                latitude: 22.542449,
                title: "Window of the world"
            }],
            locationKey:null,
        };
    }

    componentDidMount() {
        // Geolocation.getCurrentPosition()
        //     .then(data => {
        //         console.log(data.city);
        //         this.setState({
        //             zoom: 15,
        //             marker: {
        //                 latitude: data.latitude,
        //                 longitude: data.longitude,
        //                 title: 'Your location'
        //             },
        //             center: {
        //                 latitude: data.latitude,
        //                 longitude: data.longitude,
        //                 rand: Math.random()
        //             }
        //         });
        //     })
        //     .catch(e => {
        //         console.warn(e, 'error');
        //     })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center', flexDirection: 'row', height: 50}}>
                    <TouchableOpacity style={{width: Dimensions.get('window').width * 0.1}} onPress={() => {
                        this.props.navigation.goBack();//返回按钮
                    }}>
                        <Image source={require('../../img/mine/icon_homepage_left_arrow_black.png')}
                               style={[styles.searchIcon, {}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        color: '#ffffff',
                        fontSize: 16,
                        fontFamily: 'arial',
                        width: Dimensions.get('window').width * 0.8,
                        alignItems: 'center',
                    }}>
                        <Text numberOfLines={1} style={{
                            marginLeft: 5, fontSize: 20, fontFamily: 'arial', textAlign: "center"
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: Dimensions.get('window').width * 0.1}} onPress={() => {
                        this.props.navigation.state.params.callback(this.state.locationKey);
                        this.props.navigation.goBack();//返回按钮
                    }}>
                        {/*<Image source={require('../../img/mine/icon_ok.png')}*/}
                               {/*style={[styles.searchIcon, {}]}/>*/}
                    </TouchableOpacity>
                </View>

                <MapView
                    trafficEnabled={this.state.trafficEnabled}
                    baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                    zoom={this.state.zoom}
                    mapType={this.state.mapType}
                    center={this.state.center}
                    marker={this.state.marker}
                    markers={this.state.markers}
                    style={styles.map}
                    radius={0}
                    // fillColor={0x7a888888}
                    // strokeColor={'#5fee52'}
                    // strokeWidth={1}
                    // keyword={''}
                    // onMapClick={(e) => {
                    //     if (e.latitude!=null&&e.longitude!=null) {
                    //         this.setState({
                    //             center: {
                    //                 longitude: e.longitude,
                    //                 latitude: e.latitude
                    //             },
                    //             markers: [{
                    //                 longitude:  e.longitude,
                    //                 latitude: e.latitude,
                    //                 title: ""
                    //             }],
                    //             locationKey:e
                    //         })
                    //     }
                    //
                    //
                    // }}
                    // onMapDoubleClick={
                    //     (e)=>{
                    //         console.log(e)
                    //     }
                    // }
                    // onMapPoiClick={(e) => {
                    //     if (e.latitude!=null&&e.longitude!=null) {
                    //         this.setState({
                    //             center: {
                    //                 longitude: e.longitude,
                    //                 latitude: e.latitude
                    //             },
                    //             markers: [{
                    //                 longitude:  e.longitude,
                    //                 latitude: e.latitude,
                    //                 title: e.name
                    //             }],
                    //             locationKey:e
                    //
                    //         })
                    //     }
                    // }}
                    // onMarkerClick={(e) => {
                    //     console.log(e)
                    //     // if (e.latitude!=null&&e.longitude!=null) {
                    //     //     this.setState({
                    //     //         center: {
                    //     //             longitude: e.longitude,
                    //     //             latitude: e.latitude
                    //     //         },
                    //     //         markers: [{
                    //     //             longitude:  e.longitude,
                    //     //             latitude: e.latitude,
                    //     //             title: e.name
                    //     //         }]
                    //     //     })
                    //     // }
                    // }}

                >
                    {/*<View>*/}
                    {/*<Text>*/}
                        {/*hello*/}
                    {/*</Text>*/}
                    {/*</View>*/}
                </MapView>

                {/*<View style={styles.row}>*/}

                {/*<Button style={styles.btn} title="Locate" onPress={() => {//当前定位*/}
                {/*console.warn('center', this.state.center);*/}
                {/*Geolocation.getCurrentPosition()*/}
                {/*.then(data => {*/}
                {/*console.warn(JSON.stringify(data));*/}
                {/*this.setState({*/}
                {/*zoom: 15,*/}
                {/*marker: {*/}
                {/*latitude: data.latitude,*/}
                {/*longitude: data.longitude,*/}
                {/*title: 'Your location'*/}
                {/*},*/}
                {/*center: {*/}
                {/*latitude: data.latitude,*/}
                {/*longitude: data.longitude,*/}
                {/*rand: Math.random()*/}
                {/*}*/}
                {/*});*/}
                {/*})*/}
                {/*.catch(e => {*/}
                {/*console.warn(e, 'error');*/}
                {/*})*/}
                {/*}}/>*/}
                {/*</View>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        height: 40
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 72,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        alignSelf: 'flex-start',
    },
});
