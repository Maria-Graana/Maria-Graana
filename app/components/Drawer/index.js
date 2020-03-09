import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';


export default function CustomDrawerContent( {navigation} ) {
    navigateTo = (screen) => {
        navigation.navigate(screen)
    }

    return (
        <DrawerContentScrollView {...navigation}>
            <DrawerItem label="Diary" onPress={(props) => navigateTo('Diary')} />
        </DrawerContentScrollView>
    );
}