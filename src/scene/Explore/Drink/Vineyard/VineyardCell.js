import React, {PureComponent} from 'react'
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Heading2} from '../../../../widget/Text'
import {screen} from '../../../../common'
import {color} from '../../../../widget'
import StarRating from "../../../Common/StarRating";
import {RefreshState} from "react-native-refresh-list-view";

let count = 0

type Props = {
    info: Object,
    onPress: Function,
}


class VineyardCell extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            waiting: false
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
    toWait(){
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 1500);//设置的时间间隔由你决定
    }
    render() {
        let {info} = this.props;
        // let imageUrl = info.imageUrl.replace('w.h', '160.0')
        return (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.container}
                    onPress={() =>{
                        this.setState({waiting: true});
                        this.props.onPress(info);
                        this.toWait();
                    }}>
                    <View style={styles.rightContainer}>
                        <Heading2 style={{paddingTop: 5}}>{info.title}</Heading2>
                        <View style={{flexDirection: 'row', marginTop: 0, marginBottom: 10}}>
                            <StarRating
                                maxStars={5}
                                rating={3.5}
                                disabled={true}
                                starSize={15}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />
                            <Text style={{paddingLeft: 10, fontSize: 12}}>456 reviews</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'column',}}>
                        {(info.imageUrl !== null && info.imageUrl !== 'null') ?
                            <Image source={{uri: info.imageUrl}} style={styles.icon}/>
                            : <Image source={require('../../../../img/public/VineyardIcon.png')} style={styles.icon}/>}
                    </View>
                </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        width:screen.width*0.95,
        alignSelf:'center',
        marginBottom:10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: '#fff',
        borderRadius:3,
    },
    icon: {
        width: 50,
        height:50,
        // paddingBottom:100,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain'
    },
    rightContainer: {
        flex: 1,
        backgroundColor:"#9dff4f00",
        justifyContent:'space-between'
    },
    price: {
        color: color.primary
    }
});


export default VineyardCell
