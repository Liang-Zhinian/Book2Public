import React, {PureComponent,} from 'react'
import {
    ActivityIndicator,
    AsyncStorage,
    BackHandler,
    BVLinearGradient,
    DeviceEventEmitter,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import AMap3D from './AMap.ios';
import {screen} from "../../common";
import LinearGradient from 'react-native-linear-gradient';
import {CoordinateConverter,regeocodeLocation} from "../../api";
import {commonStyle} from "../../widget/commonStyle";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

type
Props = { navigation: any, };
type
State = {
    discounts: Array < Object >,
    dataList: Array < Object >,
    refreshing: boolean,
}
var colorTemp = screen.colorTemp;;
var address = "";
var Geolocation = require('Geolocation');

export default class AMapSelect extends PureComponent<Props, State> {
    static navigationOptions = ({ navigation }: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            center: null,
            zoom:12.5,
            radius: 5,
            locationSelect: '地图上选点'
        }
    }

    componentDidMount() {

        // DeviceEventEmitter.addListener('amap.onMapClickDone', function (e) {
        //     // 当前位置信息(名称)
        //     this.onFormattedAddressReceived(e.addressName);
        // });

        // DeviceEventEmitter.addListener('onDidMoveByUser', function (e) {
        //     console.warn('onDidMoveByUser--->' + e)
        // });
        DeviceEventEmitter.addListener('amap.onMapClickDone', function (e) {
            // if (!e) return;
            let index = e.addressName.indexOf(",");
            address= (index !== -1)?e.addressName.substr(0,index):e.addressName;
            console.log('onMapClickDone',e.addressName,'address',address)
            // this.props.navigation.state.params.callbackLocation(address.addressName);
        });
    }

    getLatLngLog() {
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error, result) => {
                    if (error || result == null) {
                        this.getPosition();
                    } else {
                        let LatLngLog = JSON.parse(result);
                        this.setState({
                            center: {
                                latitude: parseFloat(LatLngLog[0]),
                                longitude: parseFloat(LatLngLog[1])
                            },
                            radius: parseFloat(LatLngLog[2] * 5),
                            zoom: parseFloat(LatLngLog[3])
                        });
                    }
                }
            );
            AsyncStorage.getItem(
                'LocationSearchKey',
                (error, result) => {
                    if (error) {
                    } else {
                        address = result;
                    }
                }
            )
        } catch (error) {
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度' + error);
        }
    }
    componentWillMount() {
        // if (Platform.OS === 'android') {
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        // }
        this.getLatLngLog();
    }

    componentWillUnmount() {
        // if (Platform.OS === 'android') {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        // }
    }

    /** 获取地理位置（经纬度） */
    getPosition = (): void => {
        Geolocation.getCurrentPosition(location => {
            fetch(CoordinateConverter(location.coords.longitude, location.coords.latitude))
                .then((response) => response.json())
                .then((responseJson) => {
                    let longitude = Number(responseJson.locations.split(',')[0]);
                    let latitude = Number(responseJson.locations.split(',')[1]);
                    // this.regeocodeLocation(longitude,latitude);
                    this.setState({
                        center: {
                            longitude: longitude,
                            latitude: latitude+Math.random()/10000
                        }
                    });
                })
                .catch((error) => {
                    console.warn('请求错误',error);
                });
        }, error => {
            this.interval = setInterval(() => {
                    this.getPosition();
                },
                1000
            );
            setTimeout(()=>{
                this.setState({
                    center: {
                        longitude: 116.404,
                        latitude: 39.915
                    }
                })
            },5000);
            console.warn('There was a problem with obtaining your location: ' + JSON.stringify(error));
        });
        clearInterval(this.interval);
    };
    regeocodeLocation (longitude,latitude) {
        let lo = longitude, la = latitude;
        fetch(regeocodeLocation(longitude,latitude), {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
        })
            .then(resp => {
                return resp.json()
            })
            .then(json => {
                if (json.info != 'OK') return;

                formatted_address = json.regeocode.aois.length > 0 ? json.regeocode.aois[0].name : json.regeocode.addressComponent.township.toString();
                if (Array.isArray(formatted_address) && formatted_address.length == 0) {
                    formatted_address = '';
                }
               address = formatted_address;
                this.props.navigation.state.params.callbackLocationOfMap(formatted_address);
            })
            .catch(error => {
                setTimeout(() => {
                    // this.regeocodeLocation(lo, la);
                }, 10);
            });

    };
    onFormattedAddressReceived = (formatted_address) => {
        address = formatted_address;
        AsyncStorage.setItem('LocationSearchKey',formatted_address);
    };


    onLongPressEvent(){
        let {center,radius,zoom} = this.state;
        this.props.navigation.state.params.callbackLocationOfMap(address,center.latitude,center.longitude,'');
        AsyncStorage.setItem('LatLngLog',JSON.stringify([ center.latitude,center.longitude,(radius / 5).toString(),zoom.toString()]));
    }
    loadAMap(){
        return (
            <View style={styles.sliderStyle}>
                <AMap3D
                    locationEnabled={false}
                    coordinate={this.state.center}
                    ref={component => this._amap = component}
                    onFormattedAddressReceived={this.onFormattedAddressReceived}

                    onMapLoaded={(e) => {
                        console.warn('onMapLoaded--->' + e)
                    }}
                    onLongPressEvent={(e) => {

                        // this.regeocodeLocation(e.longitude,e.latitude);
                        this.setState({
                            center: {
                                latitude: e.latitude,
                                longitude: e.longitude
                            },
                        });
                        this.onLongPressEvent();
                    }}
                />
            </View>
        )
    }
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    render() {
        // console.log('this.state.center',this.state.center)
        let {center} = this.state;
        return (
            <LinearGradient colors={colorTemp}
                            start={{ x:0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                style={styles.linearGradient}>
                {/*<View style={[]}>*/}
                    {/*<View style={{alignItems: 'center', flexDirection: 'row',width:screen.width,marginTop:5,justifyContent:'space-between'}}>*/}
                        {/*<TouchableOpacity style={{*/}
                            {/*zIndex: 999,*/}
                            {/*paddingBottom: 10,*/}
                            {/*paddingTop: 10,*/}
                            {/*paddingRight: 50,*/}
                            {/*paddingLeft:screen.width*0.025*/}
                            {/*}}*/}
                            {/*onPress={() => {*/}
                                {/*this.props.navigation.state.params.callbackLocationOfMap(address,center.latitude,center.longitude,'');*/}
                                {/*this.onLongPressEvent();*/}
                                {/*this.props.navigation.goBack();*/}
                            {/*}}>*/}
                            {/*<Image source={require('../../img/mine/icon_homepage_left_arrow.png')}*/}
                                   {/*style={[commonStyle.searchIcon, {}]}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                {/*</View>*/}
                <View style={commonStyle.Bar}>
                    <TouchableOpacity style={{
                        zIndex: 999,
                        paddingBottom: 10,
                        paddingTop: 10,
                        paddingRight: 50,
                        paddingLeft: screen.width * 0.025
                    }} onPress={() => {
                        this.props.navigation.goBack();//返回按钮图片
                    }}>
                        <Image source={require('../../img/mine/icon_homepage_left_arrow.png')}
                               style={[commonStyle.searchIcon, {}]}/>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={{*/}
                    {/*alignItems: 'center',*/}
                    {/*position: 'absolute',*/}
                    {/*left: 0,*/}
                    {/*right: 0,*/}
                    {/*}}>*/}
                    {/*<Text style={{*/}
                    {/*color: '#ffffff',*/}
                    {/*fontSize: 16,*/}
                    {/*fontFamily: 'arial',*/}
                    {/*}}>BUSINESSES</Text>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity
                        style={{
                            zIndex: 999,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingLeft: 50,
                            paddingRight: screen.width * 0.025,
                        }}
                        onPress={() => {
                            this.props.navigation.state.params.callbackLocationOfMap(address, center.latitude, center.longitude, '');
                            this.onLongPressEvent();
                            this.props.navigation.goBack();
                        }}>
                        <Image source={require('../../img/mine/ico_true.png')}
                               style={[commonStyle.searchIcon, {tintColor: '#fff'}]}/>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        // backgroundColor: '#ff2c33',
                        position: 'absolute',
                        top: screen.statusBarHeight + 70,
                        right: screen.width*0.02,
                        zIndex: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            margin: 10,
                            flexDirection: 'row'
                        }}
                        onPress={() => {
                            this.getPosition();
                        }}
                    >
                        <Image source={require('../../img/nearby/my_location.png')}
                               style={[commonStyle.searchIcon, {tintColor: '#707070'}]}/>
                    </TouchableOpacity>

                </View>
                {center===null?this.showLoading():this.loadAMap()}
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    sliderStyle: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'row',
        width: screen.width
    },

    track: {
        height: 30,
        borderRadius: 30,
        backgroundColor: '#0000005e',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 0.15,
    },
    thumb: {
        width: 40,
        height: 40,
        backgroundColor: '#fFFFFF',
        borderColor: '#909090',
        borderWidth: 5,
        borderRadius: 30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 0.35,
    },

    searchBox: {//搜索框
        width: screen.width * 0.9,
        height: 45,
        borderBottomWidth: 0.3,
        borderBottomColor: 'white',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    searchIcon: {
        width:15,
        height: 15,
    },
    mapImageStyle: {
        flex: 1,
        borderRadius: 45,
    },
    linearGradient: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight,
    },
});