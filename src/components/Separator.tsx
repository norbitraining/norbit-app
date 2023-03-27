import React, {useMemo} from 'react';
import {View, ViewStyle} from 'react-native';
import {rHeight} from 'utils';

export interface SeparatorProps {
  color?: string;
  thickness: number | string;
}

const Separator: React.FC<SeparatorProps> = ({
  color,
  thickness,
}): React.ReactElement => {
  const style = useMemo<ViewStyle>(
    (): ViewStyle => ({
      backgroundColor: color,
      height:
        typeof thickness === 'string' ? thickness : rHeight(thickness || 0),
      width: '100%',
    }),
    [color, thickness],
  );

  return <View style={style} />;
};

export default Separator;
