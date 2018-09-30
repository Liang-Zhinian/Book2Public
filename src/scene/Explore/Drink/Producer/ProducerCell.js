import React, {PureComponent} from 'react'
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2, Paragraph} from '../../../../widget/Text'
import {screen} from '../../../../common'
import {color} from '../../../../widget'
import StarRating from "../../../Common/StarRating";
import {RefreshState} from "react-native-refresh-list-view";


type Props = {
    info: Object,
    onPress: Function,
};


export default class ProducerCell extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            waiting:false,
        }
    }
    subString(str){
        if (str.length*13>screen.width*0.9-80){
            str = str.substring(0,Math.round((screen.width)/13))+'... ';
        }
        return str;
    }
    onStarRatingPress(value) {
        console.log('Rated ' + value + ' stars!');
    }
    toWait() {
        setTimeout(() => {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }
    render() {
        let {info} = this.props;
        let {waiting} =this.state;
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity  disabled={waiting} activeOpacity={0.9} style={styles.container} onPress={() => {
                    this.setState({waiting:true});
                    this.props.onPress(info);
                    this.toWait();
                }}>
                    <View style={{backgroundColor: '#ff9b9e', width: screen.width / 3, height: 50}}>

                    </View>
                </TouchableOpacity>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width:screen.width/3,
        alignSelf:'center',
        margin:5,
    },
    icon: {
        width: 50,
        paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
    rightContainer: {
        flexDirection:'row',
        backgroundColor:"#9dff4f00",
    },
    price: {
        color: color.primary
    }
})


