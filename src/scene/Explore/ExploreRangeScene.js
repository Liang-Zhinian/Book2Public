/*
附近页面--> 点击nearby my location  输入框进入页面
显示内容:
    输入框
    雷达区
    部分商家列表List
 */

import React, {PureComponent} from 'react'
import {
    ActivityIndicator,
    Animated,
    AsyncStorage,
    BVLinearGradient, DeviceEventEmitter,
    Easing,
    Image, InteractionManager,
    Keyboard,
    PanResponder, Platform,
    SliderIOS,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import {SpacingView} from '../../widget'
import {screen} from "../../common";
import AMap from '../Api/AMapAndroid'
import AMap3D from '../Api/AMap.ios';
import testData from '../../testData'
import ExploreRangeMarkerList from './ExploreRangeMarkerList';
import {CoordinateConverter, getVineyardByGPS, regeocodeLocation,getProducerByGPS } from "../../api";
import Slider from "../Common/Slider";
import DrinkDetailDataUtils from "./Drink/DrinkDetailDataUtils";
import Mater from "react-native-vector-icons/MaterialIcons";
import BeautyDetail from "./Beauty/BeautyDetail";

type
Props = { navigation: any, };
type
State = {
    discounts: Array<Object>,
    dataList: Array<Object>,
    refreshing: boolean,
}

var Geolocation = require('Geolocation');
var colorTemp = screen.colorTemp;
var address = null;

export default class ExploreRangeScene extends PureComponent<Props, State> {
    static navigationOptions = ({ navigation }: any) => ({
        header: null,
    })

    onChangeSearchBoxText = (text) => {
        this.setState({ locationSearchKey: text });
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            sections: [],
            sectionSize: [],
            location: {},
            isLoading: false,
            searchList: null,
            locationSearchKey: null,
            zoom:12.5,
            radius: 5,
            opacity:[0,1,0],
            center:null,
            isDateTimePickerVisible: false,
            date: new Date(),
            params: {
                types: '',
                keywords: '711',
                offset: 10,
                page: 1,
                coordinate: {
                    longitude: 113.341411,
                    latitude: 23.170044
                },
                radius: 1000
            },
            markerView: false,
            signWidth:0,
            coordinates:[],
        };
        this.picker = null;
        this.animatedValue = new Animated.Value(0);
        // this.animatedValue.stopAnimation(()=>{
        //     console.log(123)
        // })
    }

    // _keyboardDidHide() {//键盘输入完毕后传值回去上一个页面
    //     this.props.navigation.state.params.callbackLocation(this.state.locationSearchKey);
    //     AMap.searchPoiByCenterCoordinate(this.state.params);
    // }

    _onSearchClick(v) {
        let {center,radius,zoom,locationSearchKey} = this.state;
        // console.log(center.latitude,center.longitude,radius);
        this.props.navigation.state.params.callbackLocation(address,center.latitude,center.longitude,'',radius,locationSearchKey);
        AsyncStorage.setItem('LocationSearchKey', address);
        AsyncStorage.setItem('LatLngLog',JSON.stringify([ center.latitude,center.longitude,(radius / 5).toString(),zoom.toString()]));
    }
    componentDidMount() {
        StatusBar.setBackgroundColor('#0000005e');
        this.setState({ isLoading: true });
        let {center,radius} = this.state;
        DeviceEventEmitter.addListener('amap.onMapClickDone', function (e) {
            let index = e.addressName.indexOf(",");
            address= e.addressName.indexOf(",") !== -1?e.addressName.substr(0,index):e.addressName;
            // console.log('onMapClickDone',e.addressName,'address',address)
            // this.props.navigation.state.params.callbackLocation(address.addressName);
        });
        // this.UpdateMarkerList();
        // this.refs['ExploreRangeMarkerList']._GetBusinessLocationsWithinRadius(center.latitude,center.longitude,'',radius);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('LatLngLog');
            if (value !== null) {
                // We have data!!
                // console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    componentWillMount() {
        // this._retrieveData();
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error,result)=>{
                    if (error||result==null){
                        this.getPosition();
                    }else{
                        let LatLngLog=JSON.parse(result);
                        this.setState({
                            center: {
                                latitude:parseFloat(LatLngLog[0]),
                                longitude:parseFloat(LatLngLog[1])
                            },
                            radius:parseFloat(LatLngLog[2]*5),
                            zoom:parseFloat(LatLngLog[3])
                        });
                        this.UpdateMarkerList();
                    }
                }
            );
            AsyncStorage.getItem(
                'LocationSearchKey',
                (error,result)=>{
                    if (error){
                    }else{
                        address = result;
                    }
                }
            )
        }catch(error){
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度'+error);
        }
    }



    _getMarkerByGPS (){
        let {category, subareaObj,searchKey} = this.props.navigation.state.params;
        if (searchKey!=='What to'){
            if (category === 'Vineyard') {
                // this._getVineyardByName(searchKey);
            } else if (category === 'Producer') {
                // this._getProducerByName(searchKey);
            }else {
                this.setState({ data: testData })
            }
        } else {
            if (category === 'Vineyard'&&subareaObj.region_id!==undefined) {
                // this._getVineyardById(subareaObj.region_id)
            }else if(category === 'Producer'){
                // this._getAllProducer()
            }else if(category === 'Vineyard'){
                this._getVineyardByGPS();
            }else {
                this.setState({ data: testData })
            }
        }

    };
    _getVineyardByGPS = async () =>{
        let {center,radius} = this.state;
        await  getVineyardByGPS(center.longitude,center.latitude,radius*1000)
            .then((msg) => {
                this.setState({data: DrinkDetailDataUtils.requestData(msg)});
                // this.setState({
                //     VineyardList: DrinkDetailDataUtils.requestProducerData(msg),
                //     refreshState: RefreshState.NoMoreData,
                // });
            })
            .catch((e) => {
                console.warn(e)
            });
    };


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
                            latitude: latitude+Math.random()/10000,
                            longitude: longitude
                        }
                    },()=>{
                        this.UpdateMarkerList();
                    });
                    // AsyncStorage.setItem('LatLngLog',JSON.stringify([latitude,longitude]));
                })
                .catch((error) => {
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
                },()=>{
                    this.UpdateMarkerList();
                })
            },5000);
        });
        clearInterval(this.interval);
    };

    componentWillUnmount() {
        // this.keyboardDidHideListener.remove();
        StatusBar.setBackgroundColor("#00000000");
    }
    onBackAndroid = () => {
        this.props.navigation.state.params.callbackLocation(address);
        return false;
    };



    renderCells() {
        let cells = []
        let dataList = this.getDataList();
        for (let i = 0; i < dataList.length; i++) {
            let sublist = dataList[i]
            for (let j = 0; j < sublist.length; j++) {
                let data = sublist[j]
                let cell = <DetailCell image={data.image} title={data.title} subtitle={data.subtitle} key={data.title} />
                cells.push(cell)
            }
            cells.push(<SpacingView key={i} />)
        }

        return (
            <View style={{ flex: 1 }}>
                {cells}
            </View>
        )
    }

    regeocodeLocation(longitude, latitude) {
        let lo = longitude, la = latitude;
        fetch(regeocodeLocation(longitude, latitude), {
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
                AsyncStorage.setItem('LatLngLog',JSON.stringify([latitude,longitude]));
                AsyncStorage.setItem('LocationSearchKey', formatted_address);
                this.props.navigation.state.params.callbackLocation(formatted_address);
            })
            .catch(error => {
                setTimeout(() => {
                    this.regeocodeLocation(lo, la);
                }, 10);
            });
    };
    UpdateMarkerList(){
        let {center,radius} = this.state;
        let {category} = this.props.navigation.state.params;
        if (category==='Beauty') {
            this.refs['ExploreRangeMarkerList']._GetBusinessLocationsWithinRadius(center.latitude,center.longitude,'',radius);
        }else if(category==='Vineyard'){
            this.refs['ExploreRangeMarkerList']._GetVineyardLocationsWithinRadius(center.latitude,center.longitude,radius);
        }else if(category==='Producer'){
            this.refs['ExploreRangeMarkerList']._GetProducerLocationsWithinRadius(center.latitude,center.longitude,radius);
        }
        // this.refs['ExploreRangeMarkerList']._GetVineyardLocationsWithinRadius(center.latitude,center.longitude,radius);
    }
    loadMarker(data){
        this.setState({coordinates:[]});
        let coordinates = [];
        data.forEach(item => {
            if (item.Latitude !== null && item.Longitude !== null) {
                let coordinate = {
                    latitude: item.Latitude,
                    longitude: item.Longitude,
                };
                coordinates.push(coordinate);
            }
        });
        this.setState({coordinates:coordinates});
    }

    loadAMap() {
        let {coordinates,radius} = this.state;
        return (
            <AMap3D
                // region = {{latitudeDelta: 0,
                //     longitudeDelta: 0, ...this.state.center}}
                locationEnabled={false}
                zoomLevel={this.state.zoom}
                coordinate={this.state.center}
                ref={component => this._amap = component}
                // onFormattedAddressReceived={this.onFormattedAddressReceived}
                onLongPressEvent={(e) => {
                    this.setState({
                        center: {
                            latitude: e.latitude,
                            longitude: e.longitude
                        }
                    },()=>{
                        this.UpdateMarkerList();
                    });
                    // this.regeocodeLocation(e.longitude,e.latitude);
                    // this._onMapLongClick(address);

                }}
                onMarkerPress={(index) => {
                    this.setState({ markerView: true });
                    this.refs['ExploreRangeMarkerList'].scrollToList({x: index, y: 0, animated: true});
                }}
                onPressEvent={(e) => {
                    this.setState({ markerView: false })
                }}
                circle={{
                    enabled: true,
                    radius: radius * 1000
                }}
                coordinates={coordinates}
                _onStatusChangeComplete={()=>{

                }}
            />
        );
    }
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this._hideDateTimePicker();
    };


    GetMarkerList() {//markerList
        let {category} = this.props.navigation.state.params;
        return (
            <View style={[styles.sliderStyle]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._onSearchClick(address);
                        this.props.navigation.goBack();
                    }}
                    style={{
                        backgroundColor: '#ff7570',
                        padding: 10,
                        alignSelf: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        marginBottom:0
                    }}>
                    <Text style={{color: '#ffffff', fontSize: 14, fontFamily: 'arial',}}>
                        SEARCH
                    </Text>
                </TouchableOpacity>
                <View style={[ {
                    alignSelf:'center',
                    alignItems:'center',
                    justifyContent:'center',
                    // backgroundColor:'#ff464f',
                    // position: 'absolute',
                    // bottom: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    width: this.state.markerView ? screen.width * 0.9 : 0,
                    opacity: this.state.markerView ? 1 : 0,
                    // height: this.state.markerView ? 100 : 0
                }]}>
                    <ExploreRangeMarkerList
                        ref={'ExploreRangeMarkerList'}
                        siteId={this.props.navigation.state.params.siteId}
                        loadMarker={this.loadMarker.bind(this)}
                        onMenuSelected={(info) => {
                            if (category==='Beauty') {
                                this.props.navigation.navigate('BeautyDetail', {info: info})//跳到商品详情
                            }else if(category==='Vineyard'){
                                // this.props.navigation.navigate('BeautyDetail', {info: info})//跳到商品详情
                            }else if(category==='Producer'){
                                // this.props.navigation.navigate('BeautyDetail', {info: info})//跳到商品详情
                            }

                        }}
                        _scrollToMarker={(info) => {
                            this._amap._scrollToMarker(info)
                        }}
                    />
                </View>
            </View>
        )
    };
    // responder = PanResponder.create({
    //     onStartShouldSetResponder: (evt, gestureState) => false,
    //     onStartShouldSetResponderCapture: (evt, gestureState) => false,
    //     onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //     onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
    //         return true;
    //     },
    //     _onPanResponderTerminationRequest: (evt, gestureState) => false,
    //     onPanResponderGrant: (evt, gestureState) => {
    //     },
    //     onPanResponderMove: (evt, {dx, dy}) => {
    //         // this.animate()
    //     },
    //     onPanResponderRelease: (evt, {vx, vy}) => {
    //
    //     },
    // });
    opacity=[0, 1, 0];
    animate (v) {
        this.opacity= v===0?[0, 1, 1]:[0, 1, 0];
        this.setState({signWidth:screen.width * 0.15});
        this.animatedValue.setValue(v);
        Animated.timing(
            this.animatedValue,
            {
                toValue: v===0?1:0,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(
            // () => this.animate()
        );

        if (v===1){
            setTimeout(()=>{
                this.setState({signWidth:0})
            },5000)
        }
        // this.animatedValue.stopAnimation(()=>{
        //     console.log(123)
        // })
    }
    render() {
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: this.opacity
        });
        let  {signWidth,radius,locationSearchKey,center}=this.state;
        let li=[50,45,40,35,30,25,20,15,10,5,0.5,0.25];
        let liTemp=[50,45,40,35,30,25,20,15,10,5,0.5,0.25];
        let u=[9,9.2,9.3,9.5,10,10,10,11,11.5,12.5,15,17];
        return (
            <View style={styles.linearGradient}>
                <View style={{
                    flexDirection: 'column',
                    alignItems:'center',
                    position: 'absolute',
                    top: screen.statusBarHeight + 20,
                    width: screen.width ,
                    zIndex: 100,
                }}>

                    <View style={{
                        backgroundColor: '#ffffffae',
                        flexDirection: 'row',
                        alignItems:'center',
                        // justifyContent:'center',
                        // alignSelf: 'center',
                    }}
                    >
                        <TouchableOpacity
                            style={{
                                width: screen.width * 0.1,
                                paddingRight: 5,
                                paddingLeft: 5,
                                paddingTop: 10,
                                paddingBottom: 10,
                            }}
                            onPress={() => {
                                StatusBar.setBackgroundColor('#00000000');
                                this.props.navigation.goBack();
                            }}
                        >
                            <Image source={require('../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[styles.searchIcon, {tintColor: '#232323'}]}/>
                        </TouchableOpacity>
                        <TextInput
                            selectionColor={'#202020'}
                            placeholder="Search location"
                            underlineColorAndroid='transparent'
                            multiline={true}
                            onChangeText={(value) => {
                                this.onChangeSearchBoxText(value)
                            }}
                            defaultValue={locationSearchKey}
                            style={{
                                width: screen.width * 0.8,
                                fontSize: 15,
                                color: '#232323',
                                textAlignVertical: 'center',
                            }}/>
                        {(locationSearchKey!==null&&locationSearchKey.length > 0)&&
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[styles.inputIcon, {
                                paddingTop: Platform.OS === 'ios' ? 10 : 15,
                                paddingBottom: Platform.OS === 'ios' ? 10 : 15,
                            }]}
                            onPress={()=>{
                                this.setState({locationSearchKey:null})
                            }}
                        >
                            <Mater name={'close'} size={20} color={'#232323'}/>
                        </TouchableOpacity>}
                    </View>
                </View>
                <Animated.View
                    style={{
                        opacity,
                        position: 'absolute',
                        top: screen.statusBarHeight + 70,
                        alignItems: 'flex-start',
                        zIndex: 100,
                    }}
                >
                    <View style={{
                        width: signWidth,
                        height: screen.width * 0.15,
                        backgroundColor: '#8c55ff5e',
                        borderRadius: 45,
                        borderWidth: 1,
                        borderColor: '#3295ff5e',
                        alignItems: 'center',
                        margin: 5,
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#fff',
                                fontFamily: 'arial',
                                fontWeight: '400',
                                fontSize: 20,
                            }}>{radius}</Text>
                        <Text
                            style={{
                                flexDirection: 'column',
                                color: '#fff',
                                fontFamily: 'arial',
                                fontSize: 10,
                                paddingTop: 10,
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>km</Text>
                    </View>
                </Animated.View>
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
                               style={[styles.searchIcon, {tintColor: '#707070'}]}/>
                    </TouchableOpacity>

                </View>
                <View style={[styles.mapStyle]}>
                    {center===null?this.showLoading():this.loadAMap()}

                    {/*{*/}
                        {/*// InteractionManager.runAfterInteractions(() => {*/}
                        {/**/}
                            {/*this.loadAMap()*/}
                        {/*// })*/}
                    {/*}*/}

                </View>
                {this.GetMarkerList()}

                <View
                    style={{position: 'absolute', bottom: 0,width:screen.width,}}
                >
                    <Slider
                        initialValue={radius/5}
                        onSelect={(e) => {
                            e === 0 ? e = 0.25 : e;
                            li.map((info,i)=>{
                                this.setState({radius:e!==0.25?e*5:0.25,});
                                if ((e!==0.25?e*5:0.25)===info) this.setState({zoom:u[i]})
                            })
                        }}
                        onPress={(v) => {//滑动
                            this.animate(v);
                            let {center,radius} = this.state;
                            // let li=[50,45,40,35,30,25,20,15,10,5,0.25];
                            // let u=[8.5,9.2,9.3,9.5,10,10,10,11,11.5,12.5,17];
                            if (li.indexOf(radius) < 0) {
                                liTemp.push(radius);
                                this.sortarr(liTemp);//排序
                                let _radius = liTemp.indexOf(radius);//取到新半径的位置
                                let lastDiffer = Math.abs(liTemp[_radius - 1] - liTemp[_radius]);//前一个相差值
                                let nextDiffer = Math.abs(liTemp[_radius + 1] - liTemp[_radius]);//后一个相差值
                                if (lastDiffer === nextDiffer) {
                                    return;
                                } else if (lastDiffer > nextDiffer) {//取后一个值
                                    this.setState({
                                        zoom: u[li.indexOf(liTemp[_radius + 1])]
                                    })
                                } else if (lastDiffer < nextDiffer) {
                                    this.setState({
                                        zoom: u[li.indexOf(liTemp[_radius - 1])]
                                    })
                                }
                            }
                            // let {center,radius} = this.state;
                            this.UpdateMarkerList();
                            // this.refs['ExploreRangeMarkerList']._GetBusinessLocationsWithinRadius(center.latitude,center.longitude,'',radius);
                            // this.refs['ExploreRangeMarkerList']._GetVineyardLocationsWithinRadius(center.latitude,center.longitude,radius);
                        }}
                    />
                </View>


            </View>
        )

    }
     sortarr(arr){
        for(i=0;i<arr.length-1;i++){
            for(j=0;j<arr.length-1-i;j++){
                if(arr[j]>arr[j+1]){
                    var temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }
        }
        return arr;
    }
    /////////////////////////////////
    // onFormattedAddressReceived = (formatted_address) => {
    //     address = formatted_address;
    //     AsyncStorage.setItem('LocationSearchKey',formatted_address);
    //     this.props.navigation.state.params.callbackLocation(address);
    //     // AsyncStorage.removeItem('LatLngLog')
    // }
}


const styles = StyleSheet.create({
    mapStyle: {
        flex: 1,
        flexDirection: 'column',
        width: screen.width
    },
    sliderStyle: {
        alignSelf:'center',
        position: 'absolute',
        bottom: 10,
        marginTop: 10,
        marginBottom: 10,
        width: screen.width * 0.9

    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    linearGradient: {
        flex: 1,
    },
    inputIcon: {
        alignSelf:'center',
        paddingRight: 5,
    },
});
