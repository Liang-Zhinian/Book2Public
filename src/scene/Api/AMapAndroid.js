/*
 * A smart AMap Library for react-native apps
 * https://github.com/react-native-component/react-native-smart-amap/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */

import React, {Component,} from 'react'
import {findNodeHandle, NativeModules, Platform, requireNativeComponent, View} from 'react-native'
import PropTypes from 'prop-types'

const AMapManager = Platform.OS == 'ios' ? null : NativeModules.AMapModule

export default class AMapAndroid extends Component {

    static constants = {}

    static defaultProps = {
        //mapType: 0,
        //showTraffic: false,
        //showsUserLocation: true,
    }

    static propTypes = {
        ...View.propTypes,
        options: PropTypes.shape({
            centerCoordinate: PropTypes.shape({
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired,
            }),
            zoomLevel: PropTypes.number,
            centerMarker: PropTypes.string,
            radius:PropTypes.number,
        }).isRequired,

        params:PropTypes.shape({
            types:PropTypes.string,
            keywords:PropTypes.string,
            offset:PropTypes.number,
            page:PropTypes.number,
            coordinate:PropTypes.shape({
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired,
            }),
            radius:PropTypes.number,
        }),


        onDidMoveByUser: PropTypes.func,
        onMapLongClick: PropTypes.func,//长按地图
        onMapLoaded: PropTypes.func,//加载完成
        onMapClick: PropTypes.func,//点击地图
        onMarkerClick:PropTypes.func,//点击标记
        zoomControls: PropTypes.bool,///显示缩放按钮
        zoomGestures: PropTypes.bool,//手势缩放
        scaleControls: PropTypes.bool,///比例尺
        compassEnable: PropTypes.bool,///指南针
        myLocation:PropTypes.bool,
        stroke_color: PropTypes.number,//边框颜色
        fill_color: PropTypes.number,//填充颜色
        radius:PropTypes.number,//半径
        strokeWidth:PropTypes.number,//边框宽度
        MapLanguage:PropTypes.string,
        testDataFromJson:PropTypes.string,//testData
    }

    constructor(props) {
        super(props)
        this.state = {
            // compassEnable: false,
            // scaleControls: false,
            // zoomGestures: false,
            // zoomControls: false,
        }
    }


    _onChange(event) {
        if (typeof this.props[event.nativeEvent.type] === 'function') {
            this.props[event.nativeEvent.type](event.nativeEvent.params);
        }
    }


    // static defaultProps = {
    //     zoomControlsVisible: true,
    //     trafficEnabled: false,
    //     baiduHeatMapEnabled: false,
    //     mapType: MapTypes.NORMAL,
    //     childrenPoints: [],
    //     marker: null,
    //     markers: [],
    //     center: null,
    //     zoom: 10,
    //     radius: 500,
    //     fillColor: 0x7a888888,
    //     strokeColor: '#5fee52',
    //     strokeWidth: 1,
    //     keyword: ''
    // };


    render() {
        return (
            <NativeAMap
                {...this.props}
                onChange={this._onChange.bind(this)}
                // onSearch={this.searchPoiByCenterCoordinate.bind(this)}
            />
        )
    }
    componentDidMount() {

        // DeviceEventEmitter.addListener('amap.onMapClickDone', function (e) {
        //     // handle event.
        //     console.warn(e)
        // });
    }
    static setOptions(options) {
        AMapManager.setOptions(findNodeHandle(this), options)
    }

   static searchPoiByCenterCoordinate(params) {
        AMapManager.searchPoiByCenterCoordinate(params) //传null为默认参数配置
    }

    static setCenterCoordinate(coordinate) {
        //console.log('findNodeHandle => ')
        //console.log(findNodeHandle)
        AMapManager.setCenterCoordinate(findNodeHandle(this), coordinate)
    }
}

const NativeAMap = Platform.OS == 'ios' ? View : requireNativeComponent('RCTAMapView', AMapAndroid)
// const NativeAMapModule = Platform.OS == 'ios' ? View : requireNativeComponent('AMapModule', AMapAndroid)
