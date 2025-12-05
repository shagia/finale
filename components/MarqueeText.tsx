import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Animated,
  Easing,
} from "react-native";

interface MarqueeTextProps {
  text: string;
  isFocused?: boolean;
  style?: any;
  width?: number;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, isFocused, style, width = 250 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const textWidthRef = useRef(0);
  const containerWidth = width;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [needsMarquee, setNeedsMarquee] = useState(false);

  useEffect(() => {
    if (needsMarquee && textWidthRef.current > 0) {
      // (isFocused? isFocused : null) is needed to give  scroll only when focused, otherwise it should always scroll
      // Calculate scroll distance to show all text
      // Scroll enough so the end of the text is visible
      // The ellipsis is positioned absolutely, so we need to account for its width
      const ellipsisWidth = 25; // Approximate width of "..." plus padding
      const endPadding = 10; // Additional spacing at the end to prevent cutoff
      const scrollDistance = textWidthRef.current - containerWidth + ellipsisWidth + endPadding;
      
      // Create step function animation - move in discrete steps
      const stepSize = 5; // Pixels per step
      const stepDuration = 280; // Milliseconds per step
      const numSteps = Math.ceil(scrollDistance / stepSize);
      
      // Build sequence of steps for scrolling forward - snap instantly
      const scrollSteps: Animated.CompositeAnimation[] = [];
      for (let i = 1; i <= numSteps; i++) {
        const targetValue = -Math.min(i * stepSize, scrollDistance);
        scrollSteps.push(
          Animated.sequence([
            Animated.delay(stepDuration),
            Animated.timing(translateX, {
              toValue: targetValue,
              duration: 0, // Instant snap
              easing: Easing.step0,
              useNativeDriver: true,
            })
          ])
        );
      }
      
      // Build sequence of steps for scrolling back - snap instantly
      const returnSteps: Animated.CompositeAnimation[] = [];
      for (let i = numSteps - 1; i >= 0; i--) {
        const targetValue = -Math.min(i * stepSize, scrollDistance);
        returnSteps.push(
          Animated.sequence([
            Animated.delay(stepDuration),
            Animated.timing(translateX, {
              toValue: targetValue,
              duration: 0, // Instant snap
              easing: Easing.step0,
              useNativeDriver: true,
            })
          ])
        );
      }
      
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.delay(2000), // Wait 2 seconds before starting
          ...scrollSteps,
          Animated.delay(2000), // Pause at the end
          ...returnSteps,
        ])
      );
      animationRef.current.start();
    } else {
      // Stop animation and reset position
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      translateX.setValue(0);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isFocused, needsMarquee, containerWidth, text]);

  const handleTextLayout = (event: any) => {
    const { width: measuredWidth } = event.nativeEvent.layout;
    textWidthRef.current = measuredWidth;
    setNeedsMarquee(measuredWidth > containerWidth);
  };

  return (
    <>
      {/* Hidden text to measure actual width - outside container so it's not constrained */}
      <View style={{ position: 'absolute', opacity: 0, zIndex: -1, left: -9999 }}>
        <Text
          onLayout={handleTextLayout}
          numberOfLines={1}
          style={style}
        >
          {text}
        </Text>
      </View>
      <View style={{ width: containerWidth + 2, height: 24, overflow: 'hidden', flexDirection: 'row', position: 'relative' }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            transform: [{ translateX }],
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[style, { includeFontPadding: false }]}
          >
            {text}
          </Text>
        </Animated.View>
        {needsMarquee && (
          <View style={{ position: 'absolute', right: 0, backgroundColor: isFocused ? 'lightgray' : '#171717', paddingLeft: 2, height: 20, justifyContent: 'center' }}>
            <Text numberOfLines={1} style={[style, { includeFontPadding: false }]}>...</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default MarqueeText;
