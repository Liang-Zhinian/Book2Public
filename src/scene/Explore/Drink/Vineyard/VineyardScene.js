import React, {Component} from 'react';
import {
    ActivityIndicator,
    BVLinearGradient,
    Image,
    InteractionManager,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {screen} from '../../../../common'
import {commonStyle} from "../../../../widget/commonStyle";
import CountryListScene from "../Vineyard/CountryListScene";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import {getVineyardByGPS, getVineyardByName, getVineyardBySubAreaId} from "../../../../api";
import Drink2SearchScene from "../Drink2SearchScene";
import VineyardCell from "../Vineyard/VineyardCell";
// import EZSideMenu from "../../../Common/EZSideMenu";
import SideMenu from "react-native-side-menu";

var colorTemp = screen.colorTemp;
//葡萄园列表
export default class VineyardScene extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    _selectionMode = true;
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            searchKey: null,
            LocationSearchKey: null,
            title: '',
            NoData:false,
            showSliderBar:false,
            isOpen: false,
            selectedItem: 'About',
            isLoading:false,
            VineyardList:[],
            subareaId:null,
            openMenuOffset:screen.width*(2/3),
            onSearch:false,
        };
        this.toggle = this._toggle.bind(this)
    }



    componentWillUnmount() {
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
    showNoSearchMsg() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial',paddingTop:5}}>
                    Please enter keywords to search.
                </Text>
            </View>
        )
    }

    requestData = async () => {
        this.page=1;
        this.setState({
            refreshState: RefreshState.HeaderRefreshing
        });
        let {searchKey,LocationSearchKey,center,radius} = this.state;
        // BeautyList:[],
        //                                             LocationSearchKey: address,
        //                                             center:{
        //                                                 latitude:latitude,
        //                                                 longitude:longitude
        //                                             },
        //                                             radius:radius

        console.log(searchKey);
        if (searchKey !== null) {
            this.setState({VineyardList: []});
            this._getVineyardByName(searchKey);
        } else if (LocationSearchKey!==null){
            this.setState({VineyardList: []});
            this._getVineyardByGPS(center.latitude,center.longitude,radius);
        }
        else {
            this.props.setShowSliderBar && this.props.setShowSliderBar(true);
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
        InteractionManager.runAfterInteractions(() => {
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
        this.setState({
            onSearch:true,
            isLoading:true});
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
    _getVineyardByGPS = async (latitude,longitude,radius) => {
        this.setState({
            onSearch:true,
            isLoading:true});
        await  getVineyardByGPS(latitude,longitude,radius)
            .then((msg) => {
                // console.log('GetVineyardLocationsWithinRadius',responseJson);
                // const dataList = responseJson.map((info) => {
                //     return {
                //         key: info.Vineyard_Id,
                //         id: info.Vineyard_Id,
                //         imageUrl: null,
                //         title: info.Vineyard,
                //         subtitle: null,
                //         phone: null,
                //         Latitude: info.Latitude,
                //         Longitude: info.Longitude,
                //         AdditionalLocationImages: null,
                //         SiteId: info.Vineyard_Id,
                //     }
                // });
                // let dataListTemp = [];
                // if (dataList.length>=20){
                //     for (let i = 0;i<20;i++){
                //         dataListTemp.push(dataList[i]);
                //     }
                // }else{
                //     dataListTemp=dataList
                // }
                //
                //
                // console.log(dataListTemp);
                // this.setState({data: dataListTemp});
                // this.props.loadMarker(dataListTemp)
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
            .catch((error) => {

            })
    };

    componentWillMount() {
        let {category} = this.props.navigation.state.params;
        this.setState({title: category});
    }



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
                    marginTop:5,
                    backgroundColor: '#ffffff00'
                }}
                initialListSize={2}
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

        )
    }

    setShowSliderBar(flag){
        this.setState({showSliderBar:flag})
    }


    updateMenuState(isOpen) {
        this.setState({isOpen});
        if (!isOpen) {
        }
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
            subareaId: item.id,
            isLoading:true,
            searchKey: null,
            onSearch:true
        });
        this._clearData();
        this._resetPage();
        InteractionManager.runAfterInteractions(() => {
            this._getVineyardBySubAreaId(this.state.subareaId);
        });

    };
    _onMove(){}

    _toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
        if (this.refs.menu) {
            this.state.isOpen ? this.refs.menu.close() : this.refs.menu.open()
        }
    }
    render() {
        let {searchKey,openMenuOffset,LocationSearchKey,isOpen} =  this.state;
        const menu =
            <CountryListScene
                _toggle={this._toggle.bind(this)}
                getSubarea={this._getSubareaId}
            />;
        return (
            <SideMenu
                // style={{opacity:isOpen?1:1}}
                menu={menu}
                openMenuOffset={screen.width}
                isOpen={isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}
                menuPosition={'right'}
            >
                {/*<ContentView/>*/}
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
                                }}>Vineyard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 50,
                                    paddingRight: screen.width * 0.025,
                                }}
                                onPress={this.toggle}
                            >
                                <Image source={require('../../../../img/nearby/country.png')}

                                       style={{
                                           tintColor:'#fff',
                                           // backgroundColor: '#ffaaaa',
                                           width: 25,
                                           height: 25,
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
                        <TouchableOpacity style={commonStyle.searchBar} underlineColorAndroid='white' onPress={() => {
                            this.props.navigation.navigate('ExploreRangeScene'
                                , {
                                    callbackLocation: (address,latitude,longitude,name,radius) => {
                                        this.setState({
                                            BeautyList:[],
                                            LocationSearchKey: address,
                                            searchKey:null,
                                            center:{
                                                latitude:latitude,
                                                longitude:longitude
                                            },
                                            radius:radius
                                        },()=>{
                                            this.requestData()
                                        });

                                    },
                                    category:'Vineyard',
                                    siteId: this.props.navigation.state.params.siteId,
                                });
                        }}>
                            <Image source={require('../../../../img/nearby/locationB.png')} style={commonStyle.searchIcon}/>
                            <Text style={{
                                paddingLeft: 10,
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                color: '#e5e5e5'
                            }}>{LocationSearchKey === null ? 'Select the' : LocationSearchKey} </Text>
                            {LocationSearchKey === null &&
                            <Text style={{
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color: '#ffffff'
                            }}>area</Text>}
                        </TouchableOpacity>
                    </View>
                    {!this.state.onSearch?this.showNoSearchMsg():this.renderVineyardList()}
                </LinearGradient>
            </SideMenu>
        );
    }
}

