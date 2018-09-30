import React, {PureComponent} from 'react'
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, AsyncStorage, BVLinearGradient, Image, Text, TouchableOpacity, View,} from 'react-native'
import {screen} from '../../../common'
import api, {CoordinateConverter, GetBusinessLocationsWithinRadius} from '../../../api'
import AdSwiper from '../../AD/AdSwiper';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {commonStyle} from "../../../widget/commonStyle";
import AMapSelect from "../../Api/AMapSelect";
import BeautyDataUtils from './BeautyDataUtils'
import BeautyCell from "./BeautyCell";

var Geolocation = require('Geolocation');
type
Props = {
    navigation: any,
};


var colorTemp = screen.colorTemp;


export default class BeautyScene extends PureComponent<Props> {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);

        this.state = {
            discounts: [],
            BeautyList: [],
            refreshing: false,
            typeTemp: null,
            face: 1,
            changeColor: ['#b2a9a9', '#646264', '#343333'],
            modalVisible: false,
            modalVisibleInfo: false,
            searchKey: null,
            LocationSearchKey: null,
            isRefreshing: false,
            data: [],
            refreshState: RefreshState.NoMoreData,
            isLoading:false,
            LatLng:{},
            radius:0,
            zoom:12.5,
            onSearch:false,
            waiting: false
        };

        this.count = 0;
    }


    GetADList() {//广告轮播
        return (
            //  <TranslateYAndOpacity
            //      opacityMin={0}
            //      translateYMin={4}
            //      duration={500}
            //      startOnDidMount={true}
            //  >
            <AdSwiper style={{width: screen.width * 0.95}} menuInfos={api.adInfoTemp}
                      onMenuSelected={this.onMenuSelected}/>
            //</TranslateYAndOpacity>
        )
    }

    onMenuSelected = (e) => {//选中的广告事件

    };
    showNoDataMsg() {
        return (
            <View style={{alignItems:'center', backgroundColor: 'transparent'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    No matched search result is returned.
                </Text>
            </View>
        )
    }

    GetExploreList() {//商品列表
        return (
            this.state.BeautyList.length > 0
                ? <View style={commonStyle.container}>
                    <RefreshListView
                        style={{
                            marginTop: 5,
                            width: screen.width,
                        }}
                        data={this.state.BeautyList}
                        ListHeaderComponent={this.GetADList()}//广告位
                        renderItem={this.renderCell}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.requestData}
                        footerTextStyle={{color: '#ffffff'}}
                        footerRefreshingText={'loading...'}
                        footerFailureText={'click refresh'}
                        footerNoMoreDataText={'no more data'}
                        footerEmptyDataText={'empty data'}
                    />
                </View> : (this.state.isLoading ? this.showLoading() : (this.state.NoData && this.showNoDataMsg()))

        )
    }
    page = 0;
    size = 25;
    dataLength = 0;
    requestData = async () => {
            this.setState({
                onSearch:true,
                isLoading:true
            });
            let {LatLng,radius,searchKey,BeautyList,zoom} = this.state;
            await GetBusinessLocationsWithinRadius(LatLng.latitude,LatLng.longitude,radius,searchKey===null?'':searchKey,this.size,this.page)
                .then((msg) => {
                    this.dataLength = BeautyList.length;
                    let data = BeautyDataUtils.requestBeautyData(msg);
                    data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                    this.setState({
                        isLoading:false,
                        BeautyList: BeautyList.concat(data),
                        refreshState: RefreshState.Idle,
                    }, () => {
                        if (BeautyList.length === this.dataLength) {
                            this.setState({refreshState: RefreshState.NoMoreData})
                        }
                    });
                })
                .catch((e) => {
                    console.warn(e);
                    this.setState({
                        refreshState: RefreshState.Failure,
                    })
                });
    };

    keyExtractor = (item: Object, index: number) => {
        return item.id
    };
    getLatLngLog(){
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error,result)=>{
                    if (error||result==null){
                        console.log('取值失败');
                    }else{
                        let LatLngLog=JSON.parse(result);
                        this.setState({
                            LatLng: {
                                latitude:LatLngLog[0],
                                longitude:LatLngLog[1]
                            },
                            radius:parseFloat(LatLngLog[2]*5),
                            zoom:parseFloat(LatLngLog[3]*5),
                        });
                        this.requestData()
                        // console.log('成功'+result);
                    }
                }
            );
        }catch(error){
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度'+error);
        }
    }
    componentWillMount() {
        this.getLocationSearchKey();
       this.getLatLngLog();
    }
    renderCell = (rowData: any) => {
        return (
            <View>
                <BeautyCell
                    info={rowData.item}
                    latLng={this.state.LatLng}
                    onPress={() => {
                        this.props.navigation.navigate('BeautyDetail', {info: rowData.item})//跳到商品详情
                    }}
                />
            </View>
        )
    };
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    showNoSearchMsg() {
        return (
            <View style={{alignItems:'center',
            backgroundColor: 'transparent'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please enter keywords to search.
                </Text>
            </View>
        )
    }
    toWait() {
        setTimeout(() => {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }

    render() {
        let {searchKey, LocationSearchKey, isLoading, waiting,zoom} = this.state;
        return (
            <LinearGradient colors={colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient]}>
                <View style={[commonStyle.center]}>
                    <View style={commonStyle.Bar}>
                        <TouchableOpacity
                            disabled={waiting}
                            style={commonStyle.BarLeftIcon}
                            onPress={() => {
                                this.setState({waiting: true});
                                this.props.navigation.goBack();//返回按钮图片
                                this.toWait();
                            }}>
                            <Image source={require('../../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={commonStyle.BarTitle}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'arial',
                            }}>BUSINESSES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={waiting}
                            style={commonStyle.BarRightIcon}
                            onPress={() => {
                                this.setState({waiting: true});
                                //跳转到地图定位页面
                                this.props.navigation.navigate('AMapSelect',
                                    {
                                        callbackLocationOfMap: (address, latitude, longitude, name) => {
                                            this.setState({
                                                BeautyList: [],
                                                LocationSearchKey: address,
                                                LatLng: {
                                                    latitude: latitude,
                                                    longitude: longitude
                                                },
                                            }, () => {
                                                this.requestData()
                                            });
                                        }
                                    }
                                );
                                this.toWait();
                            }}>
                            <Image source={require('../../../img/mine/icon_location_map.png')}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity disabled={waiting} style={commonStyle.searchBar} underlineColorAndroid='white'
                                      onPress={() => {
                                          this.setState({waiting: true});
                                          this.props.navigation.navigate('Beauty2SearchScene'
                                              , {
                                                  callback: (keyWork, radius, LatLng) => {
                                                      if (this.state.refreshState === RefreshState.NoMoreData) {
                                                          this.page = 0
                                                      }
                                                      this.setState({
                                                          searchKey: keyWork,
                                                          BeautyList: [],
                                                          radius: radius,
                                                          LatLng: {
                                                              longitude: LatLng.longitude,
                                                              latitude: LatLng.latitude
                                                          }
                                                      }, () => {
                                                          this.requestData();
                                                      });
                                                  }
                                              });
                                          this.toWait();
                                      }}>
                        <Image source={require('../../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={commonStyle.searchText}>{searchKey === null ? 'What to' : searchKey} </Text>
                        {searchKey === null &&
                        <Text style={commonStyle.searchText2}>search?</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity disabled={waiting} style={commonStyle.searchBar} underlineColorAndroid='white'
                                      onPress={() => {
                                          this.setState({waiting: true});
                                          this.props.navigation.navigate('ExploreRangeScene'
                                              , {
                                                  callbackLocation: (address, latitude, longitude, name, radius, locationSearchKey) => {
                                                      this.setState({
                                                          BeautyList: [],
                                                          LocationSearchKey: address,
                                                          LatLng: {
                                                              latitude: latitude,
                                                              longitude: longitude
                                                          },
                                                          radius: radius
                                                      }, () => {
                                                          this.requestData()
                                                      });
                                                  },
                                                  category: 'Beauty',
                                                  siteId: this.props.navigation.state.params.siteId,
                                              });
                                          this.toWait();
                                      }}>
                        <Image source={require('../../../img/nearby/locationB.png')} style={commonStyle.searchIcon}/>
                        <Text
                            style={commonStyle.searchText}>{LocationSearchKey === null ? 'Select the' : LocationSearchKey} </Text>
                        {LocationSearchKey === null &&
                        <Text style={commonStyle.searchText2}>area</Text>}
                    </TouchableOpacity>
                </View>
                {!this.state.onSearch ? this.showNoSearchMsg() : this.GetExploreList()}
            </LinearGradient>
        )
    }

    getLocationSearchKey() {
        try {
            AsyncStorage.getItem(
                'LocationSearchKey',
                (error, result) => {
                    if (error || result == null) {
                        this.getPosition();
                        // alert('取值失败:'+error);
                    } else {
                        this.setState({LocationSearchKey: result});
                    }
                }
            )
        } catch (error) {
            this.getPosition();
        }
    }

    componentDidMount() {
        // this.setState({isLoading: true});
        this.requestData()
    }

    /** 获取地理位置（经纬度） */
    getPosition = (): void => {
        Geolocation.getCurrentPosition(location => {
            fetch(CoordinateConverter(location.coords.longitude, location.coords.latitude))
                .then((response) => response.json())
                .then((responseJson) => {
                    this._regeocode(Number(responseJson.locations.split(',')[0]), Number(responseJson.locations.split(',')[1]))
                })
                .catch((error) => {
                });
        }, error => {
            this.interval = setInterval(() => {
                    this.getPosition();
                },
                1000
            );
        });
        clearInterval(this.interval);
    };
    _regeocode = async (longitude, latitude) => {
        const api = 'http://restapi.amap.com/v3/geocode/regeo';
        const location = `${longitude},${latitude}`;
        const key = 'ee020207116b9d61aebdb6f08d9a319f';
        const url = `${api}?output=json&location=${location}&key=${key}&radius=1000&extensions=all`;
        let response = await  fetch(url, {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
        }).catch(() => {
            this.getPosition()
        });
        let json = await response.json();
        if (json.info != 'OK') return;
        var formatted_address = json.regeocode.aois.length > 0 ? json.regeocode.aois[0].name : json.regeocode.addressComponent.township.toString();
        if (Array.isArray(formatted_address) && formatted_address.length == 0) {
            formatted_address = '';
        }
        // this.setState({LocationSearchKey: formatted_address});
        // AsyncStorage.setItem('LocationSearchKey',formatted_address);
    }

}

