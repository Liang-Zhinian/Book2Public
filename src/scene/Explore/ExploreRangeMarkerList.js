import React, {PureComponent} from 'react'
import {BackHandler, Platform, ScrollView, StyleSheet, Text, View} from 'react-native'
import PageControl from 'react-native-page-control'

import {screen} from '../../common/index'
import {color} from '../../widget/index'
import ExploreRangeMarkerListItem from './ExploreRangeMarkerListItem'
import {GetBusinessLocationsWithinRadius, getProducerByName} from "../../api";
import testData2 from '../../testData01'

type Props = {
    menuInfos: Array<Object>,
    onMenuSelected: Function,
}

type State = {
    currentPage: number
};


class ExploreRangeMarkerList extends PureComponent<Props, State>  {


    constructor(props: Object) {
        super(props);

        this.state = {
            currentPage: 0,
            data: [],
        }
    }
    _GetBusinessLocationsWithinRadius = async (name) => {
      let  latitude=22.2798079,longitude=114.1837883,radius=10,pageSize=10,pageIndex=0;
        await  GetBusinessLocationsWithinRadius(latitude,longitude,radius,name,pageSize,pageIndex)
            .then((responseJson) => {
                const dataList = responseJson.map((info) => {
                    return {
                        key: info.Id,
                        id: info.Id,
                        imageUrl:info.ImageUri,
                        title: info.Name,
                        subtitle: info.Address.Street,
                        Latitude: info.Geolocation.Latitude,
                        Longitude: info.Geolocation.Longitude,
                        description: info.Description,
                        AdditionalLocationImages: info.AdditionalLocationImages[0].ImageUri,
                        Telephone:info.ContactInformation.PrimaryTelephone
                    }
                });
                this.setState({data: dataList});
                this.props.loadMarker(dataList)
            })
            .catch((error) => {

            })
    };
    componentWillMount() {
        this._GetBusinessLocationsWithinRadius('')
        // if (this.props.siteId==='f996cb01-6b0c-4dfa-9687-78e59df6d0b1'){
        //     fetch(api.findLocations)
        //         .then((response) => response.json())
        //         .then((responseJson) => {
        //             // this.setState({data:responseJson}) ;
        //             console.log(responseJson);
        //             // const dataList = responseJson.map((info) => {
        //             //     return {
        //             //         key:info.Id,
        //             //         id: info.Id,
        //             //         imageUrl: 'data:image/png;base64,'+info.Image,
        //             //         title: info.Description,
        //             //         subtitle: ((info.StreetAddress!=null&&info.StreetAddress!='null')?info.StreetAddress:'')+((info.StreetAddress2!=null&&info.StreetAddress2!='null')?info.StreetAddress2:''),
        //             //         Latitude:info.Latitude,
        //             //         Longitude:info.Longitude,
        //             //         description: info.Description,
        //             //         AdditionalLocationImages:'data:image/png;base64,'+info.AdditionalLocationImages[0].Image,
        //             //     }
        //             // });
        //             // console.log(dataList)
        //             this.setState({data:dataList}) ;
        //
        //         })
        //         .catch((error) => {
        //             console.warn('请求错误',error);
        //         });
        // }else {
        //     const dataList = testData2.map((info) => {
        //         return {
        //             key:info.Id,
        //             id: info.Id,
        //             imageUrl: 'data:image/png;base64,'+info.Image,
        //             title: info.Description,
        //             subtitle: ((info.StreetAddress!=null&&info.StreetAddress!='null')?info.StreetAddress:'')+((info.StreetAddress2!=null&&info.StreetAddress2!='null')?info.StreetAddress2:''),
        //             Latitude:info.Latitude,
        //             Longitude:info.Longitude,
        //             description: info.Description,
        //             AdditionalLocationImages:'data:image/png;base64,'+info.AdditionalLocationImages[0].Image,
        //         }
        //     });
        //     // console.log(dataList)
        //     this.setState({data:dataList}) ;
        // }

    }
    scrollToList(msg){
        this.scrollView.scrollTo({ x: msg.x*screen.width*0.9 ,animated: true})
    }

    render() {
        let {onMenuSelected,_scrollToMarker} = this.props;
        let menuItems = this.state.data.map(
            (info, i) => (
                <ExploreRangeMarkerListItem
                    info={info}
                    onPress={() => {
                        onMenuSelected && onMenuSelected(info)
                    }}
                />
            )
        );

        let menuViews = [];
        let pageCount = Math.ceil(menuItems.length);

        for (let i = 0; i < pageCount; i++) {
            let items = menuItems.slice(i, i + 1);

            let menuView = (
                <View style={styles.itemsView} key={i}>
                    {items}
                </View>
            );
            menuViews.push(menuView)
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    ref={ (ref) => this.scrollView = ref }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={(e) => this.onScroll(e)}
                >
                    <View //onLayout={event=>{this.layoutX = event.nativeEvent.layout.x}}
                          style={styles.menuContainer}
                    >
                        {menuViews}
                    </View>
                </ScrollView>

                {/*<PageControl*/}
                    {/*numberOfPages={pageCount}*/}
                    {/*currentPage={this.state.currentPage}*/}
                    {/*hidesForSinglePage*/}
                    {/*pageIndicatorTintColor='#CFCFCF'*/}
                    {/*currentPageIndicatorTintColor={color.primary}*/}
                    {/*style={{position:'absolute',bottom:2,}}*/}
                {/*/>*/}
            </View>
        )
    }

    onScroll(e: any) {
        let x = e.nativeEvent.contentOffset.x;
        let currentPage = Math.round(x / screen.width*0.8);
        // console.log(x)
        // console.log('onScroll  ' + e.nativeEvent.contentOffset.x + '  page ' + currentPage + '  current ' + this.state.currentPage)
        this.props._scrollToMarker(currentPage);
        if (this.state.currentPage !== currentPage) {
            this.setState({
                currentPage: currentPage
            })
        }
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screen.width*0.9,
        // backgroundColor: '#ff3e25',
        marginBottom:5,
    },
    menuContainer: {
        flexDirection: 'row',
    },
    itemsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});


export default ExploreRangeMarkerList
