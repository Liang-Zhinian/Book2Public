import React, {PureComponent} from 'react'
import {
    BackHandler,
    Clipboard,
    Image,
    InteractionManager,
    Linking,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {Separator} from '../../../../widget'
import {Heading3} from '../../../../widget/Text'
import {screen} from '../../../../common'
import {amapStaticImg, recommendUrlWithId} from '../../../../api'
import GroupPurchaseCell from '../../../GroupPurchase/GroupPurchaseCell'
import StarRating from "../../../Common/StarRating";
import ActionSheet from '../../../Common/ActionSheet'
import LinearGradient from 'react-native-linear-gradient';
import AMapAndroid from "../../../Api/AMapAndroid";
import {commonStyle} from "../../../../widget/commonStyle";


type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}

//葡萄园
export default class VineyardDetail extends PureComponent<Props, State> {
    _didFocusSubscription;
    _willBlurSubscription;
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    // static navigationOptions = ({ navigation }: any) => ({
    //     headerTitle: '',
    //     headerStyle: { backgroundColor: 'white' },
    //     headerRight: (
    //         <NavigationItem
    //             icon={require('../../img/public/share.png')}
    //             onPress={() => {
    //                 alert('分享按钮')
    //             }}
    //         />
    //     ),
    // })

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            refreshState: false,
            loveTintColor: '#696969',
            handerBgc: '#69696900',
            falseSwitchIsOn: false,
            center: {
                longitude: 116.404,
                latitude: 39.915
            },
            mapImgUrl: ''
        }
        // this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        // );
    }

    onBackAndroid = () => {
        // console.log(NavigationActions)
        // this.props.navigation.state.params.rootNavigator.goBack(/*{ routeName: 'SettingScene' }*/);
        // console.log( 'onBackAndroid', this.props);
        // let routeName =this.props.navigation.state.params.routeName;
        // this.props.navigation.state.params.rootNavigator.goBack({key:'CountryListScene', routeName: 'CountryListScene'});
        // routeName&&this.props.navigation.goBack();
        // this.props.navigation.state.params.rootNavigator.dispatch(NavigationActions.back({key:'CountryListScene', routeName: 'CountryListScene'}));
        // this.props.navigation.goBack({key:'CountryListScene', routeName: 'CountryListScene'});
        !this.props.navigation.state.params.fromCube&&this.props.navigation.goBack();
        // let navigateAction = NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'CountryListScene'})]
        // });
        // this.props.navigation.dispatch(navigateAction);
        //
        // let navigateAction = NavigationActions.back({key:'VineyardScene'});
        // this.props.navigation.dispatch(navigateAction);

        // screenProps
        // const nav = this.props.navigation.goBack();
        // nav.goBack();
        // const routers = nav.getCurrentRoutes();
        // if (routers.length > 1) {
        //     return true;
        // }
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        // this._didFocusSubscription && this._didFocusSubscription.remove();
        // this._willBlurSubscription && this._willBlurSubscription.remove();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }

        // let info = this.props.navigation.state.params.info;
        // this.setState({center:{
        //         longitude: info.latLng.longitude,
        //         latitude: info.latLng.latitude
        //     }})
        StatusBar.setBackgroundColor("#0F143A00");
    }

    componentDidMount() {
        // this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        // );
        InteractionManager.runAfterInteractions(() => {
            this.requestData()
        })

    }
    // onBackButtonPressAndroid = () => {
    //     let navigateAction = NavigationActions.back({key:'VineyardScene'});
    //     this.props.navigation.dispatch(navigateAction);
    // };


    requestData = () => {
        this.requestRecommend()
    };

    requestRecommend = async () => {
        try {
            this.setState({refreshState: true});

            let info = this.props.navigation.state.params.info;
            info = info?info:this.props.info;
            let response = await fetch(recommendUrlWithId(info.id));
            let json = await response.json();
            let dataList = json.data.deals.map((info) => {
                return {
                    id: info.Id,
                    imageUrl: info.Image,
                    title: info.brandname,
                    subtitle: `[${info.range}]${info.title}`,
                    // price: info.price
                }
            });


            this.setState({
                data: dataList,
                refreshState: false,
            })
        } catch (error) {
            this.setState({
                refreshState: true,
            })
        }

    };

    keyExtractor = (item: Object, index: number) => {
        return item.id
    };


    renderHeader = () => {
        let info = this.props.navigation.state.params.info;
        info = info?info:this.props.info;
        return (
            <View>
                <View>
                    {(info.AdditionalLocationImages !== null && info.AdditionalLocationImages !== 'null') ?
                        <Image source={{uri: info.AdditionalLocationImages}} style={commonStyle.banner}/>
                        : <Image source={require('../../../../img/public/What2Book.png')} style={commonStyle.banner}/>}

                    <View style={{flexDirection: 'row', paddingTop: 20, paddingBottom: 20}}>
                        <View style={{flexDirection: 'column', width: screen.width * 0.2}}>
                            <View style={{alignItems: 'center'}}>
                                {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                                    <Image source={{uri: info.imageUrl}} style={[{
                                        width: screen.width * 0.2 * 0.5,
                                        height: screen.width * 0.2 * 0.5,
                                        resizeMode: 'cover',
                                    }]}/>
                                    : <Image source={require('../../../../img/public/shop.png')}
                                             style={[{
                                                 tintColor: '#696969',
                                                 width: screen.width * 0.2 * 0.5,
                                                 resizeMode: 'contain',
                                             }]}/>}
                            </View>
                        </View>
                        <View style={{width: screen.width * 0.7}}>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                    {info.title}
                                </Text>
                            </View>
                            <View style={{}}>
                                <Text style={{lineHeight: 25}}>
                                    {info.subtitle}
                                </Text>
                                <Text>
                                    Expires:14 days after purchase
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingTop: 10}}>
                                <StarRating
                                    // style={{marginBottom: 5}}
                                    maxStars={5}
                                    rating={3.5}
                                    disabled={true}
                                    starSize={15}
                                    onStarChange={(value) => this.onStarRatingPress(value)}
                                />
                                <Text style={{paddingLeft: 10, fontSize: 12}}>123 reviews</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'column', width: screen.width * 0.1}}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                this.setState({
                                    loveTintColor: this.state.loveTintColor === '#696969' ? '#ff4b1a' : '#696969'
                                })
                            }}>
                                <Image source={require('../../../../img/public/collection.png')} style={[{
                                    width: screen.width * 0.08,
                                    resizeMode: 'contain',
                                    tintColor: this.state.loveTintColor
                                }]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Separator/>

                </View>
                <AMapAndroid
                    style={commonStyle.mapImageStyle}
                    ref={component => this._amap = component}
                    options={{
                        centerCoordinate: {
                            longitude: info.Longitude,
                            latitude: info.Latitude
                        },
                        radius: 0,
                        zoomLevel: 18,//缩放比例级别
                    }}
                    zoomGestures={true}
                    scaleControls={false}
                    MapLanguage={"cn"}
                    fill_color={0x7a888888}
                    onMapClick={() => {
                        this.showActionSheet();
                    }}
                />
                <TouchableOpacity activeOpacity={0.9} style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                                  onPress={() => {
                                      this.showActionSheet();
                                  }}
                >
                    <View>
                        <Text style={{width: screen.width * 0.8}}>{info.subtitle}</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>
                        <Image style={commonStyle.arrow} source={require('../../../../img/public/right_arrow.png')}/>
                    </View>
                </TouchableOpacity>

                {/*<SpacingView />*/}

                <View style={commonStyle.tipHeader}>
                    <Heading3>About the Studio</Heading3>
                </View>
                <View style={{flexDirection: 'column', margin: 10}}>
                    <View style={{marginBottom: 5}}>
                        <Text style={{width: screen.width * 0.5}}>CONTACT</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Image style={{}} source={require('../../../../img/public/phone.png')}/>
                        <Text style={{marginLeft: 5, textDecorationLine: 'underline '}} onPress={() => {
                            Linking.openURL('tel:28050880')
                        }}>{info.phone}</Text>
                    </View>
                </View>

                {info.firmId !== null ? this.companyView(info) : <View/>}

            </View>
        )
    }

    renderCell = (rowData: any) => {
        return (
            <GroupPurchaseCell
                info={rowData.item}
                onPress={() => this.props.navigation.navigate('GroupPurchase', {info: rowData.item})}
            />
        )
    }

    getaMap(Longitude, Latitude) {
        fetch(amapStaticImg(Longitude, Latitude))
            .then((response) => {
                this.setState({mapImgUrl: response.url})
            }).catch(() => {
        })

    }

    companyView(info) {
        return (
            //   显示公司
            <TouchableOpacity activeOpacity={0.8} onPress={() => {

            }} style={{flexDirection: 'row', paddingTop: 20, paddingBottom: 20}}>
                <View style={{flexDirection: 'column', width: screen.width * 0.2}}>
                    <View style={{alignItems: 'center'}}>
                        {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                            <Image source={{uri: info.imageUrl}} style={[{
                                width: screen.width * 0.2 * 0.5,
                                height: screen.width * 0.2 * 0.5,
                                resizeMode: 'cover',
                            }]}/>
                            : <Image source={require('../../../../img/public/shop.png')}
                                     style={[{
                                         tintColor: '#696969',
                                         width: screen.width * 0.2 * 0.5,
                                         resizeMode: 'contain',
                                     }]}/>}
                    </View>
                </View>
                <View style={{width: screen.width * 0.7}}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>
                            Aeral Arts Academy
                        </Text>
                    </View>
                    <View style={{}}>
                        <Text style={{lineHeight: 25}}>
                            9 Shelter Street Causeway Bay Hong Kong Aerial Arts Academy lsland
                        </Text>
                        <Text>
                            Expires:14 days after purchase
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                        <StarRating
                            // style={{marginBottom: 5}}
                            maxStars={5}
                            rating={3.5}
                            disabled={true}
                            starSize={15}
                            onStarChange={(value) => this.onStarRatingPress(value)}
                        />
                        <Text style={{paddingLeft: 10, fontSize: 12}}>456 reviews</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}
                    >
                        <Image style={{}} source={require('../../../../img/public/phone.png')}/>
                        <Text style={{marginLeft: 5, textDecorationLine: 'underline '}} onPress={() => {
                            Linking.openURL('tel:28058888')
                        }}>(852) 28058888</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'column', width: screen.width * 0.1}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.setState({
                            loveTintColor: this.state.loveTintColor === '#696969' ? '#ff4b1a' : '#696969'
                        })
                    }}>
                        <Image source={require('../../../../img/public/right_arrow.png')} style={[{
                            width: screen.width * 0.08,
                            resizeMode: 'contain',
                            tintColor: this.state.loveTintColor
                        }]}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    schedule_Price() {
        return (
            <LinearGradient colors={screen.gradualColorBottom}
                            start={{x: 0.3, y: 0}}
                            end={{x: 1, y: 0.8}}
            >
                <View style={{justifyContent: 'space-between', flexDirection: 'row',}}>
                    <TouchableOpacity activeOpacity={0.5}
                                      onPress={() => {
                                          this.props.navigation.navigate('ScheduleScene'
                                              , {
                                                  commodityInfo: this.props.navigation.state.params.info,
                                              });
                                      }}
                                      style={{
                                          width: screen.width * 0.5,
                                          justifyContent: 'flex-end',
                                          alignItems: 'center',
                                          alignSelf: 'center',
                                          paddingTop: 10,
                                          paddingBottom: 10,
                                      }}
                    >
                        <Text style={{fontSize: 15, fontFamily: 'arial', color: '#ffffff', fontWeight: '200'}}>View
                            Schedule</Text>
                    </TouchableOpacity>
                    <View style={{
                        width: StyleSheet.hairlineWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}>
                    </View>

                    <TouchableOpacity activeOpacity={0.5}
                                      onPress={() => {
                                          alert('View Price')
                                      }}
                                      style={{
                                          width: screen.width * 0.5,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          alignSelf: 'center',
                                          paddingTop: 10,
                                          paddingBottom: 10,
                                      }}
                    >
                        <Text style={{fontSize: 15, fontFamily: 'arial', color: '#ffffff', fontWeight: '200'}}>View
                            Price</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        )
    }

//弹出底部菜单
    showActionSheet() {
        this.actionsheet.show();
    }

//  拷贝商家地址
    clickedCopyAddress() {
        let info = this.props.navigation.state.params.info;
        info = info?info:this.props.info;
        Clipboard.setString(info.title);
    }

// 定位商家  dat=androidamap://viewMap?sourceApplication=appname&poiname=abc&lat=36.2&lon=116.1&dev=0 静态数据
    clickedOpenInMaps() {
        let info = this.props.navigation.state.params.info;
        info = info?info:this.props.info;
        let shopLocation = info.title ? info.title : info.Name;
        let title = info.title ? info.title : info.Name;
        let longitude = info.Longitude;
        let latitude = info.Latitude;
        Linking.canOpenURL('androidamap://viewMap?sourceApplication=' + title + '&' + title + '=' + shopLocation + '&lat=' + latitude + '&lon=' + longitude + '&dev=0').then(supported => {
            if (supported) {
                Linking.openURL('androidamap://viewMap?sourceApplication=' + title + '&' + title + '=' + shopLocation + '&lat=' + latitude + '&lon=' + longitude + '&dev=0');
            } else {
                // toastShort(`请先安装XXX`);
                alert('Please install Amap');
            }
        });
    }

//  导航路线
    clickedOpenDirectons() {
        let info = this.props.navigation.state.params.info;
        info = info?info:this.props.info;
        let longitude = info.Longitude;
        let latitude = info.Latitude;

        Linking.canOpenURL('androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=' + longitude + '&dlat=' + latitude).then(supported => {
            if (supported) {
                Linking.openURL('androidamap://route?sourceApplication=appname&dev=0&m=0&t=0&dlon=' + longitude + '&dlat=' + latitude);
            } else {
                // toastShort(`请先安装XXX`);
                alert('Please install Amap');
            }
        });
    }

    getActionSheet() {

        let info = this.props.navigation.state.params.info;
        info = info?info:this.props.info;
        return (
            <ActionSheet
                mainTitle={info.title ? info.title : info.Name}
                itemTitles={["Copy Address", "Open in Maps", "Open Directions",]}
                selectionCallbacks={[this.clickedCopyAddress.bind(this), this.clickedOpenInMaps.bind(this), this.clickedOpenDirectons.bind(this)]}
                itemTitleColor='#006FFF'
                mainTitleTextAlign='center'
                contentBackgroundColor='#EFF0F1'
                cancelTitleColor='#FE2701'
                cancelVerticalSpace={5}
                borderRadius={5}
                sideSpace={6}
                bottomSpace={0}//底部间距
                ref={(actionsheet) => {
                    this.actionsheet = actionsheet
                }}
            />
        )
    }

    render() {
        return (

            <View style={[commonStyle.container,{backgroundColor:'#fff'}]}>
                <View style={{
                    position: 'absolute',
                    top: screen.statusBarHeight,
                    zIndex: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: screen.width,
                    backgroundColor: this.state.handerBgc,
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}
                               style={[commonStyle.callbackIcon, {}]}
                            // onPress={() => {
                            //     this.props.navigation.goBack();
                            // }}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={{color: '#fff'}}>STUDIO DETAIL</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../../../img/public/share.png')}
                               style={[commonStyle.callbackIcon, {}]}
                               onPress={() => {
                                   // this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    onScroll={(msg) => {
                        let dy = msg.nativeEvent.contentOffset.y;
                        if (dy >= 0) {
                            let opacity = Math.round(dy > 255 ? 255 : dy).toString(16);
                            this.setState({handerBgc: "#0F143A" + ((opacity.length === 1) ? '0' + opacity : opacity)});
                            StatusBar.setBackgroundColor("#0F143A" + ((opacity.length === 1) ? '0' + opacity : opacity));
                        }
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshState}
                            onRefresh={() => this.requestData()}
                            tintColor='gray'
                        />
                    }>
                    {this.renderHeader()}
                </ScrollView>
                {this.schedule_Price()}
                {this.getActionSheet()}
            </View>
        )
    }

}

