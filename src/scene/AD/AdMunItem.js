import React, {PureComponent} from 'react'
import {Dimensions, Image, StyleSheet, TouchableOpacity, TouchableHighlight,Text, View, Linking} from 'react-native'
import {screen} from '../../common/index'
import {Heading2, Heading3,Tip, Paragraph} from '../../widget/Text'
import {color} from "../../widget";
import StarRating from "../Common/StarRating";


type Props = {
    onPress: Function,
    icon: any,
    title: string,
}

class AdMunItem extends PureComponent<Props> {

    render() {
        let {info} = this.props;
        return (
            <TouchableOpacity activeOpacity={1} style={[this.props.style]} onPress={() => this.props.onPress(info)}>
                <View style={[styles.container]}>
                    <View style={[styles.rightContainer]}>
                        <Tip style={{color: '#000'}}>{info.type}</Tip>
                        <Heading2 numberOfLines={0} style={{marginTop: 5, color: '#000'}}>{info.title}</Heading2>
                        <Paragraph numberOfLines={0} style={{marginTop: 5, color: '#828282'}}>{info.address}</Paragraph>

                        {/*<View style={{flex: 1, justifyContent: 'flex-end'}}>*/}
                        {/*/!*<Heading2 style={styles.price}/>*!/*/}
                        {/*</View>*/}

                    </View>
                    <View style={[styles.iconContainer]}>
                        <Image source={info.icon} style={styles.icon}/></View>
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width: screen.width * 0.95,
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: screen.width * 0.25,
        borderRadius:3,
        justifyContent: 'center',
        padding:5,
    },
    iconContainer: {
        width: screen.width * 0.25,
        // height: screen.width * 0.23,
        // paddingTop:5,
        // paddingBottom:5,
        // paddingLeft: 10,
        // paddingRight:10,
        // margin:5,
    },
    icon: {
        flex: 1,
        width: screen.width * 0.25,
        // height: screen.width * 0.23,
        backgroundColor:'#ffffff',
        resizeMode:'contain',
    },
    rightContainer: {
        backgroundColor: '#ffffff',
        flex: 1,
        // paddingTop:5,
        // paddingBottom:5,
        // paddingLeft: 10,
        // paddingRight:10,
        // margin:5,
        // marginRight:5,
    },
    price: {
        color: color.primary
    }
});


export default AdMunItem;
