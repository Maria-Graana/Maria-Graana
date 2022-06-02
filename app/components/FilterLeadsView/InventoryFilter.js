/** @format */

import React from 'react'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import StaticData from '../../StaticData'

export default function InventoryFilter({
  project,
  selectedFloor,
  status,
  Price,
  setBottomSheet,
  onModalPriceShowPressed,
  minPrice,
  maxPrice,
  clear,
  onClear,
}) {
  return (
    <View style={styles.filterMainView}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {clear ? (
          <Pressable onPress={() => onClear()} style={styles.clearPressable}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => setBottomSheet('project')}
          style={[
            styles.filterPressable,
            {
              backgroundColor: project
                ? AppStyles.colors.primaryColor
                : AppStyles.colors.backgroundColor,
            },
          ]}
        >
          <Text style={{ fontSize: 12, color: project ? 'white' : AppStyles.colors.textColor }}>
            {project ? project : 'Project'}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color={project ? 'white' : AppStyles.colors.textColor}
          />
        </Pressable>

        <Pressable
          onPress={() => setBottomSheet('floors')}
          style={[
            styles.filterPressable,
            {
              backgroundColor: selectedFloor
                ? AppStyles.colors.primaryColor
                : AppStyles.colors.backgroundColor,
            },
          ]}
        >
          <Text
            style={{ fontSize: 12, color: selectedFloor ? 'white' : AppStyles.colors.textColor }}
          >
            {selectedFloor ? selectedFloor : 'Floors'}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color={selectedFloor ? 'white' : AppStyles.colors.textColor}
          />
        </Pressable>

        <Pressable
          onPress={() => setBottomSheet('status')}
          style={[
            styles.filterPressable,
            {
              backgroundColor: status
                ? AppStyles.colors.primaryColor
                : AppStyles.colors.backgroundColor,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 12,
              color: status ? 'white' : AppStyles.colors.textColor,
            }}
          >
            {status ? status : 'Status'}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color={status ? 'white' : AppStyles.colors.textColor}
          />
        </Pressable>
        <Pressable
          onPress={() => setBottomSheet('price')}
          style={[
            styles.filterPressable,
            {
              backgroundColor: status
                ? AppStyles.colors.primaryColor
                : AppStyles.colors.backgroundColor,
              marginRight: 25,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 12,
              color: status ? 'white' : AppStyles.colors.textColor,
            }}
          >
            {Price
              ? Price
              : `Price ${minPrice ? minPrice : ''} - ${
                  maxPrice
                    ? maxPrice === StaticData.Constants.any_value && !minPrice
                      ? ''
                      : maxPrice === StaticData.Constants.any_value
                      ? 'Any'
                      : maxPrice
                    : ''
                }`}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color={status ? 'white' : AppStyles.colors.textColor}
          />
        </Pressable>
      </ScrollView>
    </View>
  )
}
