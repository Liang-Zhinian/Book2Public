/*
附近-->搜索anything输入框 进入的页面
    显示内容:
        输入框输入内容后显示搜索历史
        键盘隐藏后回调
 */

import React, {PureComponent} from 'react'
import {
    BVLinearGradient,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    AsyncStorage, TextInput, Platform
} from 'react-native'
import SearchBox from '../Events/SearchBox'
import DeviceStorage from '../../common/DeviceStorage'
import LinearGradient from 'react-native-linear-gradient';
import {SpacingView} from '../../widget/index'
import {groupPurchaseDetailWithLOLA} from '../../api'
import {screen} from "../../common/index";
import {commonStyle} from "../../widget/commonStyle";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Mater from "react-native-vector-icons/MaterialIcons";
import HorizontalPicker from "../Mine/hpicker";


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
export default class SearchAnythingInfoScene extends PureComponent<Props, State> {
    static navigationOptions = ({navigation}: any) => ({
        header:null,
    })

    onChangeSearchBoxText = (text) => {
        this.setState({defaultValue: text,
            picker2Value:text.substring(0,1).toUpperCase(),
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
            // searchKey:null,
            SearchLogs:null,
            letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            letter:'A',
            letterSelect:true,
            picker2Value: 'A',
            defaultValue:null,
            onScrollChange:false
        }
    }

    // _keyboardDidHide () {//键盘输入完毕后传值回去上一个页面
    //     // this.saveAndGoBack(this.state.searchKey)
    // }
    //判断输入字符串是否为空或者全部都是空格
    isNull( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    saveAndGoBack(v){
        if (v===null||this.isNull(v)===true){
            this.props.navigation.state.params.callback(v);
            this.props.navigation.goBack();
        }else {
            this.props.navigation.state.params.callback(v);
            SearchTemp.push(v);
            AsyncStorage.setItem('searchLogs',JSON.stringify(SearchTemp));
            this.props.navigation.goBack();
        }
    }

     componentDidMount() {
        this.setState({isLoading: true})
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

         try {
             AsyncStorage.getItem(
                 'searchLogs',
                 (error,result)=>{
                     if (error){
                         // alert('取值失败:'+error);
                     }else{
                         SearchTemp=JSON.parse(result);
                         this.setState({SearchLogs: this.unique(JSON.parse(result).reverse()), isLoading: false});
                         // alert('取值成功:'+JSON.parse(result));
                     }
                 }
             )
         }catch(error){
             console.warn('获取历史数据失败'+error);
         }

        // debugger;
        //     t.then((v) => {
        //     console.log(v);
        //     // this.setState({SearchLogs: v, isLoading: false});
        //     })
            //.catch(error=>console.log('error=>>', error))
    }
    componentWillUnmount () {
        // this.keyboardDidHideListener.remove();
    }

    //利用防抖方式防止数据过大造成卡顿现象
    timeA(text) {
        if (this.time) {
            clearTimeout(this.time)
        }
        this.time = setTimeout(() => {
            if (text === '') {
                this.setState({
                    SearchLogs: SearchTemp,
                });
                return;
            } else {
                for (var i = 0; i < SearchTemp.length; i++) {
                    if (SearchTemp[i] === text) {
                        this.setState({
                            SearchLogs: [SearchTemp[i]],
                        });
                        return;
                    } else {
                        this.setState({
                            SearchLogs: [],
                        });
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
    //列表的每一行
    renderItemView({item,index}){
        return(
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf:'center',
                alignItems:'center',
                width:screen.width*0.95,
                backgroundColor:'#fff2',
                paddingLeft:5,
                paddingRight:5,
            }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flex: 1,
                        paddingTop: 10,
                        paddingBottom: 10
                    }}
                    onPress={() => {
                        this.logsClicked(item)
                    }}
                    key={index}
                >
                    <View style={{}}>
                        <Text style={{color: '#ffffff'}}>{item}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        AsyncStorage.setItem('searchLogs', JSON.stringify([])).then(() => {
                            this.setState({SearchLogs: []})
                        });
                    }}
                >
                    <Mater name={'close'} size={20} color={'#fff'}/>
                </TouchableOpacity>
            </View>
        );
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
    renderLogList(data){
        return(
            <View style={{flex: 1,}}>
                {/*<View style={{alignItems:'flex-start',backgroundColor:'#d5ff7e00',paddingLeft:screen.width*0.025}}>*/}
                {/*<Text style={{color: '#fff8', fontSize: 13, fontFamily: 'arial'}}>*/}
                {/*RECENT*/}
                {/*</Text>*/}
                {/*</View>*/}
                <View style={{alignSelf: 'flex-start', paddingTop: 5,paddingLeft:screen.width*0.025}}>
                    <Text style={{color: '#fff', fontSize: 15, fontFamily: 'arial',}}>
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
    render() {

        if (this.state.isLoading)
        {
            // loading ...
        }

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
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <TouchableOpacity
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingRight:30
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

                    <View>
                        <TouchableOpacity
                            style={{}}
                            onPress={() => {
                                this.saveAndGoBack(this.state.defaultValue);
                            }}
                        >
                            <Text style={{color: '#ff9a07', fontSize: 15, fontFamily: 'arial',}}>
                                Search
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SearchBox
                    img={'search'}
                    backgroundColor={this.state.SearchBoxBGC}
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
                            SearchBoxBGC:'#ffffff20'
                        })
                    }}
                />

                {/*<View style={{alignItems:'flex-start',backgroundColor:'#d5ff7e00',paddingTop:10,paddingLeft:screen.width*0.025}}>*/}
                    {/*<Text style={{color: '#fff8', fontSize: 13, fontFamily: 'arial'}}>*/}
                        {/*Please scroll to left to select a letter to search...*/}
                    {/*</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.pickerContainer}>*/}
                    {/*<HorizontalPicker*/}
                        {/*ref={'HorizontalPicker'}*/}
                        {/*style={styles.picker}*/}
                        {/*itemWidth={40}*/}
                        {/*selectedValue={this.state.picker2Value}*/}
                        {/*foregroundWeight={'bold'}*/}
                        {/*onChange={i => {*/}
                            {/*this.setState({*/}
                                {/*picker2Value: i,*/}
                                {/*// defaultValue:i,*/}
                            {/*});*/}
                        {/*}}*/}
                        {/*onSelectLetter={()=>{*/}
                            {/*this.saveAndGoBack(this.state.picker2Value);*/}
                        {/*}}*/}
                        {/*// onScrollChange={i => {*/}
                        {/*//     this.setState({*/}
                        {/*//         picker2Value: i,*/}
                        {/*//         defaultValue:i,*/}
                        {/*//     });*/}
                        {/*// }}*/}

                    {/*>*/}
                        {/*{this.state.letters.map(item =>*/}
                            {/*<HorizontalPicker.Item key={item} label={`${item}`} value={item}/>*/}
                        {/*)}*/}
                    {/*</HorizontalPicker>*/}
                {/*</View>*/}


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

                {this.renderLogList(this.state.SearchLogs)}
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