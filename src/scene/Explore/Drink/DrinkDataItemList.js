import React, {Component} from 'react';
import {BackHandler, BVLinearGradient, View} from 'react-native';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {screen} from '../../../common'
import VineyardCell from "./Vineyard/VineyardCell";


export default class DrinkDataItemList extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    _selectionMode = false;
    _count = 0;

    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            NoData: false,
            // VineyardList:
            //     [
            //         {
            //             AdditionalLocationImages:null,
            //             Latitude:null,
            //             Longitude:null,
            //             firmId:2187,
            //             id:2187,
            //             imageUrl:null,
            //             key:2187,
            //             phone:null,
            //             subtitle:null,
            //             title:"Daline",
            //         },
            //         {
            //             AdditionalLocationImages: null,
            //             Latitude: null,
            //             Longitude: null,
            //             firmId: 2127,
            //             id: 2127,
            //             imageUrl: null,
            //             key: 2127,
            //             phone: null,
            //             subtitle: null,
            //             title: "Damery",
            //         },
            //         {
            //             AdditionalLocationImages:null,
            //             Latitude: null,
            //             Longitude: null,
            //             firmId: 2114,
            //             id: 2114,
            //             imageUrl: null,
            //             key: 2114,
            //             phone: null,
            //             subtitle: null,
            //             title: "Danguy",
            //         }
            //     ],
            VineyardList: [],
            showSliderBar: false,
            triangleType: '',
            falseSwitchIsOn_2: false,
            showModal: false,
            ModalData: {},
            category: null,
            subareaObj: {},
            searchKey: '',
            modalVisible: false,
            item: {},
            // letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            // letter:'A',
            letterSelect:true,
            picker2Value: '',
            isLoading:false
        };

        this._didFocusSubscription = props.navigation&&props.navigation.addListener('didFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        });
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }
    componentWillMount() {
        let {category, subareaObj, searchKey} = this.props;
        if (category === undefined || subareaObj === undefined || searchKey === undefined) {
            category = this.props.navigation.state.params.category;
            subareaObj = this.props.navigation.state.params.subareaObj;
            searchKey = 'What to';
        }
        this.setState({
            category: category,
            subareaObj: subareaObj,
            searchKey: searchKey
        });

        if(subareaObj.region_id){
            this.setState({
                letterSelect:false,
            });
            // this.requestData()
        }else {

        }
    }


    componentDidMount() {

        this._willBlurSubscription =  this.props.navigation&&this.props.navigation.addListener('willBlur', payload => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        });
        this.props.setShowSliderBar && this.props.setShowSliderBar(true);
    }
    onBackButtonPressAndroid = () => {
        if (this.isSelectionModeEnabled()) {
            this.disableSelectionMode();
            return true;
        } else {
            return false;
        }
    };

    isSelectionModeEnabled(){return this._selectionMode;}
    disableSelectionMode(){ this._selectionMode = false; }

    renderCell = (rowData: any) => {
        let scene = this.props.category ? this.props.category : this.props.navigation.state.params.category + 'Scene';
        return (
            <View>
                <VineyardCell
                    info={rowData.item}
                    onPress={() => {
                        this._selectionMode = true;
                        // this.setState({
                        //     item: rowData.item,
                        //     modalVisible: true
                        // })

                        //跳转
                        // this.props.itemOnpress
                        //     ? this.props.itemOnpress(rowData.item)
                        //     : this.props.screenProps.rootNavigator.navigate(scene,
                        //     {
                        //         info: rowData.item,
                        //         routeName: this.props.navigation.state.routeName,
                        //         rootNavigator: this.props.screenProps.rootNavigator,
                        //         _selectionMode : () => {
                        //             this._selectionMode = false;
                        //         }
                        //     });
                    }}
                />
            </View>
        )
    };

    render() {
        let {data,refreshState,_requestData,_nextPage} = this.props;
        return (
            <RefreshListView
                style={{
                    width: screen.width,
                    backgroundColor: '#ffffff00'
                }}
                data={data}
                renderItem={this.renderCell}
                refreshState={refreshState}
                onHeaderRefresh={_requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
                onFooterRefresh={_nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
                footerTextStyle={{color: '#ffffff'}}
                footerRefreshingText={'loading...'}
                footerFailureText={'click refresh'}
                footerNoMoreDataText={'no more data'}
                footerEmptyDataText={'empty data'}
            >
                {/*<LinearGradient colors={screen.colorTemp}*/}
                {/*start={{x: 0, y: 0}}*/}
                {/*end={{x: 1, y: 1}}*/}
                {/*style={[commonStyle.linearGradient, {paddingTop: 0}]}>*/}
                {/*{subareaObj.region_id&&this.showGoBackBut()}*/}
                {/*{!subareaObj.region_id&&this.showPickerSearchBut()}*/}
                {/*{!subareaObj.region_id&&this.showPicker()}*/}
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
                {/*// VineyardList: [],*/}
                {/*// letterSelect:true,*/}
                {/*}, () => {*/}
                {/*// this._getVineyardByName(i);*/}
                {/*});*/}
                {/*this.props.replaceSearchKey&&this.props.replaceSearchKey('What to')*/}
                {/*}}>*/}
                {/*{this.state.letters.map(item =>*/}
                {/*<HorizontalPicker.Item key={item} label={`${item}`} value={item}/>*/}
                {/*)}*/}
                {/*</HorizontalPicker>*/}
                {/*</View>*/}
                {/*this.state.letterSelect
                    ? (!subareaObj.region_id&&this.showNoSelectLetter())
                    : */}
                {/*{(this.state.VineyardList.length > 0*/}
                {/*? <RefreshListView*/}
                {/*style={{*/}
                {/*width: screen.width,*/}
                {/*backgroundColor: '#ffffff00'*/}
                {/*}}*/}
                {/*data={this.state.VineyardList}*/}
                {/*renderItem={this.renderCell}*/}
                {/*refreshState={this.state.refreshState}*/}
                {/*onHeaderRefresh={this.requestData}//下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing*/}
                {/*onFooterRefresh={this.nextPage}//上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing*/}
                {/*footerTextStyle={{color: '#ffffff'}}*/}
                {/*footerRefreshingText={'loading...'}*/}
                {/*footerFailureText={'click refresh'}*/}
                {/*footerNoMoreDataText={'no more data'}*/}
                {/*footerEmptyDataText={'empty data'}*/}
                {/*/>*/}
                {/*:(this.state.isLoading?this.showLoading(): (this.state.NoData && this.showNoDataMsg()) )*/}
                {/*)*/}
                {/*}*/}
                {/*</View>*/}
                {/*<Toast ref="toast" position='top'  positionValue={200} fadeInDuration={750} fadeOutDuration={1000}*/}
                {/*opacity={0.8}/>*/}
                {/*</LinearGradient>*/}
            </RefreshListView>
        )
    }
}