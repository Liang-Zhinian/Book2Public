import React, {Component} from 'react';
import {ActivityIndicator, BVLinearGradient, Image, Text, TouchableOpacity, View,BackHandler} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RefreshState} from 'react-native-refresh-list-view'
import {screen} from '../../../common'
import {commonStyle} from "../../../widget/commonStyle";
import CountryListScene from "./Vineyard/CountryListScene";
import SubregionListScene from "./Vineyard/SubregionListScene";
import AreaListScene from "./Vineyard/AreaListScene";
import {StackNavigator} from "react-navigation";
import RegionListScene from "./Vineyard/RegionListScene";
import SubareaListScene from "./Vineyard/SubareaListScene";
import DrinkDetailDataUtils from "./DrinkDetailDataUtils";
import {getVineyardBySubAreaId, getVineyardByName} from "../../../api";
import Drink2SearchScene from "./Drink2SearchScene";

import SideMenu from 'react-native-side-menu';
import RefreshListView from "react-native-refresh-list-view";
import VineyardCell from "./Vineyard/VineyardCell";

var colorTemp = screen.colorTemp;
export default class DrinkDetail extends Component {

    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            searchKey: null,
            LocationSearchKey: 'Select the',
            title: '',
            NoData:false,
            showSliderBar:false,
            // triangleType:'',
            isOpen: false,
            selectedItem: 'About',
            isLoading:false,
            VineyardList:[],
            subareaId:null,
            openMenuOffset:screen.width*(2/3)
        };
    }
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    showNoDataMsg() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>
                    No matched search result is returned.
                </Text>
            </View>
        )
    }

    requestData = async () => {
        this.page=1;
        this.setState({
            refreshState: RefreshState.HeaderRefreshing
        });
        let {searchKey} = this.state;
        if (searchKey !== null) {
            this.setState({VineyardList: []});
            this._getVineyardByName(searchKey);
        } else {
            this.props.setShowSliderBar && this.props.setShowSliderBar(true);
            // if (subareaObj.region_id !== undefined) {
            //     this.setState({region_id: subareaObj.region_id});
            //     this._getVineyardById(subareaObj.region_id)
            // } else
            if (searchKey === null) {
                this._getVineyardByName('')
            } else {
                this._getVineyardByName(searchKey);
            }
        }
    };
    nextPage = async () => {
        if (this.state.refreshState === RefreshState.NoMoreData) return;
        ++this.page;
        //叠加翻页数据
        this.setState({refreshState: RefreshState.FooterRefreshing});
        let {searchKey,subareaId} = this.state;
        // this.props.setShowSliderBar && this.props.setShowSliderBar(true);
        if (subareaId!== null) {
            // this._getVineyardBySubAreaId(subareaId);
            this.setState({refreshState: RefreshState.NoMoreData})//暂时没有分页,临时停止翻页刷新
        } else {
            this._getVineyardByName(searchKey)
        }
    };

    _resetPage(){
        if (this.state.refreshState === RefreshState.NoMoreData) {
            this.page = 1;
            this.dataLength = 0;
        }
    }

    componentDidMount() {
        this.requestData();
        BackHandler.addEventListener('hardwareBackPress',  ()=> {
            this.props.navigation.goBack()
            return true;
        });
    }


    _getVineyardBySubAreaId = async (vid) => {
        this.setState({isLoading:true});
        await  getVineyardBySubAreaId(vid,this.page,this.size)
            .then((msg) => {
                this.dataLength = this.state.VineyardList.length;
                let data = DrinkDetailDataUtils.requestData(msg);
                data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                data.pop();
                this.setState({
                    isLoading:false,
                    VineyardList: this.state.VineyardList.concat(data),
                    refreshState: RefreshState.Idle,
                    openMenuOffset:screen.width*(2/3)
                }, () => {
                    if (this.state.VineyardList.length === this.dataLength) {
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
    _clearData(){
        this.setState({
            VineyardList:[]
        })
    }
    page = 1;
    size = 25;
    dataLength = 0;
    _getVineyardByName = async (name) => {
        this.setState({isLoading:true});
        await  getVineyardByName('ByA',name, this.page, this.size)
            .then((msg) => {
                this.dataLength = this.state.VineyardList.length;
                let data = DrinkDetailDataUtils.requestData(msg);
                data.length > 0 ? this.setState({NoData: false}) : this.setState({NoData: true});
                // if (this.page!==1&&data.length>0) data.shift();
                // if(data.length=this.size){data.pop();}
                data.pop();
                this.setState({
                    isLoading:false,
                    VineyardList: this.state.VineyardList.concat(data),
                    refreshState: RefreshState.Idle,
                }, () => {
                    if (this.state.VineyardList.length === this.dataLength) {
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


    componentWillMount() {
        let {category} = this.props.navigation.state.params;
        // if (category === 'Vineyard') {
        //     this.setState({triangleType:'All'})
        // } else  {
        //     this.setState({triangleType:'WINE'})
        // }
        this.setState({title: category});
        // this.requestData();
        // if (category === 'Vineyard'&&subareaObj.region_id!==undefined) {
        //     this._getVineyardById(subareaObj.region_id)
        // }else if(category === 'Producer'){
        //     this._getAllProducer()
        // }else{
        //     this._getAllVineyard();
        // }
    }


    // GetADList() {//广告轮播
    //     return (
    //         <AdSwiper style={{width: screen.width * 0.95}} menuInfos={api.adInfoTemp}
    //                   onMenuSelected={this.onMenuSelected}/>
    //     )
    // }

    renderCell = (rowData: any) => {
        return (
            <View>
                <VineyardCell
                    info={rowData.item}
                    onPress={() => {
                      //跳到商品详情
                        console.log(rowData.item)
                    }}
                />
            </View>
        )
    };
    renderVineyardList() {
        return (
            this.state.VineyardList.length > 0 ?<RefreshListView
                style={{
                    width: screen.width,
                    backgroundColor: '#ffffff00'
                }}
                data={this.state.VineyardList}
                renderItem={this.renderCell}
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
                onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                footerTextStyle={{color: '#ffffff'}}
                footerRefreshingText={'loading...'}
                footerFailureText={'click refresh'}
                footerNoMoreDataText={'no more data'}
                footerEmptyDataText={'empty data'}
           />:(this.state.isLoading?this.showLoading(): (this.state.NoData && this.showNoDataMsg()) )

              //  <DrinkDataItemList
              //      ref={'DrinkDataItemList'}
              //      data={this.state.VineyardList}
              //      searchKey={this.state.searchKey}
              //      category={navigation.state.params.category}
              //      subareaObj={navigation.state.params.subareaObj}
              //      itemOnpress={(info) => {
              //          let scene = this.state.title + 'Scene';
              //          navigation.navigate(scene, {info: info, fromCube: true})//跳到商品详情
              //      }}
              //      replaceSearchKey={(info)=>{
              //          this.setState({
              //              searchKey :info
              //          })
              //      }}
              //      setShowSliderBar={(flag) => {
              //          this.setShowSliderBar(flag)
              //      }}
              //      _requestData={()=>{
              //          this.requestData()
              //      }}
              //      _nextPage={()=>{
              //          this.nextPage()
              //      }}
              //  />
        )
    }

    setShowSliderBar(flag){
        this.setState({showSliderBar:flag})
    }


    updateMenuState(isOpen) {
        this.setState({isOpen});
        if (!isOpen) {
            this._clearData();
            this._resetPage();
            this._getVineyardBySubAreaId(this.state.subareaId);
        }

    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item,
        });

    _getSubareaId=item=>{
        this.setState({
            isOpen: false,
            openMenuOffset:0,
            subareaId: item.id
        });
        // this._clearData();
        // this._resetPage();
        // this._getVineyardBySubAreaId(item.id);

    };
    _onMove(){
    }
    render() {
        let {searchKey,openMenuOffset} =  this.state;
        const menu = <Navigator screenProps = {{rootNavigator: this.props.navigation,getSubarea:this._getSubareaId}} />;
        return (
            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}
                menuPosition={'right'}
                openMenuOffset={openMenuOffset}
                onMove={()=>{
                    this._onMove()
                }}
            >
            <LinearGradient colors={colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[commonStyle.linearGradient, {}]}>
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',}]}>
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
                            <Image source={require('../../../img/mine/icon_homepage_left_arrow.png')}
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
                            }}>{this.state.title}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingBottom: 10,
                                paddingTop: 10,
                                paddingLeft: 50,
                                paddingRight: screen.width * 0.025
                            }}
                            onPress={() => {
                                this.toggle()
                            }}>
                            <Image source={require('../../../img/nearby/country.png')}
                                   style={{
                                       tintColor:'#fff',
                                       backgroundColor: 'transparent',
                                       width: 20,
                                       height: 20,
                                       alignSelf: 'flex-end',
                                   }}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[commonStyle.searchBar,{}]} underlineColorAndroid='white' onPress={() => {
                        this.props.navigation.navigate('Drink2SearchScene'
                            , {
                                callback: (msg) => {
                                    this.setState({
                                            searchKey: msg
                                        },
                                        () => {
                                            this._clearData();
                                            this._resetPage();
                                            this._getVineyardByName(msg);
                                        });
                                },
                                searchKey:searchKey
                            });
                    }}>
                        <Image source={require('../../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                        <Text style={{
                            paddingLeft: 10,
                            fontSize: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            color: '#e5e5e5'
                        }}>{searchKey===null?'What to':searchKey} </Text>
                        {searchKey === null ?
                            <Text style={{
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color: '#ffffff'
                            }}>search?</Text> : <Text/>}
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={commonStyle.searchBar} underlineColorAndroid='white' onPress={() => {*/}
                    {/*this.props.navigation.navigate('ExploreRangeScene'*/}
                    {/*, {*/}
                    {/*callbackLocation: (msg) => {*/}
                    {/*this.setState({LocationSearchKey: msg})*/}
                    {/*},*/}
                    {/*searchKey:this.state.searchKey,*/}
                    {/*category: this.props.navigation.state.params.category,*/}
                    {/*subareaObj:this.props.navigation.state.params.subareaObj*/}
                    {/*});*/}
                    {/*}}>*/}
                    {/*<Image source={require('../../../img/nearby/locationB.png')} style={commonStyle.searchIcon}/>*/}
                    {/*<Text style={{*/}
                    {/*paddingLeft: 10,*/}
                    {/*fontSize: 14,*/}
                    {/*justifyContent: 'center',*/}
                    {/*alignItems: 'center',*/}
                    {/*alignSelf: 'center',*/}
                    {/*color: '#e5e5e5'*/}
                    {/*}}>{this.state.LocationSearchKey} </Text>*/}
                    {/*{this.state.LocationSearchKey === 'Select the' ?*/}
                    {/*<Text style={{*/}
                    {/*fontSize: 14,*/}
                    {/*justifyContent: 'center',*/}
                    {/*alignItems: 'center',*/}
                    {/*alignSelf: 'center',*/}
                    {/*fontWeight: 'bold',*/}
                    {/*color: '#ffffff'*/}
                    {/*}}>area</Text> : <Text/>}*/}
                    {/*</TouchableOpacity>*/}

                </View>

                {/*<View style={{backgroundColor: '#ffffff00', padding: 5, width: screen.width}}/>*/}
                {/*{this.state.showSliderBar&&this.showDrinkAndBeverage()}*/}
                {this.renderVineyardList()}
            </LinearGradient>
            </SideMenu>
        );
    }
}

// const ModalNavigator = StackNavigator(
//     {
//         VineyardScene:{screen:VineyardScene,}
//     },{
//         mode: 'modal',
//         headerMode: 'none',
//     }
// )

const Navigator = StackNavigator(
    {
        CountryListScene:{screen:CountryListScene},
        RegionListScene:{screen:RegionListScene},
        AreaListScene:{screen:AreaListScene},
        SubregionListScene:{screen:SubregionListScene},
        SubareaListScene:{screen:SubareaListScene},
        // DrinkDataItemList:{screen:DrinkDataItemList},
        // VineyardSceneStack:{screen:ModalNavigator,}
    }
)

