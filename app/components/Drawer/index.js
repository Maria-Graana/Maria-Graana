import * as React from 'react';
import {
  DrawerContentScrollView,
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