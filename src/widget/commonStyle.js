import {StyleSheet} from "react-native";
import {screen} from "../common";

export const commonStyle = {
    //Explore-----------------------------------------------------
    //4Cube---
    tabViewStylePage: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
    },
    cubeStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cubeStyleDrink: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',

    },
    //SearchAnythingScene----
    searchIcon: {
        width: 20,
        height: 20,
        // alignSelf: 'flex-start',
    },
    searchBar: {

        width: screen.width *0.95,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ffffff50',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        // paddingLeft: 10,
        marginTop:5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    linearGradient: {
        paddingTop: screen.statusBarHeight,
        // justifyContent: 'center',
        // alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
    },
    container: {
        flex: 1,
        backgroundColor:'#ffffff00'
    },

    //CommodityDetails----
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
        tintColor: '#fff'
    },
    banner: {
        width: screen.width,
        height: screen.height * 0.4,
        resizeMode: 'cover',
        backgroundColor: '#000',
    },
    tipHeader: {
        height: 50,
        width: screen.width,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f3f3f3'
    },
    mapImageStyle: {
        width: screen.width,
        height: screen.width * 0.4,
        borderRadius: 45,
    },
    arrow: {
        width: 16,
        height: 16,
        tintColor: '#5a5a5a',
    },

    //ExploreScene---
    surface: {
        width: screen.width,
        height: screen.width,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#5b5b5b3d',
        backgroundColor: '#fff',
        flex: 1,
    },
    pageImg: {
        width: screen.width,
        height: screen.width,
        borderRadius: 5,
    },
    tabTextStyle: {
        fontSize: 12,
        textAlignVertical: 'center',
    },
    tabViewTextStyle: {
        borderRadius: 5,
        width: screen.width * 0.25,
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    tabTextInfoStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        width: screen.width * 0.95 / 4,
        alignItems: 'center',
    },
    tabViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screen.width * 0.95,
        flexDirection: 'row',
    },
    // searchIcon: {
    //     backgroundColor: 'transparent',
    //     width: 15,
    //     height: 15,
    //     alignSelf: 'flex-start',
    // },
    // searchBar: {
    //     width: screen.width * 0.95,
    //     borderBottomWidth:StyleSheet.hairlineWidth,
    //     borderBottomColor: '#ffffff50',
    //     flexDirection: 'row',
    //     backgroundColor: 'transparent',
    //     paddingTop:10,
    //     paddingBottom:10,
    // },

    containerExplore: { //有重复
        flex: 1,
        paddingTop: screen.statusBarHeight,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    /*SearchAnythingInfoScene*/
    searchBox: {//搜索框
        width: screen.width * 0.95,
        // height: 40,
        // borderBottomWidth: 0.3,
        // borderBottomColor: 'white',
        flexDirection: 'row',
        // backgroundColor: '#7c3fff',
    },
    //Explore-----------------------------------------------------

    //Home-----------------------------------------------------


    //Home-----------------------------------------------------
};
