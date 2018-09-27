import React, {Component} from 'react'
import {
    ActivityIndicator, BackHandler,
    BVLinearGradient,
    Dimensions,
    Image, InteractionManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {screen} from '../../../../common';
import {getAllProducer, getProducerByName} from "../../../../api";
import {color} from "../../../../widget";
import Toast from '../../../../../src/scene/demo&test/react-native-city/ToastUtil'
import {commonStyle} from "../../../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";
import {Heading2, Paragraph} from "../../../../widget/Text";
import RefreshListView, {RefreshState} from "react-native-refresh-list-view";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import HorizontalPicker from "../../../Mine/hpicker";
import StarRating from "../../../Common/StarRating";
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
            letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            letter:'A',
            picker2Value: '',
            NoData:false,
            searchKey: null,
            isLoading:false,
            letterSelect:true,
            onSearch:false,
        }

    }


    componentWillMount() {
        fetch('http://demo.atpath.com:17509/api/Service/GetToken?appid=123456789&appsecret=123456789', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'timestamp': this.state.timestamp,
                'appid': '123456789',
                'nonce':  this.state.nonce
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({SignToken:responseJson.Data.SignToken});
            })
            .catch((error) => {
                console.w(error);
            });
    }
    page=1;
    dataLength=0;
    size=50;
    type=1;
    _getAllProducer = async () => {
        this.setState({
            onSearch:true,
            isLoading:true});
        let letterT = this.state.picker2Value;

        await  getAllProducer('ByA',letterT,this.page,this.size, this.type)
            .then((msg) => {
                this.dataLength = this.state.ProducerList.length;
                let data = DrinkDetailDataUtils.requestProducerData(msg);
                data.length>0?this.setState({NoData:false}):this.setState({NoData:true});
                data.pop();
                this.setState({
                    isLoading:false,
                    ProducerList: this.state.ProducerList.concat(data),
                    refreshState: RefreshState.Idle,
                },()=>{
                    // console.log(this.state.ProducerList.length,this.dataLength);
                    if (this.state.ProducerList.length===this.dataLength){
                        this.setState({refreshState:RefreshState.NoMoreData})
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
    _getProducerByName = async (name) => {
        this.setState({onSearch:true,
            isLoading:true});
        await  getProducerByName(name, this.page, this.size, this.type)
            .then((msg) => {
                this.dataLength = this.state.ProducerList.length;
                let data = DrinkDetailDataUtils.requestProducerData(msg);
                // console.log(data);
                data.length>0?this.setState({NoData:false}):this.setState({NoData:true});
                data.pop();
                this.setState({
                    isLoading:false,
                    ProducerList:this.state.ProducerList.concat(data),
                    refreshState: RefreshState.Idle,
                },()=>{
                    // console.log(this.state.ProducerList.length,this.dataLength);
                    if (this.state.ProducerList.length===this.dataLength){
                        this.setState({refreshState:RefreshState.NoMoreData})
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

    componentDidMount(){


        // BackHandler.addEventListener('hardwareBackPress',  ()=> {
        //     // this.props.navigation.goBack()
        //     return true;
        // });
    }

    renderCell = (rowData: any) => {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.container2}
                    onPress={() => {
                        console.log('renderCell',rowData);
                        this.props.navigation.navigate('ProducerDetail', {info: rowData.item})//跳到商品详情
                    }}
                >
                    <View style={styles.rightContainer}>
                        <Heading2 style={{paddingTop:5}}>{rowData.item.title}</Heading2>
                        {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
                            {/*<Paragraph numberOfLines={0} style={{*/}
                                {/*marginTop: 5,*/}
                                {/*width: screen.width * 0.9 - 80*/}
                            {/*}}>{rowData.item.subtitle?rowData.item.subtitle:'This is a fixed demo data, including telephone and comment.'}</Paragraph>*/}

                        {/*</View>*/}
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 0, marginBottom: 10}}>
                        <StarRating
                            // style={{marginBottom: 5}}
                            maxStars={5}
                            rating={3.5}
                            disabled={true}
                            starSize={15}
                            onStarChange={(value) => this.onStarRatingPress(value)}
                        />
                        <Text style={{paddingLeft:10,fontSize:12}}>456 reviews</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };
    requestData = async () => {
        this.setState({
            ProducerList:[],
            refreshState:RefreshState.HeaderRefreshing
        });
        this._getAllProducer()
        // this._getWine();
    };
    nextPage=async()=>{
        ++this.page;
        //叠加翻页数据
        this.setState({refreshState: RefreshState.FooterRefreshing});
        if (this.state.searchKey!==null) {
             this._getProducerByName(this.state.searchKey);
       }else {
             this._getAllProducer();
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
            <View style={{alignItems:'center'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    No matched search result is returned.
                </Text>
            </View>
        )
    }
    showNoSearchMsg() {
        return (
            <View style={{alignItems:'center'}}>
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
                        footerNoMoreDataText={'no more data'}
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
        let {searchKey} =this.state;
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient, {}]}>
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }]}>
                    <View style={{justifyContent:'space-between',alignItems: 'center', flexDirection: 'row',width:screen.width,marginTop:5}}>
                        <TouchableOpacity style={{
                            zIndex: 999,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingRight: 50,
                            paddingLeft:screen.width*0.025
                        }} onPress={() => {
                            this.props.navigation.goBack();//返回按钮图片
                        }}>
                            <Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                alignItems: 'center',
                                position: 'absolute',
                                left: 0,
                                right: 0,
                            }}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'arial',
                            }}>Producers</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity*/}
                            {/*style={{*/}
                                {/*paddingBottom: 10,*/}
                                {/*paddingTop: 10,*/}
                                {/*paddingLeft: 50,*/}
                                {/*paddingRight: screen.width * 0.025,*/}
                            {/*}}*/}
                            {/*onPress={() => {*/}
                                {/*// this.requestAnimationFrame(() => {*/}
                                {/*this.toggle()*/}
                                {/*// });*/}
                            {/*}}>*/}
                            {/*<Image source={require('../../../img/nearby/country.png')}*/}

                                   {/*style={{*/}
                                       {/*tintColor:'#fff',*/}
                                       {/*// backgroundColor: '#ffaaaa',*/}
                                       {/*width: 20,*/}
                                       {/*height: 20,*/}
                                       {/*alignSelf: 'flex-end',*/}
                                   {/*}}/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[commonStyle.searchBar, {}]}
                        underlineColorAndroid='white'
                        onPress={() => {
                            this.props.navigation.navigate('Drink2SearchScene'
                                , {
                                    callback: (msg) => {

                                        if (this.state.refreshState === RefreshState.NoMoreData) {
                                            this.page = 1
                                        }
                                        this.setState({
                                            searchKey: msg,
                                            ProducerList: []
                                        });
                                        this._getProducerByName(msg);
                                    }
                                });
                        }}
                    >
                        <Image source={require('../../../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={{
                            paddingLeft: 10,
                            fontSize: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            color: '#e5e5e5'
                        }}>{(searchKey === null || searchKey === '')?'What to':searchKey} </Text>
                        {(searchKey === null || searchKey === '') ?
                            <Text style={{
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color: '#fff'
                            }}>search?</Text> : <Text/>}
                    </TouchableOpacity>

                    {/*<View style={styles.letters}>*/}
                    {/*{this.state.letters.map((letter, index) => this._renderRightLetters(letter, index))}*/}
                    {/*</View>*/}
                </View>
                {/*<View*/}
                    {/*style={{*/}
                        {/*flexDirection:'row',*/}
                        {/*justifyContent:'space-between',*/}
                        {/*paddingLeft:10,*/}
                        {/*paddingRight:10,*/}
                        {/*alignItems:'center'*/}
                    {/*}}*/}
                {/*>*/}
                    {/*<View style={{}}>*/}
                        {/*<Text style={{color: '#fff', fontSize: 14, fontFamily: 'arial'}}>*/}
                            {/*Please scroll to left to select a letter to search...*/}
                        {/*</Text>*/}
                    {/*</View>*/}
                    {/*<View>*/}
                    {/*<TouchableOpacity*/}
                        {/*activeOpacity={0.9}*/}
                        {/*style={{*/}
                            {/*justifyContent: 'flex-end',*/}
                            {/*backgroundColor: '#ffffff00',*/}
                            {/*borderRadius: 3,*/}
                            {/*marginRight: 10,*/}
                            {/*padding:3*/}
                        {/*}}*/}
                        {/*onPress={() => {*/}
                            {/*this.setState({*/}
                                {/*ProducerList: [],*/}
                                {/*searchKey: 'What to',*/}
                                {/*letterSelect:false,*/}
                                {/*refreshState:RefreshState.Idle*/}
                            {/*});*/}
                            {/*this.requestData();*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<Text style={{color: '#ffb706', fontSize: 14, fontFamily: 'arial',}}>*/}
                            {/*Search*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                {/*</View>*/}
                {/*<View style={styles.pickerContainer}>*/}
                    {/*<HorizontalPicker*/}
                        {/*style={styles.picker}*/}
                        {/*itemWidth={40}*/}
                        {/*selectedValue={this.state.picker2Value}*/}
                        {/*foregroundColor='#7c7c7c'*/}
                        {/*foregroundWeight={'bold'}*/}
                        {/*onChange={i => {*/}
                            {/*// this.refs.toast.show(i);*/}
                            {/*this.setState({*/}
                                {/*picker2Value: i,*/}
                                {/*letter: i,*/}
                                {/*refreshState: RefreshState.FooterRefreshing,*/}
                                {/*// ProducerList: [],*/}
                                {/*searchKey: 'What to',*/}
                            {/*}, () => {*/}
                                {/*// this.requestData()*/}
                            {/*});*/}
                        {/*}}>*/}
                        {/*{this.state.letters.map(item =>*/}
                            {/*<HorizontalPicker.Item key={item} label={`${item}`} value={item}/>*/}
                        {/*)}*/}
                    {/*</HorizontalPicker>*/}
                {/*</View>*/}
                {/*this.state.letterSelect
                    ? this.showNoSelectLetter()
                    :*/}
                {!this.state.onSearch?this.showNoSearchMsg():this.renderProducerList()}
                <Toast ref="toast" position='center' positionValue={200} fadeInDuration={750} fadeOutDuration={1000}
                       opacity={0.8}/>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container2: {
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        width:screen.width*0.95,
        alignSelf:'center',
        marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
        borderRadius:3,
    },
    rightContainer: {
        flex: 1,
        backgroundColor:"#9dff4f00",
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
    }
});