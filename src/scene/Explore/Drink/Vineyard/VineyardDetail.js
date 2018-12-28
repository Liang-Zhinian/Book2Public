import React, {PureComponent} from 'react'
import {
    ActivityIndicator,
    Image, ImageBackground,
    InteractionManager,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, WebView
} from 'react-native'
import {Separator} from '../../../../widget/index'
import {screen} from '../../../../common'
import StarRating from "../../../Common/StarRating";
import {commonStyle} from "../../../../widget/commonStyle";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import VineyardCell from "./VineyardCell";
import {getWineByVineyard, amapStaticImg, getWineByProducer} from "../../../../api";
import MasonryList from "../../../Common/Waterfall/MasonryList";
import PlacehoderImage from "../../../Common/Waterfall/PlaceholderImage";
import {Heading2} from "../../../../widget/Text";
import {color} from "../../../../widget";
import AMapAndroid from "../../../Api/AMapAndroid";
import LocalImage from "../../../../widget/LocalImage";
import AMap3D from "../../../Api/AMap.ios";
import * as ScreenUtil from "../../../Common/ScreenUtil";

type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}

const secToTime = (s) => {
    let h = 0, m = 0;
    if(s > 60){
        m = parseInt(s / 60);
        s = parseInt(s % 60);
        if(m > 60) {
            h = parseInt(i / 60);
            m = parseInt(i % 60);
        }
    }
    // 补零
    const zero = (v) => {
        return (v >> 0) < 10 ? ("0" + v) : v;
    };
    return (h === 0 ? [zero(m), zero(s)].join(":") : [zero(h), zero(m), zero(s)].join(":"));
};


const { width, height } = screen;
const itemWidth = (width - 16) / 2;

