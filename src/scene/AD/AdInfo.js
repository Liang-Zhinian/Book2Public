
/*
广告详情页面
 */
import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    BVLinearGradient,
    Clipboard,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import ActionSheet from '../Common/ActionSheet'
import {groupPurchaseDetailWithLOLA} from "../../api";

var Geolocation = require('Geolocation');


export default class AdInfo extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })

//弹出底部菜单
    showActionSheet() {
        this.actionsheet.show();
    }

//  拷贝商家地址
    clickedCopyAddress() {
        Clipboard.setString('9 Shelter Street Causeway Bay');
    }

// 定位商家
    clickedOpenInMaps() {
        var shopLocation = '香港特別行政區灣仔區信德街9-11号';
        Linking.canOpenURL('androidamap://viewMap?sourceApplication=appname&poiname=' + shopLocation + '&lat=36.2&lon=116.1&dev=0').then(supported => {
            if (supported) {
                Linking.openURL('androidamap://viewMap?sourceApplication=appname&poiname=' + shopLocation + '&lat=36.2&lon=116.1&dev=0');
            } else {
                // toastShort(`请先安装XXX`);
                alert('Please install Amap');
            }
        });
    }

//  导航路线
    clickedOpenDirectons() {

        Linking.canOpenURL('androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=114.193526&dlat=22.276519').then(supported => {
            if (supported) {
                Linking.openURL('androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=114.193526&dlat=22.276519');
            } else {
                // toastShort(`请先安装XXX`);
                alert('Please install Amap');
            }
        });
    }


    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            locationTemp: null,
            location: {},
            loc: '定位中...',
        }
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            location => {
                fetch(groupPurchaseDetailWithLOLA(location.coords.latitude, location.coords.longitude))
                    .then((res) => {
                        return res.json()
                    })
                    .then(json => {
                        if (json.status != 302) {
                            this.setState({location: json.result.addressComponent, isLoading: false})
                        } else {
                            var loc = {
                                city: '定位中...',
                            };
                            this.setState({location: loc, isLoading: false})
                        }
                    })

            },
            error => {
                // Alert.alert(
                //     '定位未开启',
                //     '请开启GPS',
                //     [
                //         {text: 'OK', onPress: () => console.log('OK Pressed')},
                //     ],
                //     {cancelable: false}
                // )
            },
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{alignItems: 'center', flexDirection: 'row', height: 50}}>
                    <TouchableOpacity style={{width: Dimensions.get('window').width * 0.1}} onPress={() => {
                        this.props.navigation.goBack();
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
                        }}>Trial Class($100/class,Max 5 classes in 14 Days)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: Dimensions.get('window').width * 0.1}} onPress={() => {
                    }}>
                        <Image source={require('../../img/mine/icon_share.png')}
                               style={{
                                   backgroundColor: 'transparent',
                                   width: 20,
                                   height: 20,
                                   marginRight: 5,
                                   alignSelf: 'flex-end',
                               }}/>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.container}
                            showsHorizontalScrollIndicator={true}>
                    <TouchableHighlight onPress={() => {
                        this.showActionSheet();
                    }}>
                        <Image source={require('../../img/order/OnClickRotate2(SAMPLE)_cutads.png')}
                               style={{
                                   width: Dimensions.get('window').width,
                                   // resizeMode: 'cover',
                                   resizeMode: 'contain',
                                   flex: 1,
                               }}
                        />
                    </TouchableHighlight>
                </ScrollView>
                <LinearGradient colors={['#F87C00', '#E96522', '#D94A3B']} start={{x: 1, y: 0}} end={{x: 0, y: 0}}
                                style={styles.linearGradient}>
                    <TouchableHighlight style={{
                        height: 60,
                        bottom: 0,
                        width: Dimensions.get('window').width,
                        // paddingRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'arial',
                            textAlign: "center",
                            color: '#ffffff'
                        }}>BUY</Text>
                    </TouchableHighlight>
                </LinearGradient>
                <ActionSheet
                    mainTitle="HONG KONG"
                    itemTitles={["Copy Address", "Open in Maps", "Open Directions",]}
                    selectionCallbacks={[this.clickedCopyAddress.bind(this), this.clickedOpenInMaps.bind(this), this.clickedOpenDirectons.bind(this)]}
                    itemTitleColor='#006FFF'
                    mainTitleTextAlign='center'
                    contentBackgroundColor='#EFF0F1'
                    cancelTitleColor='#FE2701'
                    cancelVerticalSpace={5}
                    borderRadius={5}
                    sideSpace={6}
                    bottomSpace={30}//底部间距
                    ref={(actionsheet) => {
                        this.actionsheet = actionsheet
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        alignSelf: 'flex-start',
    },
});