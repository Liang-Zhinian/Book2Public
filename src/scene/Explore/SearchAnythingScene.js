import React, {PureComponent} from 'react'
import LinearGradient from 'react-native-linear-gradient';
import {AsyncStorage, BVLinearGradient, Image, Text, TouchableOpacity, View,} from 'react-native'
import {screen} from '../../common'
import api, {CoordinateConverter} from '../../api'
import testData from '../../testData'
import AdSwiper from '../AD/AdSwiper';
import SearchAnythingInfoScene from "./SearchAnythingInfoScene";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell'
import CommodityDetails from "../GroupPurchase/CommodityDetails";
import {commonStyle} from "../../widget/commonStyle";
import AMapSelect from "../Api/AMapSelect";

var Geolocation = require('Geolocation');
type
Props = {
    navigation: any,
}


var colorTemp = screen.colorTemp;


export default class SearchAnythingScene extends PureComponent<Props> {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);

        this.state = {
            discounts: [],
            dataList: [],
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
            refreshState: RefreshState.Idle,
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

        // if (index == 1) {
        //     this.props.navigation.navigate('AdInfo'
        //         , {
        //             callback: (msg) => {
        //                 // this.setState({searchKey: msg})
        //             }
        //         });
        //     // this.GetExploreList()
        // }
    };

    GetExploreList() {//商品列表
        return (
            <View style={commonStyle.container}>
                <RefreshListView
                    style={{
                        width: screen.width,
                    }}
                    data={this.state.data}
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
            </View>
        )
    }

    requestData = async () => {
        try {
            this.setState({refreshState: RefreshState.HeaderRefreshing});

            var dataList = [];

            if (this.props.navigation.state.params.siteId === 'f996cb01-6b0c-4dfa-9687-78e59df6d0b1') {
                let response = await fetch(api.findLocations);
                let json = await response.json();

                dataList = json.map((info) => {
                    return {
                        key: info.Id,
                        id: info.Id,
                        imageUrl: 'data:image/png;base64,' + info.Image,
                        title: info.Description,
                        subtitle: ((info.StreetAddress != null && info.StreetAddress != 'null') ? info.StreetAddress : '') + ((info.StreetAddress2 != null && info.StreetAddress2 != 'null') ? info.StreetAddress2 : ''),
                        Latitude: info.Latitude,
                        Longitude: info.Longitude,
                        phone: info.phone,
                        description: info.Description,
                        firmId: info.firmId,
                        AdditionalLocationImages: 'data:image/png;base64,' + info.AdditionalLocationImages[0].Image,
                    }
                });
            } else {

                let json2 = testData.testData;
                dataList = json2.map((info2) => {
                    return {
                        key: info2.Id,
                        id: info2.Id,
                        imageUrl: info2.icon.uri,
                        title: info2.title,
                        subtitle: info2.address,
                        phone: info2.phone,
                        // price: info2.price,
                        Latitude: info2.LatLng.latitude,
                        Longitude: info2.LatLng.longitude,
                        AdditionalLocationImages: info2.icon.uri,
                        firmId: info2.firmId,
                    }
                });

            }


            // let dataList = json.data.map((info) => {
            //     return {
            //         id: info.id,
            //         imageUrl: info.squareimgurl,
            //         title: info.mname,
            //         subtitle: `[${info.range}]${info.title}`,
            //         price: info.price
            //     }
            // })

            //数据打乱
            dataList.sort(() => {
                return 0.5 - Math.random()
            });

            this.setState({
                data: dataList,
                refreshState: RefreshState.NoMoreData,
            })
        } catch (error) {
            this.setState({
                refreshState: RefreshState.Failure,
            })
        }
    };

    keyExtractor = (item: Object, index: number) => {
        return item.id
    };
    renderCell = (rowData: any) => {
        return (
            <View>
                {/*<TranslateYAndOpacity*/}
                {/*opacityMin={0}*/}
                {/*translateYMin={-10}*/}
                {/*duration={500}*/}
                {/*startOnDidMount={true}*/}
                {/*>*/}
                <GroupPurchaseCell
                    info={rowData.item}
                    onPress={() => {
                        // StatusBar.setBarStyle('default', false);
                        this.props.navigation.navigate('CommodityDetails', {info: rowData.item})//跳到商品详情
                    }}
                />
                {/*</TranslateYAndOpacity>*/}
            </View>
        )
    };

    render() {
        let {LocationSearchKey,searchKey} =this.state;
        let lo =(LocationSearchKey === null || LocationSearchKey === '');
        return (
            <LinearGradient colors={colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient]}>
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',}]}>
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
                        <TouchableOpacity style={commonStyle.BarTitle}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'arial',
                            }}>BUSINESSES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            zIndex: 999,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingLeft: 50,
                            paddingRight: screen.width * 0.025,
                        }} onPress={() => {
                            //跳转到地图定位页面
                            this.props.navigation.navigate('AMapSelect',
                                {
                                    callbackLocationOfMap: (msg) => {
                                        this.setState({LocationSearchKey: msg})
                                    }
                                }
                            );
                        }}>
                            <Image source={require('../../img/mine/icon_location_map.png')}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={commonStyle.searchBar} underlineColorAndroid='white' onPress={() => {
                        this.props.navigation.navigate('SearchAnythingInfoScene'
                            , {
                                callback: (msg) => {
                                    this.setState({searchKey: msg})
                                }
                            });
                    }}>
                        <Image source={require('../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={commonStyle.searchText}>{(searchKey === null || searchKey === '')?'What to':searchKey} </Text>
                        {(searchKey === null || searchKey === '') ?
                            <Text style={commonStyle.searchText2}>search?</Text> : <Text/>}
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.searchBar} underlineColorAndroid='white' onPress={() => {
                        this.props.navigation.navigate('ExploreRangeScene'
                            , {
                                callbackLocation: (msg) => {
                                    console.log(msg);
                                    this.setState({LocationSearchKey: msg})
                                },
                                siteId: this.props.navigation.state.params.siteId,
                            });
                    }}>
                        <Image source={require('../../img/nearby/locationB.png')} style={commonStyle.searchIcon}/>
                        <Text
                            numberOfLines={1}
                            style={[{width:lo?null:screen.width*0.8,},commonStyle.searchText]}
                        >{lo?'Select the':LocationSearchKey} </Text>
                        {lo ?
                            <Text style={commonStyle.searchText2}>area</Text> : <Text/>}
                            {/*Unnamed Road, Ngọc Trí, Kim Hoa, Mê Linh, Hà Nội, 越南*/}
                    </TouchableOpacity>
                </View>
                {/*<View style={{backgroundColor:'#ffffff00',padding:5,width:screen.width}}/>*/}
                {/*{this.GetExploreList()}*/}
            </LinearGradient>
        )
    }

    componentDidMount() {
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
            console.warn('获取历史地理位置失败,现在获取当前位置' + error);
            this.getPosition();
        }

        this.setState({isLoading: true});
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
        if (json.info !== 'OK') return;
        var formatted_address = json.regeocode.aois.length > 0 ? json.regeocode.aois[0].name : json.regeocode.addressComponent.township.toString();
        if (Array.isArray(formatted_address) && formatted_address.length == 0) {
            formatted_address = '';
        }
        // this.setState({LocationSearchKey: formatted_address});
        // AsyncStorage.setItem('LocationSearchKey',formatted_address);
    }

}