//酒庄详情
export default class VineyardDetail extends PureComponent<Props, State> {

    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            refreshState: false,
            loveTintColor: '#696969',
            handerBgc: '#69696900',
            WinedList:[],
            refreshStateRe: RefreshState.Idle,
            refreshing:false,
            title:'',
            isLoading:false,
            waiting: false
        }
    }

    componentWillUnmount() {
        StatusBar.setBackgroundColor("#0F143A00");
        // this.requestData();
        // this._onRefreshing();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.requestData();
            // this._getWine();
        })

    }


    renderWineList(){
        return (
            <View style={commonStyle.container}>
                <RefreshListView
                    style={{
                        width: screen.width,
                        flexDirection:'row',
                        backgroundColor:'#b3ffa0'
                    }}
                    data={this.state.WinedList}
                    // ListHeaderComponent={this.GetADList()}//广告位
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshStateRe}
                    onHeaderRefresh={this.requestData}
                    onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                    footerTextStyle={{color: '#8f8f8f'}}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={'no more data'}
                    footerEmptyDataText={'empty data'}
                />
            </View>
        )
    }

    renderWineListFalls() {
        return (
            <SafeAreaView style={styles.container}>
                <MasonryList
                    data={this.state.WinedList}
                    numColumns={2}
                    renderItem={this._renderItem}
                    getHeightForItem={this._getHeightForItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefreshing}
                    onEndReachedThreshold={0.5}
                    onEndReached={this._onEndReached}
                    keyExtractor={this._keyExtractor}
                />
            </SafeAreaView>
        )
    }
    _keyExtractor = (item, index) => {
        return item.text + index;
    };
    _onEndReached = () => {
        // this.setState({
        //     refreshing: false,
        // });
    };
    _onRefreshing = () => {
        this._getWine();
        // this.setState({
        //     refreshing: false,
        // });
    };

    _onPressContent = (item) => {
        // this.props.navigation.navigate('WineDetail', {item});
    };
    toWait(){
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }

    _renderItem = ({item}) => {
        const itemHeight = this._getHeightForItem({item});
        let {waiting} = this.state;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={waiting}
                onPress={() => {
                    this.setState({waiting: true});
                    this._onPressContent(item);
                    this.toWait();
                }}
                style={styles.item}>
                <PlacehoderImage
                    source={require('../../../../img/public/What2Book.png')}
                    placeholder={{uri: 'placeholder'}}
                    style={{width: itemWidth, height: itemHeight, borderRadius: 4}}
                />
                <View style={styles.itemText}>
                    {/*<Text style={{color: '#fff'}}>{secToTime(item.id)}</Text>*/}
                    {/*<Text style={{color: '#fff'}}>{item.title}</Text>*/}
                </View>
            </TouchableOpacity>
        )
    };
    _getHeightForItem = ({item}) => {
        return Math.max(itemWidth, itemWidth / 200 * 200);
    };
    requestData = async () => {
        this.page = 1;
        this._getWine();
    };
    nextPage=async()=>{
        ++this.page;
        //叠加翻页数据
        this.setState({refreshStateRe: RefreshState.FooterRefreshing});
        // this._getWine();
    };
    page = 1;
    dataLength=0;
    size=500;
    _getWine = async () => {
        this.setState({isLoading:true,WinedList:[]});
        let {title,id} = this.props.navigation.state.params.info;
        // console.log(this.props.navigation.state.params.info)
        await getWineByVineyard(title,id,this.page,this.size)
            .then((msg) => {
                if (msg!==undefined){
                    this.dataLength = this.state.WinedList.length;
                    let data = DrinkDetailDataUtils.requestWineData(msg);
                    // data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                    this.setState({
                        refreshing: false,
                        isLoading: false,
                        WinedList: this.state.WinedList.concat(data),
                        refreshStateRe: RefreshState.Idle,
                    }, () => {
                        if (this.state.WinedList.length === this.dataLength) {
                            this.setState({refreshStateRe: RefreshState.NoMoreData})
                        }
                    });
                }else {
                    this.setState({
                        refreshing: false,
                        isLoading:false,
                        refreshStateRe: RefreshState.NoMoreData,
                    });
                }
            })
            .catch((e) => {
                console.log('_getWine--->error', e);
            });
    };

    _getWineItem(){
        let info = this.props.navigation.state.params.info;
        let {WinedList,waiting} = this.state;
        let WineItem = WinedList.map((item) => {
            let hot = [3,3.5,4,4.5,5];
            let reviews = Math.floor((Math.random()*1000));
            let rating = hot[Math.floor((Math.random()*10)%4)];
            return(
                <TouchableOpacity
                    disabled={waiting}
                    activeOpacity={0.9}
                    style={[styles.container2,{paddingTop:5}]}
                    onPress={() => {
                        this.setState({waiting: true});
                        this.props.navigation.navigate('WineDetail', {info :item,reviews,rating});//跳到商品详情
                        this.toWait();
                    }}
                >
                    <View style={styles.rightContainer}>
                        <Heading2 style={{paddingTop: 5}}>{item.title}</Heading2>
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                            <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Color: </Text>
                            <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{item.Colour}</Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 10}}>
                            <StarRating
                                maxStars={5}
                                rating={3.5}
                                disabled={true}
                                starSize={15}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />
                            <Text style={{paddingLeft: 10, fontSize: ScreenUtil.setSpText(12),color:'#019eff'}}>{reviews} </Text>
                            <Text style={{ fontSize: ScreenUtil.setSpText(12)}}>reviews</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'column',}}>
                        {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                            <Image source={{uri: info.imageUrl}} style={styles.icon}/>
                            : <Image source={require('../../../../img/public/WineIcon.png')} style={styles.icon}/>}
                    </View>
                </TouchableOpacity>
            )

        });
        return WineItem
    }

    renderCell = (rowData: any) => {
        return (
            <VineyardCell
                info={rowData.item}
                onPress={() => {
                    this.setState({waiting: true});
                    console.log(rowData.item);
                    // let scene = this.state.title+'Scene';
                    // this.props.navigation.navigate(scene, {info: rowData.item})//跳到商品详情
                    this.toWait();
                }}
            />
        )
    };
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    getMapView(){
        let info = this.props.navigation.state.params.info;
        let url =   amapStaticImg();
        return (
            <AMapAndroid
                style={commonStyle.mapImageStyle}
                ref={component => this._amap = component}
                options={{
                    centerCoordinate: {
                        //113.23	23.16
                        // longitude:113.23,
                        // latitude:  23.16
                        longitude: info.Longitude,
                        latitude: info.Latitude
                    },
                    radius: 0,
                    zoomLevel: 18,//缩放比例级别
                }}
                zoomGestures={false}
                scaleControls={false}
                MapLanguage={"en"}
                fill_color={0x7a888888}
                // onMapClick={() => {
                //     this.showActionSheet();
                // }}
            />
        )
    }
    loadAMap() {
        let info = this.props.navigation.state.params.info;
        return (
            <View style={commonStyle.mapImageStyle}>
                <AMap3D
                    locationEnabled={false}
                    zoomLevel={14}
                    coordinate={{
                        longitude: parseFloat(info.Longitude),
                        latitude: parseFloat(info.Latitude)
                    }}
                    zoomEnabled={false}
                    scrollEnabled={false}
                    ref={component => this._amap = component}
                    onFormattedAddressReceived={this.onFormattedAddressReceived}
                    onMapLoaded={(e) => {
                        console.warn('onMapLoaded--->' + e)
                    }}
                    onLongPressEvent={(e) => {

                    }}
                    onMarkerPress={(index) => {
                    }}
                    onPressEvent={(e) => {
                    }}
                />
            </View>
        );
    }

    renderHeader = () => {
        let {info,distance,reviews,rating } = this.props.navigation.state.params;
        this.setState({title:info.title});
        let {isLoading,waiting} = this.state;
        return (
            <View>
                <View>
                    {(info.AdditionalLocationImages !== null && info.AdditionalLocationImages !== 'null')
                        ?<Image source={{uri: info.AdditionalLocationImages}} style={commonStyle.banner}/>
                        :<ImageBackground source={require('../../../../img/public/Book2_Producer_Background.png')} style={[commonStyle.banner,{justifyContent:'center',alignItem:'center',alignSelf:'center'}]}>
                            <Image source={require('../../../../img/public/Book2_Vineyard_Word.png')}
                                   style={{alignSelf:'center' }}/>
                        </ImageBackground>
                    }

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
                                <Text style={{fontWeight: 'bold', fontSize: 15,fontFamily:'arial',color:'#000'}}>
                                    {info.title}
                                </Text>
                            </View>
                            {/*{(info.URL!==null&&info.URL!=='')&&<View style={{}}>*/}
                                {/*<Text style={{lineHeight: 25}}>*/}
                                    {/*Website: {info.URL}*/}
                                {/*</Text>*/}
                               {/**/}
                            {/*</View>}*/}
                            {
                                distance !== 'NaNm' &&
                                <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                                    <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Away from you: </Text>
                                    <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{distance}</Text>
                                </View>
                            }
                            <View style={{flexDirection: 'row', paddingTop: 5}}>
                                <StarRating
                                    // style={{marginBottom: 5}}
                                    maxStars={5}
                                    rating={rating}
                                    disabled={true}
                                    starSize={15}
                                    onStarChange={(value) => this.onStarRatingPress(value)}
                                />
                                <Text style={{paddingLeft: 10, fontSize: ScreenUtil.setSpText(12),color:'#019eff'}}>{reviews} </Text>
                                <Text style={{ fontSize: ScreenUtil.setSpText(12)}}>reviews</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'column', width: screen.width * 0.1}}>
                            <TouchableOpacity   disabled={waiting} activeOpacity={0.8} onPress={() => {
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
                {/*{this.getMapView()}*/}
                {this.loadAMap()}
                {/*<TouchableOpacity activeOpacity={0.9} style={{*/}
                {/*padding: 10,*/}
                {/*flexDirection: 'row',*/}
                {/*justifyContent: 'space-between'*/}
                {/*}}*/}
                {/*onPress={() => {*/}
                {/*// this.showActionSheet();*/}
                {/*}}*/}
                {/*>*/}
                {/*<View>*/}
                {/*<Text style={{width: screen.width * 0.8}}>{info.subtitle}</Text>*/}
                {/*</View>*/}
                {/*<View style={{flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>*/}
                {/*<Image style={commonStyle.arrow} source={require('../../../../img/public/right_arrow.png')}/>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                {/*{this.renderWineList()}*/}
                {/*{console.log(this.state.WinedList)}*/}
                {isLoading?this.showLoading():this._getWineItem()}
                {/*<ContentWaterfall data={this.state.WinedList} onPressContent={(item)=>{*/}
                {/*this.props.navigation.navigate('WineDetail', {item});*/}
                {/*}} />*/}

            </View>
        )
    };

    render() {
        let {title,waiting} = this.state;
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
                    <TouchableOpacity activeOpacity={0.5}   disabled={waiting} onPress={() => {
                        this.setState({waiting: true});
                        this.props.navigation.goBack();
                        this.toWait();
                    }}>
                        <Image source={LocalImage.goBackIcon}
                               disabled={waiting}
                               style={[commonStyle.callbackIcon, {}]}
                               onPress={() => {
                                   this.setState({waiting: true});
                                   this.props.navigation.goBack();
                                   this.toWait();
                               }}
                        />
                    </TouchableOpacity>
                    <View style={{width:screen.width*0.8,alignItems:'center'}}>
                        <Text numberOfLines={1} style={{fontWeight: '400', fontSize: 15,fontFamily:'arial',color:'#fff'}}>{title.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.5}   disabled={waiting} onPress={() => {
                        this.setState({waiting: true});
                        this.props.navigation.goBack();
                        this.toWait()
                    }}>
                        <Image source={require('../../../../img/public/share.png')}
                               style={[commonStyle.callbackIcon, {}]}
                               disabled={waiting}
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
                            this.setBackgroundColorAsync("#0F143A" + ((opacity.length === 1) ? '0' + opacity : opacity));
                        }
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshState}
                            onRefresh={() => this.requestData()}
                            tintColor='gray'
                        />
                    }
                >
                    {this.renderHeader()}
                </ScrollView>
            </View>
        )
    }

    setBackgroundColorAsync = (color)=>{
        setTimeout(function(){
            StatusBar.setBackgroundColor(color);
        },50)
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:screen.width,
        height:500,
        backgroundColor:'#0064ff'
    },
    item: {
        margin: 4,
    },
    itemText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 30,
        backgroundColor: '#ff4f70',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
    container2: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        width:screen.width*0.95,
        alignSelf:'center',
        marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: '#fff',
        borderRadius:3,
    },
    rightContainer: {
        flex: 1,
        backgroundColor:"#9dff4f00",
        justifyContent:'space-between'
    },
    icon: {
        width: 50,
        height:50,
        // paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
});