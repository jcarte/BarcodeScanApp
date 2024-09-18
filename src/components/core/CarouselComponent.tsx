import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { View, Dimensions } from "react-native";

import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import GlobalStyles from "../../lib/GlobalStyles";

export interface PageData {
    component: React.ReactNode,
    isSwipeEnabled: boolean,
}

export interface CarouselComponentProps {
    pages: PageData[]
}

const CarouselComponent = ({ pages }: CarouselComponentProps, ref): React.ReactNode => {
    const [index, setIndex] = React.useState<number>(0);
    const [isOverride, setIsOverride] = React.useState<boolean>(false);//stops moving to the next slide being blocked

    const caroRef = useRef<ICarouselInstance>(null)

    const FOOTER_HEIGHT_PERCENT = 0.10 //height of dots in footer
    const WIDTH = Dimensions.get('window').width
    const HEIGHT = Dimensions.get('window').height * (1 - FOOTER_HEIGHT_PERCENT)

    const DOT_SIZE = 16

    const isSwipeEnabled = pages[index].isSwipeEnabled

    //Tells the carousel that i want to move completely to the next slide, don't block it
    function forceScrollNext() {
        setIsOverride(true)
        caroRef.current.next({ onFinished: () => { setIsOverride(false) } })
    }

    //Makes the next slide function available to the parent via a ref
    useImperativeHandle(ref, () => ({
        //link ref methods to these internal methods
        next: () => {
            console.log("CC: Force next slide")
            forceScrollNext()
        }
    }))

    //Render the given component completely
    const carouselCardItem = ({ item }) => {
        return (
            <>
                {(item as PageData).component}
            </>
        )
    }

    return (
        <View style={{flex: 1}}>

            {/* Carousel Pages */}
            <View style={{
                width: WIDTH,
                height: HEIGHT,
            }}>
                <Carousel
                    ref={caroRef}
                    width={WIDTH}
                    height={HEIGHT}
                    loop={false}
                    data={pages}
                    enabled={true} //toggles gestures
                    pagingEnabled={true}
                    onScrollEnd={() => {

                    }}
                    onProgressChange={(_, absoluteProgress) => {
                        // console.log("current index:", absoluteProgress)

                        //Block swipe if isn't enabled on current slide, is trying to swipe forward and isn't being overriden (by button press) 
                        if (!isSwipeEnabled && absoluteProgress > index && !isOverride) {
                            caroRef.current.scrollTo({ index, animated: true }) //go back to previous slide
                            // console.log("Blocking swipe")
                        }
                        else {
                            setIndex(Math.round(absoluteProgress));//update dots
                            // console.log("current index:", absoluteProgress)
                        }
                    }}
                    renderItem={carouselCardItem}
                />
            </View>

            {/* Dots in footer */}
            <View style={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: DOT_SIZE,
                }}>
                    <AnimatedDotsCarousel

                        length={pages.length}
                        currentIndex={index}
                        maxIndicators={pages.length}
                        interpolateOpacityAndColor={true}
                        activeIndicatorConfig={{
                            color: GlobalStyles.colours.darkGreen,
                            margin: 10,
                            opacity: 1,
                            size: DOT_SIZE,
                        }}
                        inactiveIndicatorConfig={{
                            color: GlobalStyles.colours.lightGray,//TODO MAKE BRAND COLOR
                            margin: 10,
                            opacity: 1,
                            size: DOT_SIZE,
                        }}
                        decreasingDots={[
                            //Don't use these but have to have them
                            {
                                config: { color: 'blue', margin: 3, opacity: 0.5, size: DOT_SIZE },
                                quantity: 0,
                            },
                            {
                                config: { color: 'blue', margin: 3, opacity: 0.5, size: DOT_SIZE },
                                quantity: 0,
                            },
                        ]}
                    />
                </View>
            </View>

        </View>
    );
}
export default forwardRef(CarouselComponent)