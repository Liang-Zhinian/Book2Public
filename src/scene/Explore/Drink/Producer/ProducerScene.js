import React, {Component} from 'react'
import {
    ActivityIndicator, AsyncStorage,
    BVLinearGradient,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {screen} from '../../../../common';
import {getProducerByName, getProducerByGPS} from "../../../../api";
import {color} from "../../../../widget";
import {commonStyle} from "../../../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";
import {Heading2, Paragraph} from "../../../../widget/Text";
import RefreshListView, {RefreshState} from "react-native-refresh-list-view";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import StarRating from "../../../Common/StarRating";
import LocalImage from "../../../../widget/LocalImage";
import * as ScreenUtil from "../../../Common/ScreenUtil";

//酒庄列表
export default class ProducerScene extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            dataList:null,
            SignToken:null,
            timestamp:new Date().getTime(),
            nonce:Math.floor(Math.random() * 10000000000),
            refreshState: RefreshState.Idle,
            ProducerList:[],
            LatLng:{},
            radius:0,
            zoom:12.5,
            letter:'A',
            picker2Value: '',
            NoData:false,
            searchKey: null,
            isLoading:false,
            letterSelect:true,
            onSearch:false,
            LocationSearchKey:null,
            waiting:false,
        }
    }


    componentWillMount() {
        this.getLatLngLog();
        // fetch('http://demo.atpath.com:17509/api/Service/GetToken?appid=123456789&appsecret=123456789', {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'timestamp': this.state.timestamp,
        //         'appid': '123456789',
        //         'nonce':  this.state.nonce
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         this.setState({SignToken:responseJson.Data.SignToken});
        //     })
        //     .catch((error) => {
        //         console.w(error);
        //     });
    }
    page=1;
    dataLength=0;
    size=50;
    type=1;
    _getProducerByName = async (name) => {
        this.setState({
            onSearch: true,
            isLoading: true
        });
        await  getProducerByName(name, this.page, this.size, this.type)
            .then((msg) => {
                if (msg !== undefined) {
                    this.dataLength = this.state.ProducerList.length;
                    let data = DrinkDetailDataUtils.requestProducerData(msg);
                    data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                    this.setState({
                        isLoading: false,
                        ProducerList: this.state.ProducerList.concat(data),
                        refreshState: RefreshState.Idle,
                    }, () => {
                        if (this.state.ProducerList.length === this.dataLength) {
                            this.setState({refreshState: RefreshState.NoMoreData})
                        }
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshState: RefreshState.NoMoreData,
                    })
                }
            })
            .catch((e) => {
                console.warn("console.warn",e);
                this.setState({
                    isLoading: false,
                    refreshState: RefreshState.NoMoreData,
                })
            });
    };
    _getProducerByGPS = async (latitude,longitude,radius) => {
        this.setState({
            onSearch:true,
            isLoading:true
        });
        await  getProducerByGPS(latitude,longitude,radius)
            .then((msg) => {
                if (msg !== undefined) {
                    this.dataLength = this.state.ProducerList.length;
                    let data = DrinkDetailDataUtils.requestProducerData(msg);
                    data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                    this.setState({
                        isLoading: false,
                        ProducerList: this.state.ProducerList.concat(data),
                        refreshState: RefreshState.Idle,
                    }, () => {
                        if (this.state.ProducerList.length === this.dataLength) {
                            this.setState({refreshState: RefreshState.NoMoreData})
                        }
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshState: RefreshState.NoMoreData,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshState: RefreshState.NoMoreData,
                })
            })
    };

    // stringToBytes(str) {
    //     var bytes = new Array();
    //     var len, c;
    //     len = str.length;
    //     for(var i = 0; i < len; i++) {
    //         c = str.charCodeAt(i);
    //         if(c >= 0x010000 && c <= 0x10FFFF) {
    //             bytes.push(((c >> 18) & 0x07) | 0xF0);
    //             bytes.push(((c >> 12) & 0x3F) | 0x80);
    //             bytes.push(((c >> 6) & 0x3F) | 0x80);
    //             bytes.push((c & 0x3F) | 0x80);
    //         } else if(c >= 0x000800 && c <= 0x00FFFF) {
    //             bytes.push(((c >> 12) & 0x0F) | 0xE0);
    //             bytes.push(((c >> 6) & 0x3F) | 0x80);
    //             bytes.push((c & 0x3F) | 0x80);
    //         } else if(c >= 0x000080 && c <= 0x0007FF) {
    //             bytes.push(((c >> 6) & 0x1F) | 0xC0);
    //             bytes.push((c & 0x3F) | 0x80);
    //         } else {
    //             bytes.push(c & 0xFF);
    //         }
    //     }
    //     return bytes;
    // }
    //  byteToString(arr) {
    //     if(typeof arr === 'string') {
    //         return arr;
    //     }
    //     var str = '',
    //         _arr = arr;
    //     for(var i = 0; i < _arr.length; i++) {
    //         var one = _arr[i].toString(2),
    //             v = one.match(/^1+?(?=0)/);
    //         if(v && one.length == 8) {
    //             var bytesLength = v[0].length;
    //             var store = _arr[i].toString(2).slice(7 - bytesLength);
    //             for(var st = 1; st < bytesLength; st++) {
    //                 store += _arr[st + i].toString(2).slice(2);
    //             }
    //             str += String.fromCharCode(parseInt(store, 2));
    //             i += bytesLength - 1;
    //         } else {
    //             str += String.fromCharCode(_arr[i]);
    //         }
    //     }
    //     return str;
    // }
    // GetAppellation(){
    //     let timeStamp = this.state.timestamp,
    //         nonce =this.state.nonce,
    //         appid = '123456789',
    //         SignToken = this.state.SignToken,
    //         data = 'id=1';
    //
    //     let signStr = timeStamp.toString() +nonce.toString()+ appid + SignToken + data;
    //     let signStrMD5 = md5.hex_md5(signStr);
    //     // let strByte=this.stringToBytes(signStr);
    //     // console.log(signStr);
    //     // console.log(signStrMD5);
    //     //1534831887010177366844012345678940b8cd00-d4c9-4e67-87b4-7d816c99f1aeid1namewahaha
    //
    //     // console.log(signStr,timeStamp);
    //
    //     fetch('http://demo.atpath.com:17509/api/Region/GetRegion?type=country', {
    //         method: 'GET',
    //         data:{type:'country'},
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson)
    //         })
    //         .catch((error) => {
    //             console.warn('请求错误',error);
    //         });
    // }
    // hexCharCodeToStr(hexCharCodeStr) {
    //     var trimedStr = hexCharCodeStr.trim();
    //     var rawStr =
    //         trimedStr.substr(0,2).toLowerCase() === "0x"
    //             ?
    //             trimedStr.substr(2)
    //             :
    //             trimedStr;
    //     var len = rawStr.length;
    //     if(len % 2 !== 0) {
    //         alert("Illegal Format ASCII Code!");
    //         return "";
    //     }
    //     var curCharCode;
    //     var resultStr = [];
    //     for(var i = 0; i < len;i = i + 2) {
    //         curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    //         resultStr.push(String.fromCharCode(curCharCode));
    //     }
    //     return resultStr.join("");
    // }

    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress',  ()=> {
        //     // this.props.navigation.goBack()
        //     return true;
        // });
    }
    toWait(){
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }
    getLatLngLog(){
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error,result)=>{
                    if (error||result==null){
                        console.log('取值失败');
                        this.setState({
                            isLoading: false,
                            refreshState: RefreshState.Failure,
                        })
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
                    }
                }
            );
        }catch(error){
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度'+error);
        }
    }
    getDistance(lat1, lng1, lat2, lng2) {
        let dis = 0;
        let radLat1 = toRadians(lat1);
        let radLat2 = toRadians(lat2);
        let deltaLat = radLat1 - radLat2;
        let deltaLng = toRadians(lng1) - toRadians(lng2);
        dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;

        function toRadians(d) {
            return d * Math.PI / 180;
        }
    }
    renderCell = (rowData: any) => {
        let {waiting,LatLng} = this.state;
        let img=LocalImage.countryImgList[rowData.item.Country];
        let distance = this.getDistance(LatLng.latitude, LatLng.longitude, rowData.item.Latitude, rowData.item.Longitude);
        distance = Math.floor(distance / 1000) > 0 ? Math.floor(distance / 1000) + 'km' : Math.floor(distance) + 'm';
        let hot = [3,3.5,4,4.5,5];
        let reviews = Math.floor((Math.random()*1000));
        let rating = hot[Math.floor((Math.random()*10)%4)];
        return (
            <TouchableOpacity
                disabled={waiting}
                activeOpacity={0.9}
                style={styles.container2}
                onPress={() => {
                    this.setState({waiting: true});
                    this.props.navigation.navigate('ProducerDetail', {info: rowData.item,distance:distance,reviews:reviews,rating:rating});//跳到商品详情
                    this.toWait();
                }}
            >
                <View style={styles.rightContainer}>
                    <Heading2 style={{paddingTop: 5}}>{rowData.item.title}</Heading2>
                    {
                        distance !== 'NaNm' &&
                        <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                            <Text style={{fontSize: ScreenUtil.setSpText(12)}}>Away from you: </Text>
                            <Text style={{fontSize: ScreenUtil.setSpText(12), color: '#019eff'}}>{distance}</Text>
                        </View>
                    }
                    <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 0}}>
                        <Text style={{ fontSize: ScreenUtil.setSpText(12)}}>Number of Wines: </Text>
                        <Text style={{ fontSize: ScreenUtil.setSpText(12),color:'#019eff'}}>{rowData.item.WineCount}</Text>
                    </View>
                    {img && <View style={[{flexDirection: 'row', paddingTop: 5,justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'flex-start',}]}>
                        {/*<Text style={{fontSize: ScreenUtil.setSpText(12)}}>Country: </Text>*/}
                        <Image style={{width: 22.4, height: 14.7}} source={img}/>
                        <Text style={{
                            fontSize: ScreenUtil.setSpText(13),
                            color: '#019eff'
                        }}>  {rowData.item.Country} </Text>
                    </View>}
                    <View style={{flexDirection: 'row', paddingTop: 5, marginBottom: 10}}>
                        <StarRating
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
                <View style={[commonStyle.center,{flexDirection: 'column',}]}>
                    <Image source={require('../../../../img/public/ProducerIcon.png')} style={styles.icon}/>
                </View>
            </TouchableOpacity>
        )
    };
    requestData = async () => {
        this.page=1;
        this.setState({
            ProducerList:[],
            refreshState:RefreshState.HeaderRefreshing
        });
        let {searchKey,LocationSearchKey,LatLng,radius} = this.state;
        if (searchKey !== null) {
            // this.setState({ProducerList: []});
            this._getProducerByName(searchKey);
        } else if (LocationSearchKey!==null){
            // this.setState({ProducerList: []});
            this._getProducerByGPS(LatLng.latitude,LatLng.longitude,radius);
        }
        else {
            this.props.setShowSliderBar && this.props.setShowSliderBar(true);
            if (searchKey === null) {
                this._getProducerByName('')
            } else {
                this._getProducerByName(searchKey);
            }
        }
    };
    nextPage=async()=>{
        ++this.page;
        //叠加翻页数据
        this.setState({refreshState: RefreshState.FooterRefreshing});
        let {searchKey,LocationSearchKey,LatLng,radius} = this.state;
        // this.props.setShowSliderBar && this.props.setShowSliderBar(true);
        if (searchKey!==null) {
            this._getProducerByName(searchKey);
            // this.setState({refreshState: RefreshState.NoMoreData})//暂时没有分页,临时停止翻页刷新
        } else if (LocationSearchKey!==null){
            // this._getProducerByGPS(LatLng.latitude,LatLng.longitude,radius);
            this.setState({refreshState: RefreshState.NoMoreData})//暂时没有分页,临时停止翻页刷新
        }
    };

    // _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    //     return (
    //         <View style={{width:screen.width,marginLeft:10,height:screen.onePixel,backgroundColor:'#ffffff50'}}/>
    //     )
    // }
    // _renderHeader(){
    //     return (
    //         <View style={[{height:30}, {backgroundColor:'red'},{justifyContent: 'center'}]}>
    //             <Text style={[{textAlign: 'center'}]}>头部视图</Text>
    //         </View>
    //     );
    // }
    showNoDataMsg() {
        return (
            <View style={{alignItems:'center',
            backgroundColor:'#0000'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    No matched search result is returned.
                </Text>
            </View>
        )
    }
    showNoSearchMsg() {
        return (
            <View style={{alignItems:'center',
            backgroundColor:'#0000'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please enter keywords to search.
                </Text>
            </View>
        )
    }
    showNoSelectLetter() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please scroll to left to select a letter to search...
                </Text>
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

    renderProducerList(){
        return (
            (this.state.ProducerList.length > 0
                    ? <RefreshListView
                        style={{
                            width: screen.width,
                            marginTop: 5,
                            backgroundColor: '#ffffff00'
                        }}
                        data={this.state.ProducerList}
                        renderItem={this.renderCell}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
                        onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                        footerTextStyle={{color: '#ffffff'}}
                        footerRefreshingText={'loading...'}
                        footerFailureText={'click refresh'}
                        footerNoMoreDataText={' '}
                        footerEmptyDataText={'empty data'}
                        // onEndReached={(info:{distanceFromEnd: number}) => {
                        //     // this.nextPage();
                        //     console.log('onEndReached');
                        //     // this.setState({
                        //     //     refreshState:RefreshState.EmptyData
                        //     // });
                        // }}
                    />
                    : (this.state.isLoading ? this.showLoading() : (this.state.NoData && this.showNoDataMsg()))
            )
        )
    }
    // _renderRightLetters(letter, index) {
    //     return (
    //         <TouchableOpacity
    //             key={'letter_idx_' +this.page.toString()+''+ index}
    //             activeOpacity={0.6}
    //             onPress={() => {
    //                 this.refs.toast.show(letter);
    //                 this.setState({
    //                     letter: letter,
    //                     refreshState: RefreshState.FooterRefreshing,
    //                     ProducerList: [],
    //                     searchKey: 'What to',
    //                 },()=>{
    //                     this.requestData()
    //                 });
    //                 // this.requestData();
    //                 // this._scrollTo(index, letter)
    //             }}>
    //             <View style={styles.letter}>
    //                 <Text style={styles.letterText}>{letter}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     );
    // }
    render = () => {
        let {searchKey,LocationSearchKey,waiting} =this.state;
        return (
            <LinearGradient colors={screen.colorTemp}
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
                            }}
                        >
                            <Image source={LocalImage.goBackIcon}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={waiting}
                            activeOpacity={0.8}
                            style={commonStyle.BarTitle}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'arial',
                            }}>Producers</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        disabled={waiting}
                        activeOpacity={0.9}
                        style={[commonStyle.searchBar]}
                        underlineColorAndroid='white'
                        onPress={() => {
                            this.setState({waiting: true});
                            this.props.navigation.navigate('Drink2SearchScene'
                                , {
                                    callback: (msg) => {
                                        if (this.state.refreshState === RefreshState.NoMoreData) {
                                            this.page = 1
                                        }
                                        this.setState({
                                            searchKey: msg,
                                            ProducerList:[],
                                            // ProducerList: [{
                                            //     key: 456,
                                            //     id: 456,
                                            //     imageUrl: null,
                                            //     title: 'Hello Peter',
                                            //     subtitle: 'apple pen',
                                            //     phone: 9558895588,
                                            //     Latitude: 24,
                                            //     Longitude: 12,
                                            //     AdditionalLocationImages: null,
                                            //     firmId: 12,
                                            //     Email:'www.zc1415509576@163.com',
                                            //     URL:'www.baidu.com',
                                            //     WineCount:45,
                                            //     Country:'Italy'
                                            // }],
                                            // onSearch: true,
                                            // LocationSearchKey: null,
                                            // isLoading: false,
                                            // refreshState: RefreshState.NoMoreData,
                                        });
                                            this._getProducerByName(msg);
                                    }
                                });
                            this.toWait();
                        }}
                    >
                        <Image source={require('../../../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={commonStyle.searchText}>{(searchKey === null || searchKey === '') ? 'What to' : searchKey} </Text>
                        {(searchKey === null || searchKey === '') ?<Text style={commonStyle.searchText2}>search?</Text> : <Text/>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={waiting}
                        style={commonStyle.searchBar}
                        underlineColorAndroid='white'
                        onPress={() => {
                            this.setState({waiting: true});
                            this.props.navigation.navigate('ExploreRangeScene'
                                , {
                                    callbackLocation: (address, latitude, longitude, name, radius) => {
                                        this.setState({
                                            ProducerList: [],
                                            LocationSearchKey: address,
                                            searchKey: null,
                                            LatLng: {
                                                latitude: latitude,
                                                longitude: longitude
                                            },
                                            radius: radius
                                        }, () => {
                                            this._getProducerByGPS(latitude, longitude, radius);
                                        });
                                    },
                                    category: 'Producer',
                                }
                            );
                            this.toWait();
                        }}
                    >
                        <Image source={LocalImage.locationIcon} style={commonStyle.searchIcon}/>
                        <Text style={commonStyle.searchText}>{LocationSearchKey === null ? 'Select the' : LocationSearchKey} </Text>
                        {LocationSearchKey === null && <Text style={commonStyle.searchText2}>area</Text>}
                    </TouchableOpacity>
                </View>
                {!this.state.onSearch ? this.showNoSearchMsg() : this.renderProducerList()}
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F4F4F400',
    },
    listContainner: {
        height: Dimensions.get('window').height,
        marginBottom: 10
    },
    contentContainer: {
        flexDirection: 'row',
        width: screen.width,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    letters: {
        position: 'absolute',
        height: screen.height,
        top: 0,
        bottom: 0,
        right: 3,
        backgroundColor: '#ffffff00',
        alignItems: 'center',
        justifyContent: 'center'
    },
    letter: {
        justifyContent: 'center',
        alignItems: 'center',
        width:30,
        backgroundColor:'#ff7d69',
        borderRadius:50,
        marginTop:2
    },
    letterText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ffffff',
        fontFamily:'arial'
    },
    sectionView: {
        paddingTop: 5,
        paddingBottom: 5,
        height: 30,
        paddingLeft: 10,
        width: screen.width,
        backgroundColor: '#F4F4F4'
    },
    sectionText: {
        color: '#e75404',
        fontWeight: 'bold'
    },
    rowView: {
        marginBottom:5,
        backgroundColor:'#fff',
        borderRadius:4,
        width:screen.width*0.95
    },
    rowdata: {
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
    },

    rowdatatext: {
        color: 'gray',
        width: screen.width
    },

    rowViewBox: {
        height: 40,
        width: (screen.width - 30) / 3,
        flexDirection: 'row',
        backgroundColor: '#ffffff'
    },
    rowdataBox: {
        borderWidth: 1,
        borderColor: '#DBDBDB',
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 2,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowDataTextBox: {
        marginTop: 5,
        flex: 1,
        height: 20
    },
    pickerContainer: {
        flexDirection:'row',
        paddingTop:0,
        paddingBottom:0,
        width:screen.width
    },
    picker: {
        flex: 1,
    },
    icon: {
        width: 50,
        height:50,
        // paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
});