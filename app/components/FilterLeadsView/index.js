/** @format */

import React from 'react'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SortImg from '../../../assets/img/sort.png'

export default function FilterLeadsView({
  statusLead,
  sortLead,
  idLead,
  nameLead,
  dateLead,
  countryLead,
  emailLead,
  phoneLead,
  classificationLead,
  setBottomSheet,
  hasBooking,
  contactScreen,
  clear,
  onClear,
  openStatus,
  hide,
}) {
  return (
    <View style={styles.filterMainView}>
      {contactScreen ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          {clear ? (
            <Pressable onPress={() => onClear()} style={styles.clearPressable}>
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => setBottomSheet('name')}
            style={[
              styles.filterPressableForContacts,
              {
                backgroundColor: nameLead
                  ? AppStyles.colors.primaryColor
                  : AppStyles.colors.backgroundColor,
              },
            ]}
          >
            <Text style={{ fontSize: 12, color: nameLead ? 'white' : AppStyles.colors.textColor }}>
              {nameLead ? nameLead : 'Name'}
            </Text>
            <Ionicons
              name="chevron-down-outline"
              size={20}
              color={nameLead ? 'white' : AppStyles.colors.textColor}
            />
          </Pressable>
          <Pressable
            onPress={() => setBottomSheet('phone')}
            style={[
              styles.filterPressableForContacts,
              {
                backgroundColor: phoneLead
                  ? AppStyles.colors.primaryColor
                  : AppStyles.colors.backgroundColor,
              },
            ]}
          >
            <Text style={{ fontSize: 12, color: phoneLead ? 'white' : AppStyles.colors.textColor }}>
              {phoneLead ? phoneLead : 'Phone #'}
            </Text>
            <Ionicons
              name="chevron-down-outline"
              size={20}
              color={phoneLead ? 'white' : AppStyles.colors.textColor}
            />
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => openStatus()} style={{ marginLeft: 15, marginRight: 5 }}>
            <Image source={SortImg} style={[styles.sortImg]} />
          </TouchableOpacity>
          {clear ? (
            <Pressable onPress={() => onClear()} style={styles.clearPressable}>
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
          ) : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {!hide && (
              <Pressable
                onPress={() => setBottomSheet('leadStatus')}
                style={[
                  styles.filterPressable,
                  {
                    backgroundColor: statusLead
                      ? AppStyles.colors.primaryColor
                      : AppStyles.colors.backgroundColor,
                  },
                ]}
              >
                <Text
                  style={{ fontSize: 12, color: statusLead ? 'white' : AppStyles.colors.textColor }}
                >
                  {statusLead ? statusLead : 'Lead Status'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color={statusLead ? 'white' : AppStyles.colors.textColor}
                />
              </Pressable>
            )}
            <Pressable
              onPress={() => setBottomSheet('id')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: idLead
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text style={{ fontSize: 12, color: idLead ? 'white' : AppStyles.colors.textColor }}>
                {idLead ? `ID: ${idLead}` : 'ID'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={idLead ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => setBottomSheet('name')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: nameLead
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{ fontSize: 12, color: nameLead ? 'white' : AppStyles.colors.textColor }}
              >
                {nameLead ? nameLead : 'Name'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={nameLead ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => setBottomSheet('date')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: dateLead
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                  marginRight: hasBooking ? 25 : 0,
                },
              ]}
            >
              <Text
                style={{ fontSize: 12, color: dateLead ? 'white' : AppStyles.colors.textColor }}
              >
                {dateLead ? dateLead : 'Date'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={dateLead ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            {!hasBooking ? (
              <Pressable
                onPress={() => setBottomSheet('country')}
                style={[
                  styles.filterPressable,
                  {
                    backgroundColor: countryLead
                      ? AppStyles.colors.primaryColor
                      : AppStyles.colors.backgroundColor,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: countryLead ? 'white' : AppStyles.colors.textColor,
                  }}
                >
                  {countryLead ? countryLead : 'Country'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color={countryLead ? 'white' : AppStyles.colors.textColor}
                />
              </Pressable>
            ) : null}
            {!hasBooking ? (
              <Pressable
                onPress={() => setBottomSheet('email')}
                style={[
                  styles.filterPressable,
                  {
                    backgroundColor: emailLead
                      ? AppStyles.colors.primaryColor
                      : AppStyles.colors.backgroundColor,
                  },
                ]}
              >
                <Text
                  style={{ fontSize: 12, color: emailLead ? 'white' : AppStyles.colors.textColor }}
                >
                  {emailLead ? emailLead : 'Email ID'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color={emailLead ? 'white' : AppStyles.colors.textColor}
                />
              </Pressable>
            ) : null}
            {!hasBooking ? (
              <Pressable
                onPress={() => setBottomSheet('phone')}
                style={[
                  styles.filterPressable,
                  {
                    backgroundColor: phoneLead
                      ? AppStyles.colors.primaryColor
                      : AppStyles.colors.backgroundColor,
                  },
                ]}
              >
                <Text
                  style={{ fontSize: 12, color: phoneLead ? 'white' : AppStyles.colors.textColor }}
                >
                  {phoneLead ? phoneLead : 'Phone #'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color={phoneLead ? 'white' : AppStyles.colors.textColor}
                />
              </Pressable>
            ) : null}
            {!hasBooking ? (
              <Pressable
                onPress={() => setBottomSheet('classification')}
                style={[
                  styles.filterPressable,
                  {
                    backgroundColor: classificationLead
                      ? AppStyles.colors.primaryColor
                      : AppStyles.colors.backgroundColor,
                    marginRight: 25,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: classificationLead ? 'white' : AppStyles.colors.textColor,
                  }}
                >
                  {classificationLead ? classificationLead : 'Classification'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color={classificationLead ? 'white' : AppStyles.colors.textColor}
                />
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
