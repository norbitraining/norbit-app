import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {fontMaker, TypeFontWeight} from 'font';
import {ColorPalette} from 'theme/palette';
import {StyleSheet} from 'utils/stylesheet';

export interface TextCustomProps {
  fontSize?: number;
  color?: typeof ColorPalette | string;
  lineHeight?: number;
  weight?: TypeFontWeight;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const TextComponent: React.FC<React.PropsWithChildren<TextCustomProps>> = ({
  children,
  fontSize,
  color = ColorPalette.primary,
  weight = 'Regular',
  align = 'left',
  numberOfLines,
  lineHeight,
  style,
}) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: fontSize || 14,
      lineHeight,
      color,
      textAlign: align,
      ...fontMaker({weight}),
    },
  });
  return (
    <Text style={[styles.text, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

export default TextComponent;
