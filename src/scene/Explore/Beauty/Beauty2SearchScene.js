/*
附近-->搜索anything输入框 进入的页面
    显示内容:
        输入框输入内容后显示搜索历史
        键盘隐藏后回调
 */

import React, {Component} from 'react'
import {AsyncStorage, BVLinearGradient, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import SearchBox from '../../Events/SearchBox'
import LinearGradient from 'react-native-linear-gradient';
import {screen} from "../../../common/index";
import {commonStyle} from "../../../widget/commonStyle";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Mater from "react-native-vector-icons/MaterialIcons";
import HorizontalPicker from "../../Mine/hpicker";
import Slider from "../../Common/Slider2";
import SliderV from 'react-native-slider'
import {getPosition} from "../ExploreRangeScene";
import {CoordinateConverter} from "../../../api";
import LocalImage from "../../../widget/LocalImage";

var Geolocation = require('Geolocation');


type Props = {
    navigation: any,
}
type State = {
    discounts: Array<Object>,
    dataList: Array<Object>,
    refreshing: boolean,
}

var colorTemp = screen.colorTemp;

var SearchTemp =[];
var SearchLocationTemp =[];

export default class Beauty2SearchScene extends Component<Props, State> {
    static navigationOptions = ({navigation}: any) => ({
        header:null,
    });

    onChangeSearchBoxText = (text) => {
        this.setState({defaultValue: text,
            picker2Value:text.substring(0,1).toUpperCase(),
        });
        this.timeA(text);
    };
    onChangeSearchLocationBoxText = (text) => {
        this.setState({defaultLocationValue: text,
            // picker2Value:text.substring(0,1).toUpperCase(),
        });
        this.timeA(text);
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
            sliderValue:0,
            defaultSliderValue:0,
            SearchLogs:[],
            SearchLocationLogs:[],
            letter:'A',
            picker2Value: 'A',
            defaultValue:null,
            defaultLocationValue:null,
            placeholderLocationValue:'My Location - 0.25km',
            onScrollChange:false,
            showLetter:true,
            showLocation:false,
            LatLng:null,
            SearchBoxKeyValueBGC:'#ffffff50',
            SearchBoxLocationBGC:'#ffffff20',
            zoom:12.5,
        }
    }

    //判断输入字符串是否为空或者全部都是空格
    isNull( str ){
        if ( str === "" ) return true;
        let regu = "^[ ]+$";
        let re = new RegExp(regu);
        return re.test(str);
    }
    saveAndGoBack(){
        let {defaultValue, sliderValue, LatLng, defaultLocationValue,zoom} = this.state;
        AsyncStorage.setItem('defaultSliderValue', (this.state.sliderValue / 5).toString());
        AsyncStorage.setItem('LocationSearchKey', defaultLocationValue);
        if (LatLng===null){
            LatLng = {
                longitude: 116.404,
                latitude: 39.915
            }
        }else{
            AsyncStorage.setItem('LatLngLog',JSON.stringify([ LatLng.latitude,LatLng.longitude,(this.state.sliderValue / 5).toString(),zoom.toString()]));
        }
       //keyWork  radius LatLng
        this.props.navigation.state.params.callback(defaultValue, sliderValue, LatLng);
        SearchTemp.push(defaultValue);
        AsyncStorage.setItem('searchLogs', JSON.stringify(SearchTemp));
        SearchLocationTemp.push(defaultLocationValue);
        AsyncStorage.setItem('searchLocationLogs', JSON.stringify(SearchLocationTemp));
        // }
        this.props.navigation.goBack();

    }
    // saveAndGoBackB(){
    //     let {defaultLocationValue} = this.state;
    //     AsyncStorage.setItem('defaultSliderValue',(this.state.sliderValue / 5).toString());
    //     if (defaultLocationValue===null||this.isNull(defaultLocationValue)===true){
    //         this.props.navigation.state.params.callback(null);
    //     }else {
    //         this.props.navigation.state.params.callback(defaultLocationValue);
    //         SearchLocationTemp.push(defaultLocationValue);
    //         AsyncStorage.setItem('searchLocationLogs', JSON.stringify(SearchLocationTemp));
    //     }
    //     this.props.navigation.goBack();
    // }

    getSearchLogs(){
        try {
            AsyncStorage.getItem(
                'searchLogs',
                (error,result)=>{
                    if (error){
                    }else{
                        SearchTemp=JSON.parse(result);
                        this.setState({SearchLogs: this.unique(SearchTemp), isLoading: false});
                    }
                }
            )
        }catch(error){
            console.warn('获取历史数据失败'+error);
        }
    }
    // getDefaultSliderValue(){
    //     try {
    //         AsyncStorage.getItem(
    //             'defaultSliderValue',
    //             (error,result)=>{
    //                 if (error){
    //                     // alert('取值失败:'+error);
    //                     // console.log(error);
    //                 }else{
    //                     if (result === null) {
    //                         result = 0;
    //                         AsyncStorage.setItem('defaultSliderValue', result.toString());
    //                     }
    //                     let temp = parseFloat(result)===0?0.25:parseFloat(result);
    //                     this.setState({
    //                         defaultSliderValue: temp,
    //                         sliderValue:temp*5,
    //                         placeholderLocationValue:'My Location - '+temp*5+'km',
    //                     });
    //
    //                 }
    //             }
    //         )
    //     }catch(error){
    //         console.warn('获取历史数据失败'+error);
    //     }
    // }
    getSearchLocationLogs(){
        try {
            AsyncStorage.getItem(
                'searchLocationLogs',
                (error,result)=>{
                    if (error){
                    }else{
                        SearchLocationTemp=JSON.parse(result);
                        this.setState({SearchLocationLogs: this.unique(SearchLocationTemp), isLoading: false});
                    }
                }
            )
        }catch(error){
            console.warn('获取历史数据失败'+error);
        }
    }
    getLatLngLog(){
        try {
            AsyncStorage.getItem(
                'LocationSearchKey',
                (error,result)=>{
                    if (error){
                        // alert('取值失败:'+error);
                    }else{
                        address = result;
                        this.setState({defaultLocationValue: result});
                    }
                }
            );
            AsyncStorage.getItem(
                'LatLngLog',
                (error,result)=>{
                    if (error||result==null){
                        this.getPosition();
                    }else{
                        let LatLngLog=JSON.parse(result);
                        let temp = parseFloat(LatLngLog[2])===0?0.25:parseFloat(LatLngLog[2]);
                        this.setState({
                            LatLng: {
                                latitude:LatLngLog[0],
                                longitude:LatLngLog[1]
                            },
                            defaultSliderValue: temp,
                            sliderValue:temp*5,
                            placeholderLocationValue:'My Location - '+temp*5+'km',
                            zoom:parseFloat(LatLngLog[3])
                        });
                    }
                }
            );
        }catch(error){
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度'+error);
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
    }
    componentWillMount() {
        this.getSearchLogs();
        this.getSearchLocationLogs();
        // this.getDefaultSliderValue();
        this.getLatLngLog();
    }
    /** 获取地理位置（经纬度） */
    getPosition = (): void => {
        Geolocation.getCurrentPosition(location => {
            fetch(CoordinateConverter(location.coords.longitude, location.coords.latitude))
                .then((response) => response.json())
                .then((responseJson) => {
                    let longitude = Number(responseJson.locations.split(',')[0]);
                    let latitude = Number(responseJson.locations.split(',')[1]);
                    this.regeocodeLocation(longitude,latitude);
                    this.setState({
                        LatLng: {
                            latitude: latitude+Math.random()/10000,
                            longitude: longitude
                        }
                    });
                    let { zoom,sliderValue} = this.state;
                    AsyncStorage.setItem('LatLngLog',JSON.stringify([ latitude,longitude,(sliderValue / 5).toString(),zoom.toString()]));
                })
                .catch((error) => {
                });
        }, error => {
            this.interval = setInterval(() => {
                    this.getPosition();
                },1000);
            setTimeout(()=>{
                this.setState({
                    LatLng: {
                        longitude: 116.404,
                        latitude: 39.915
                    }
                })
            },2000);
        });
        clearInterval(this.interval);
    };

    componentWillUnmount () {
        // this.keyboardDidHideListener.remove();
    }

    //利用防抖方式防止数据过大造成卡顿现象
    timeA(text) {
        let {showLetter} = this.state;
        if (this.time) {
            clearTimeout(this.time)
        }
        this.time = setTimeout(() => {
            if (text === '') {
                if (showLetter) {
                    this.setState({
                        SearchLogs: SearchTemp,
                    });
                }else {
                    this.setState({
                        SearchLocationLogs: SearchLocationTemp,
                    });
                }

                return;
            } else {
                for (var i = 0; i < SearchTemp.length; i++) {
                    if (SearchTemp[i] === text) {
                        if (showLetter) {
                            this.setState({
                                SearchLogs: [SearchTemp[i]],
                            });
                        }else {
                            this.setState({
                                SearchLocationLogs: [SearchLocationTemp[i]],
                            });
                        }
                        return;
                    } else {
                        if (showLetter) {
                            this.setState({
                                SearchLogs: [],
                            });
                        }else {
                            this.setState({
                                SearchLocationLogs: [],
                            });
                        }
                    }
                }
            }
        }, 500);

    }

    //数组去重
    unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }


    //点击搜索历史cell
    logsClicked(item){
        this.setState({
            // picker2Value:item.substring(0,1).toUpperCase(),
            defaultValue:item,
        });
        // this.refs['HorizontalPicker']._onScrollChange(item.substring(0,1).toUpperCase())
    }
    logsLocationClicked(){
        this.setState({
            placeholderLocationValue:this.state.placeholderLocationValue,
        });
    }
    //列表的每一行
    renderItemView({item,index}){
        // let height = item==='ppap'?0:null;
        return(
            <View
                style={{
                    // height: height,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    alignItems: 'center',
                    width: screen.width * 0.95,
                    backgroundColor: '#fff2',
                    paddingLeft: 5,
                    paddingRight: 5,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flex: 1,
                        paddingTop: 10,
                        paddingBottom: 10,
                        backgroundColor: 'transparent'
                    }}
                    onPress={() => {
                        if (this.state.showLetter){

                            this.logsClicked(item)
                        } else {
                            this.logsLocationClicked(item)
                        }

                    }}
                    key={index}
                >
                    <View style={{}}>
                        <Text style={{color: '#ffffff',fontSize:14,fontFamily:'arial'}}>{item}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        this.delSearchLogs(item);
                    }}
                >
                    <Mater name={'close'} size={20} color={'#fff'}/>
                </TouchableOpacity>
            </View>
        );
    }
    delSearchLogs(item){
        let {showLetter,showLocation,SearchLocationLogs,SearchLogs} =this.state;
        if (showLetter) {
            let arr = SearchLogs;
            let index = arr.indexOf(item);
            if (index > -1) {
                arr.splice(index, 1);
            }
            AsyncStorage.setItem('searchLogs', JSON.stringify(arr)).then(() => {
                this.setState({SearchLogs: arr});
            });
        }else if (showLocation){
            let arr = SearchLocationLogs;
            let index = arr.indexOf(item);
            if (index > -1) {
                arr.splice(index, 1);
            }
            AsyncStorage.setItem('searchLocationLogs', JSON.stringify(arr)).then(() => {
                this.setState({SearchLocationLogs: arr});
            });
        }

    }
    //去除警告
    extraUniqueKey(item,index){
        return index+item;
    }
    //下划线
    _separator = () => {
        return <View style={{height:screen.onePixel,backgroundColor:'#fff0',}}/>;
    };
    // _header = () => {
    //     return <Text style={[styles.txt,{backgroundColor:'#fff'}]}>这是头部</Text>;
    // }
    // _onRefresh=()=>{
    //     return '';
    // }

    shouldComponentUpdate(  nextProps,  nextState){return true;}

    renderLogList(data){
        return(
            <View style={{flex: 1,}}>
                {/*<View style={{alignItems:'flex-start',backgroundColor:'#d5ff7e00',paddingLeft:screen.width*0.025}}>*/}
                {/*<Text style={{color: '#fff8', fontSize: 13, fontFamily: 'arial'}}>*/}
                {/*RECENT*/}
                {/*</Text>*/}
                {/*</View>*/}
                <View style={{
                                backgroundColor: 'transparent', alignSelf: 'flex-start', paddingTop: 5,paddingLeft:screen.width*0.025}}>
                    <Text style={{color: '#fff', fontSize: 14, fontFamily: 'arial',}}>
                        RECENT
                    </Text>
                </View>
                <FlatList style={{
                    flex: 1,
                    marginTop: 5,
                    width: screen.width
                }}
                          data={data}
                          renderItem={this.renderItemView.bind(this)}
                          keyExtractor={this.extraUniqueKey}//去除警告
                          ItemSeparatorComponent={this._separator}
                >
                </FlatList>
            </View>
        )
    }

    showSlider2(){
        return (
            <SliderV
                style={customStyles8.container}
                trackStyle={customStyles8.track}
                thumbStyle={customStyles8.thumb}
                minimumTrackTintColor='#31a4db'
                thumbTouchSize={{width: 50, height: 40}}
            />
        )
    }

    showSlider() {
        return (
            <View style={{width:screen.width*0.95,
                // alignItems:'center',
                justifyContent:'center',
                alignSelf:'center'
            }}>
                <View style={{
                    // paddingLeft:screen.width*0.025,
                    paddingTop:10,
                    paddingBottom:5,
                    justifyContent:'space-between',
                    flexDirection:'row'
                }}>
                    <View style={{alignSelf: 'flex-end', backgroundColor:'transparent'}}>
                        <Text style={{color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: 'arial',}}>
                            DISTANCE
                        </Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{alignSelf: 'flex-end'}}>
                            <Text style={{color: '#ffcc0a', fontSize: 15, fontWeight: 'bold', fontFamily: 'arial',}}>
                                {this.state.sliderValue===0?0.25:this.state.sliderValue + ' '}
                            </Text>
                        </View>
                        <View style={{alignSelf:'flex-end', backgroundColor:'transparent'}}>
                            <Text style={{color: '#fff', fontSize: 12,fontWeight:'bold', fontFamily: 'arial',}}>
                                km
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{height:40,width:screen.width*0.95,}}
                >
                    <Slider
                        backgroundColor={'#fff0'}
                        initialValue={this.state.defaultSliderValue}
                        onSelect={(e) => {
                          e = e === 0 ?  0.25 : e*5;
                            this.setState({
                                sliderValue:e,
                                placeholderLocationValue:'My Location - '+e+'km',
                                defaultSliderValue:e/5
                            });
                            // AsyncStorage.setItem('defaultSliderValue',(this.state.sliderValue / 5).toString());
                            // li.map((info,i)=>{
                            //
                            //     if ((e!==0.25?e*5:0.25)===info) this.setState({zoom:u[i]})
                            // })
                        }}
                        onPress={(v) => {
                            // let li=[50,45,40,35,30,25,20,15,10,5,0.25];
                            // let u=[8.5,9.2,9.3,9.5,10,10,10,11,11.5,12.5,17];
                            // if (li.indexOf(this.state.radius) < 0) {
                            //     liTemp.push(this.state.radius);
                            //     this.sortarr(liTemp);//排序
                            //     let radius = liTemp.indexOf(this.state.radius);//取到新半径的位置
                            //     let lastDiffer = Math.abs(liTemp[radius - 1] - liTemp[radius]);//前一个相差值
                            //     let nextDiffer = Math.abs(liTemp[radius + 1] - liTemp[radius]);//后一个相差值
                            //     if (lastDiffer === nextDiffer) {
                            //         return;
                            //     } else if (lastDiffer > nextDiffer) {//取后一个值
                            //         this.setState({
                            //             zoom: u[li.indexOf(liTemp[radius + 1])]
                            //         })
                            //     } else if (lastDiffer < nextDiffer) {
                            //         this.setState({
                            //             zoom: u[li.indexOf(liTemp[radius - 1])]
                            //         })
                            //     }
                            // }
                        }}
                    />
                    {/*<SliderV*/}
                    {/*style={customStyles8.container}*/}
                    {/*minimumValue={0}*/}
                    {/*maximumValue={10}*/}
                    {/*value={this.state.sliderValue/5}*/}
                    {/*trackStyle={customStyles8.track}*/}
                    {/*thumbStyle={customStyles8.thumb}*/}
                    {/*minimumTrackTintColor='#31a4db'*/}
                    {/*thumbTouchSize={{width: 50, height: 40}}*/}
                    {/*onValueChange={(e) => {*/}
                    {/*console.log(e);*/}
                    {/*let ev = Math.round(e);*/}
                    {/*ev === 0 ? ev = 0.25 : ev;*/}
                    {/*this.setState({sliderValue:ev!==0.25?ev*5:0.25,});*/}
                    {/*}}*/}
                    {/*/>*/}
                </View>
            </View>
        )
    }
    showLocationList(){
        return(
            <View style={{ width: screen.width * 0.95,
                alignSelf: 'center',
                alignItems: 'center',}}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor:'#fff2',
                        paddingLeft: 5,
                        paddingRight: 5,
                        // borderColor: '#fff8',
                        // borderBottomWidth: screen.onePixel,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flex: 1,
                            paddingTop: 10,
                            paddingBottom: 10,
                            flexDirection:'row',
                            // alignSelf:'center',
                            // justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            this.logsLocationClicked();
                            this.getPosition();
                        }}
                        key={'My-Location'}
                    >
                        <View style={{paddingRight:5}}>
                            <Image source={LocalImage.locationIcon}
                                   style={[commonStyle.searchIcon, {}]}/>
                        </View>
                        <View style={{}}>
                            <Text style={{color: '#fff', fontSize: 14, fontFamily: 'arial',}}>My Location</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/*<View style={{alignSelf:'flex-start',paddingTop:5}}>*/}
                {/*<Text style={{color: '#fff', fontSize: 15, fontFamily: 'arial',}}>*/}
                {/*RECENT*/}
                {/*</Text>*/}
                {/*</View>*/}

            </View>
        )
    }

    render() {
        let {showLetter} = this.state;
        // if (this.state.data.length > 0) {
        //     if (this.state.seachList != null) {
        //         return <SectionList
        //             ref='list'
        //             enableEmptySections
        //             renderItem={this._renderItem}
        //             sections={this.state.seachList}
        //         />
        //     }

        return (
            <LinearGradient colors={colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient,{}]}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    width: screen.width * 0.95,
                    alignItems: 'center'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',marginTop:5}}>
                        <TouchableOpacity
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingRight:50,
                                backgroundColor: 'transparent'
                            }}
                            activeOpacity={0.9}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        >
                            <Icon name={'arrow-left'} size={15} color={'#fff'}
                                  style={[commonStyle.searchIcon, {paddingRight: 5}]}/>
                        </TouchableOpacity>

                        {/*<TouchableOpacity*/}
                        {/*activeOpacity={0.9}*/}
                        {/*style={{alignItems: 'center', paddingLeft: 5}}*/}
                        {/*onPress={() => {*/}
                        {/*this.props.navigation.goBack();*/}
                        {/*}}*/}
                        {/*>*/}
                        {/*<Text style={{*/}
                        {/*color: '#ffffff',*/}
                        {/*fontSize: 16,*/}
                        {/*fontFamily: 'arial',*/}
                        {/*alignSelf: 'flex-start',*/}
                        {/*}}>What to search?</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>

                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'transparent'}}
                            onPress={() => {
                                this.saveAndGoBack();
                                // if (showLetter){
                                //     this.saveAndGoBack();
                                // } else {
                                //     this.saveAndGoBackB()
                                // }
                            }}
                        >
                            <Text style={{color: '#ffcc0a', fontSize: 14, fontFamily: 'arial',}}>
                                SEARCH
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SearchBox
                    img={'search'}
                    backgroundColor={this.state.SearchBoxKeyValueBGC}
                    defaultValue={this.state.defaultValue}
                    autoFocus={true}
                    placeholder={'What to search?'}
                    onChangeText={(text) => {
                        this.onChangeSearchBoxText(text)
                    }}
                    onFocus={()=>{//当文本框获得焦点的时候调用此回调函数
                        this.setState({
                            showLetter: true,
                            showLocation: false,
                            SearchBoxKeyValueBGC:'#ffffff50',
                            SearchBoxLocationBGC:'#ffffff20',
                            // defaultLocationValue:null,
                        })
                    }}
                    clearValue={()=>{
                        this.setState({defaultValue:null})
                    }}
                />
                <View style={{backgroundColor:'#ffffff00',padding:2,width:screen.width}}/>
                <SearchBox
                    img={'location'}
                    backgroundColor={this.state.SearchBoxLocationBGC}
                    defaultValue={this.state.defaultLocationValue}
                    placeholder={this.state.placeholderLocationValue}
                    onChangeText={(text) => {
                        this.onChangeSearchLocationBoxText(text)
                    }}
                    onFocus={() => {
                        this.setState({
                            showLetter: false,
                            showLocation: true,
                            // defaultValue:null,
                            SearchBoxLocationBGC:'#ffffff50',
                            SearchBoxKeyValueBGC:'#ffffff20'
                        })
                    }}
                    clearValue={()=>{
                        this.setState({defaultLocationValue:null})
                    }}
                />
                {/*{this.state.showLetter&&this.showLetter()}*/}

                {this.state.showLocation&&this.showSlider()}
                {this.state.showLocation&&this.showLocationList()}

                {(this.state.SearchLogs.length > 0&&this.state.showLetter)&&this.renderLogList(this.state.SearchLogs)}
                {(this.state.SearchLocationLogs.length > 0&&this.state.showLocation)&&this.renderLogList(this.state.SearchLocationLogs)}

                {/*<View style={commonStyle.searchBox}>*/}
                {/*<TextInput*/}
                {/*underlineColorAndroid='transparent'*/}
                {/*placeholder={'What to search?'}*/}
                {/*placeholderTextColor={'#d8d8d8'}*/}
                {/*style={{*/}
                {/*height: Platform.OS === 'ios' ? 30 : 40,*/}
                {/*fontSize: 18,*/}
                {/*lineHeight: 20,*/}
                {/*color: '#fff',*/}
                {/*width: screen.width * 0.95,*/}
                {/*backgroundColor: '#fff0',*/}
                {/*borderColor: '#fff8',*/}
                {/*borderBottomWidth: screen.onePixel*/}
                {/*}}>*/}
                {/*</TextInput>*/}
                {/*</View>*/}


            </LinearGradient>
        )
    }

}

const styles = StyleSheet.create({

    pickerContainer: {
        flexDirection:'row',
        paddingTop:0,
        paddingBottom:0,
        width:screen.width
    },
    picker: {
        flex: 1,
        // width:screen.width*0.9
    }
    , callbackIcon: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 10,
        marginRight: 5,
        tintColor:'#f4cad8'
    },
});
var customStyles8 = StyleSheet.create({
    container: {
        height: 40,
        width:screen.width*0.95
    },
    track: {
        height: 2,
        backgroundColor: '#303030',
    },
    thumb: {
        width: 10,
        height: 10,
        backgroundColor: '#31a4db',
        borderRadius: 10 / 2,
        shadowColor: '#31a4db',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
    }
});
