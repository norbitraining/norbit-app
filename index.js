/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {name as appName} from './app.json';
import {EMPTY_FN, setLogger} from './src/utils';

setLogger(__DEV__ ? console.log : EMPTY_FN);

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
