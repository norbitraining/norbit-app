import React from 'react';

import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FastImage, {Source} from 'react-native-fast-image';
import {GlobalStyles} from 'theme/globalStyle';

export interface ButtonProps {
  source: Source;
}

const BackgroundContainer: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  source,
  children,
}) => {
  return (
    <View style={GlobalStyles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.absolute}>
        <FastImage source={source} style={styles.absoluteImage} />
        <LinearGradient
          colors={['#0E1113', '#1B1B1B']}
          style={styles.absoluteGradient}
        />
      </View>

      {children}
    </View>
  );
};

const absolute = {...StyleSheet.absoluteFillObject};

export default BackgroundContainer;

const styles = StyleSheet.create({
  absolute: absolute,
  absoluteImage: {
    ...absolute,
    width: '100%',
    height: '100%',
  },
  absoluteGradient: {...absolute, opacity: 0.6},
});
