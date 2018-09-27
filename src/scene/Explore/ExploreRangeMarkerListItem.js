import React, {PureComponent} from 'react'
import {Dimensions, Image, StyleSheet, TouchableOpacity, TouchableHighlight,Text, View, Linking} from 'react-native'
import {screen} from '../../common/index'
import {Heading2, Heading3, Paragraph} from '../../widget/Text'
import {color} from "../../widget";
import StarRating from "../Common/StarRating";


type Props = {
    onPress: Function,
    title: string,
}

class ExploreRangeMarkerListItem extends PureComponent<Props> {

    render() {
        let {info} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.9}  style={[styles.container, this.props.style]} onPress={() => this.props.onPress(info)}>

                <View style={[styles.rightContainer]}>
                    <Heading2 style={{color:'#ffffff'}}>{info.title}</Heading2>
                    <Paragraph numberOfLines={0} style={{marginTop: 5,color:'#ffffff'}}>{info.subtitle}</Paragraph>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        {/*<Heading2 style={styles.price}/>*/}
                    </View>
                    {!this.props.style && <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {info.Telephone && <TouchableOpacity activeOpacity={0.8}
                                                             style={{
                                                                 flexDirection: 'row',
                                                                 marginTop: 5,
                                                                 marginBottom: 5,
                                                                 width: screen * 0.8 / 3
                                                             }}
                                                             onPress={() => {
                                                                 Linking.openURL('tel:28050880')
                                                             }}
                        >
                            <Image style={{}} source={require('../../img/nearby/phone.png')}/>
                            <Text style={{marginLeft: 5, color: '#fff'}}>{info.Telephone}</Text>
                        </TouchableOpacity>}
                        <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, right: 10}}>
                            <StarRating
                                style={{}}
                                maxStars={5}
                                rating={3.5}
                                disabled={false}
                                starSize={15}
                                onStarChange={(value) => this.onStarRatingPress(value)}
                            />
                            <Text style={{paddingLeft: 10, fontSize: 12, color: '#fff'}}>456 reviews</Text>
                        </View>
                    </View>}
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: screen.width * 0.9,
        flexDirection: 'row',

    },
    rightContainer: {
        backgroundColor: '#2f3030cc',
        flex: 1,
        borderRadius:5,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft: 10,
        paddingRight:10,
        marginLeft:5,
        marginRight:5,
    },
    price: {
        color: color.primary
    }
});


export default ExploreRangeMarkerListItem;
