/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

/*
*/
import React, {Component} from 'react';
import {DeviceEventEmitter, Dimensions, Platform, StyleSheet, View} from 'react-native';
// import EZSideMenu from './EZSideMenu'
import {commonStyle} from "../../widget/commonStyle";
import AMapAndroid from "../Api/AMapAndroid";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const DEVICE_SCREEN = Dimensions.get('window');

export default class ContactScene extends Component<{}> {

    componentDidMount() {

        DeviceEventEmitter.addListener('amap.onMapClickDone', function (e) {
            console.log('onMapClickDone',e)
        });
    }
    render() {
      return(
          <View>
              <AMapAndroid
                  style={[commonStyle.mapImageStyle,{height:600}]}
                  ref={component => this._amap = component}
                  options={{
                      centerCoordinate: {
                          //113.23	23.16
                          longitude:113.23,
                          latitude:  23.16
                          // longitude: 0.00005077,
                          // latitude: 51.50329
                      },
                      radius: 0,
                      zoomLevel: 18,//缩放比例级别
                  }}
                  zoomGestures={true}
                  scaleControls={true}
                  MapLanguage={"en"}
                  fill_color={0x7a888888}
                  // onMapClick={() => {
                  //     this.showActionSheet();
                  // }}
              />
          </View>
      )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    button: {
        width: 44,
        height: 44
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
