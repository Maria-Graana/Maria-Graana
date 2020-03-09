import { createDrawerNavigator } from '@react-navigation/drawer';
import Landing from '../screens/landing/index';
import Diary from '../screens/Diary/index';
import React from 'react';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Landing" component={Landing} />
      <Drawer.Screen name='Diary' component={Diary} />
    </Drawer.Navigator>
  );
}