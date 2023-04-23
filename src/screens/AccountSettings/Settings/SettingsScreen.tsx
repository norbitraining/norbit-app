import React, {useMemo, useState} from 'react';
import {
  TouchableOpacity,
  View,
  SectionList,
  SectionListRenderItem,
  SectionListData,
  useColorScheme,
} from 'react-native';

import {GlobalStyles} from 'theme/globalStyle';

import {navigationRef, Screen} from 'router/Router';

import {rHeight, rWidth} from 'utils';
import {StyleSheet} from 'utils/stylesheet';

import Text from 'components/Text';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import Header from 'components/Header';
import Separator from 'components/Separator';
import {ButtonText, HeaderText} from 'utils/text';
import ModalSignOut from 'components/ModalSignOut';

const keyExtractor = (item: any, index: number) => `${item.text}-${index}`;
interface Item {
  text: string;
  screenName: any;
}

interface Section {
  title: string;
  SectionIcon: any;
  data: Item[];
}

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = ({}) => {
  const scheme = useColorScheme();

  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const [showModalSignOut, setShowModalSignOut] = useState<boolean>(false);

  const DataConfig: Section[] = [
    {
      title: 'Cuenta',
      SectionIcon: (props: any) => <IconFeather {...props} name="user" />,
      data: [
        {
          text: 'Editar Perfil',
          screenName: Screen.PROFILE,
        },
        {
          text: 'Cambiar Contraseña',
          screenName: Screen.CHANGE_PASSWORD_SETTINGS,
        },
      ],
    },
    {
      title: 'Mas',
      SectionIcon: (props: any) => (
        <Icon {...props} name="checkbox-blank-badge-outline" />
      ),
      data: [
        {
          text: 'Politica y privacidad',
          screenName: '.',
        },
        {
          text: 'Politica de uso ',
          screenName: '.',
        },
        {
          text: 'Version 2.2',
          screenName: null,
        },
      ],
    },
  ];
  const handleLogout = () => {
    setShowModalSignOut(true);
  };
  const handleCloseModal = () => {
    setShowModalSignOut(false);
  };

  const SectionHeader = ({
    section: {title, SectionIcon},
  }: SectionListData<{title: string; SectionIcon: string}>) => {
    return (
      <View style={isDark ? styles.headerDark : styles.header}>
        <SectionIcon
          size={20}
          color={EStyleSheet.value(isDark ? '$colors_white' : '$colors_black')}
          style={styles.icon}
        />
        <Text
          color={EStyleSheet.value(isDark ? '$colors_white' : '$colors_black')}
          fontSize={16}
          align="left">
          {title}
        </Text>
      </View>
    );
  };
  const SectionRenderItem: SectionListRenderItem<Item> = ({item}) => {
    const handleItem = () => {
      if (!item.screenName) {
        return;
      }
      navigationRef.navigate(item.screenName);
    };
    return (
      <TouchableOpacity
        style={[GlobalStyles.row, styles.item]}
        activeOpacity={0.8}
        onPress={handleItem}>
        <Text
          color={EStyleSheet.value(isDark ? '$colors_white' : '$colors_black')}
          fontSize={16}
          align="left"
          weight="Light">
          {item.text}
        </Text>
        {item.screenName && (
          <Icon
            name="chevron-right"
            color={EStyleSheet.value(
              isDark ? '$colors_white' : '$colors_black',
            )}
            size={rWidth(24)}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={isDark ? GlobalStyles.container : GlobalStyles.containerWhite}>
      <Separator thickness={5} />
      <Header
        text={HeaderText.settings}
        showBackButton={false}
        textColor={EStyleSheet.value(
          isDark ? '$colors_white' : '$colors_black',
        )}
      />
      <Separator thickness="7%" />
      <SectionList
        bounces={false}
        sections={DataConfig as any[]}
        stickySectionHeadersEnabled={false}
        keyExtractor={keyExtractor}
        renderItem={SectionRenderItem}
        renderSectionHeader={SectionHeader as any}
        contentContainerStyle={styles.contentContainerStyle}
        initialNumToRender={15}
      />
      <View style={GlobalStyles.center}>
        <TouchableOpacity
          style={[GlobalStyles.row, styles.buttonExit]}
          activeOpacity={0.8}
          onPress={handleLogout}>
          <IconFeather
            name="log-out"
            color={EStyleSheet.value('$colors_danger')}
            size={rWidth(19)}
            style={styles.iconExit}
          />
          <Text
            fontSize={18}
            color={EStyleSheet.value('$colors_danger')}
            weight="Light">
            {ButtonText.logOut}
          </Text>
        </TouchableOpacity>
      </View>
      <Separator thickness="8%" />
      <ModalSignOut
        visible={showModalSignOut}
        onCloseModal={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentNews: {
    paddingHorizontal: rWidth(30),
    paddingVertical: 15,
  },
  contentContainerStyle: {
    paddingHorizontal: '7%',
  },
  buttonBack: {
    marginTop: '4%',
    marginHorizontal: '5%',
  },
  buttonExit: {paddingHorizontal: '7%', paddingBottom: '5%'},
  item: {
    justifyContent: 'space-between',
    marginBottom: '6%',
  },
  header: {
    borderBottomWidth: 3,
    marginTop: rHeight(15),
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: rHeight(15),
    flexDirection: 'row',
    paddingBottom: 15,
  },
  headerDark: {
    borderBottomWidth: 3,
    marginTop: rHeight(15),
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: rHeight(15),
    flexDirection: 'row',
    paddingBottom: 15,
  },
  icon: {marginRight: 10},
  iconExit: {
    marginRight: 15,
  },
});

export default SettingsScreen;
