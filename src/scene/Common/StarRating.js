
import React, {
    Component,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default class StarRating extends Component {
    // static propTypes = {
    //     disabled: PropTypes.bool,
    //     maxStars: PropTypes.number,
    //     rating: PropTypes.number,
    //     onStarChange: PropTypes.func,
    //     style: View.propTypes.style,
    //     starSize: PropTypes.number,
    // };

    static defaultProps = {
        disabled: true,
        maxStars: 5,
        rating: 0,
    };

    constructor(props) {
        super(props);
        // alert(this.props.rating);
        // const roundedRating = (Math.round(this.props.rating * 2) / 2);
        //可能导致闪退的原因
        const roundedRating = this.props.rating ;
        this.state = {
            maxStars: 5,
            rating: roundedRating
        }
    }

    pressStarButton (rating) {
        if (!this.props.disabled) {
            if (rating != this.state.rating) {
                if (this.props.onStarChange) {
                    this.props.onStarChange(rating);
                }
                this.setState({
                    rating: rating,
                });
            }
        }
    }

    // componentDidMount(){
    //     const roundedRating = this.props.rating ;
    //     this.setState({
    //         maxStars: this.props.maxStars,
    //         rating: roundedRating
    //     });
    // }

    render() {
        const starsLeft = this.state.rating;
        const starButtons = [];
        for (let i = 0; i < this.state.maxStars; i++) {
            const y = starsLeft.toString().indexOf(".");
            let starState=null;
            if (y > 0) {
                starState = (i+1) <= starsLeft ? require('../../img/public/star.png')
                    :( (i+1) === Math.round(starsLeft)? require('../../img/public/star-half.png'):require('../../img/public/starcel.png'));
            } else {
                starState = (i+1) <= starsLeft ? require('../../img/public/star.png') : require('../../img/public/starcel.png');
            }


            starButtons.push(
                <TouchableOpacity
                    activeOpacity={0.20}
                    key={i + 1}
                    onPress={this.pressStarButton.bind(this, (i + 1))}
                >
                    <Image source={starState}/>
                    {/*<Text style={[starColor,{fontSize:this.props.starSize}]}>{starStr}</Text>*/}
                </TouchableOpacity>
            );
        }
        return (
            <View style={[styles.starRatingContainer]}>
                {starButtons}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    starRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    selectedColor: {
        color:'#FF4946'
    },
    unSelectedColor:{
        color:'#999999'
    }
});