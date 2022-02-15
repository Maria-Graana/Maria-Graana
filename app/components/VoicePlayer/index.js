/** @format */

import React, { Component } from 'react'
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Slider from '@react-native-community/slider'
import * as Permissions from 'expo-permissions'
import { Audio } from 'expo-av'
import { isEqual } from 'underscore'
import moment from 'moment'
import AppStyles from '../../AppStyles'

const initialPlaybackStatus = {
  progressUpdateIntervalMillis: 200,
  positionMillis: 0,
  shouldPlay: false,
  rate: 1.0,
  shouldCorrectPitch: true,
  volume: 1.0,
  isMuted: false,
  isLooping: false,
}

export class VoicePlayer extends Component {
  constructor(props) {
    super(props)
    this.audioInstance = null
    this.isSeeking = false
    this._isMounted = false
    this.state = {
      isPlaying: false,
      shouldPlay: false,
      isBuffering: true,
      durationMillis: null,
      positionMillis: null,
      didJustFinish: true,
      shouldPlayAtEndOfSeek: false,
      rate: 1,
      isMuted: false,
      volume: 1,
      currentTime: null,
    }
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        // audio interrupts audio from other apps
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      })
      await this._loadAudio()
    } catch (error) {
      console.error(`Error setting the audio mode::: ${error}`)
    }
  }

  async componentWillUnmount() {
    if (this.audioInstance != null) {
      await this.audioInstance.unloadAsync()
      this.audioInstance = null
    }
  }

  _onPlaybackStatusUpdate = (playbackStatus) => {
    // prevents warnings
    if (isEqual(this.audioInstance, null) || !this._isMounted) return
    const {
      isLoaded,
      error,
      isPlaying,
      shouldPlay,
      isBuffering,
      didJustFinish,
      positionMillis,
      durationMillis,
      isMuted,
      volume,
      rate,
    } = playbackStatus

    if (!isLoaded) {
      // unloaded/buffering state
      this.setState({ isBuffering })
      if (error) {
        console.error(`Encountered a fatal error during playback: ${error}`)
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      this.setState({
        positionMillis,
        durationMillis,
        shouldPlay,
        isPlaying,
        isBuffering,
        rate,
        isMuted,
        volume,
        didJustFinish,
        currentTime: durationMillis,
      })

      // if the parent component needed to pause for some reason (e.g. navigating to another screen down the stack), pause
      // if (pausePlayback) this.audioInstance.pauseAsync()

      if (didJustFinish) {
        this.audioInstance.stopAsync()
      }
    }
  }

  _askForPermissionsAndPlaySound = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (response.status === 'granted') {
      this._onPlayPausePressed()
    } else {
      alert('Please provide audio permission to continue!')
    }
  }

  async _loadAudio() {
    let { audioFile } = this.props
    const source = { uri: audioFile }
    this.audioInstance = new Audio.Sound()
    try {
      await this.audioInstance.loadAsync(source, initialPlaybackStatus).then((playbackStatus) => {
        const { durationMillis } = playbackStatus
        this.setState({
          durationMillis,
          currentTime: durationMillis,
        })
      })
      this.audioInstance.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
    } catch (err) {
      console.error(`Error loading audio::: ${err}`)
    }
  }

  _onPlayPausePressed = () => {
    if (!isEqual(this.audioInstance, null)) {
      if (this.state.isPlaying) {
        this.audioInstance.pauseAsync()
      } else {
        this.audioInstance.setPositionAsync(this.state.positionMillis)
        this.audioInstance.playAsync()
      }
    }
  }

  _onSeekSliderValueChange = () => {
    if (!isEqual(this.audioInstance, null) && !this.isSeeking) {
      this.isSeeking = true
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay
      this.audioInstance.pauseAsync()
    }
  }

  _onSeekSliderSlidingComplete = async (positionMillis) => {
    if (!isEqual(this.audioInstance, null)) {
      this.isSeeking = false
      if (this.shouldPlayAtEndOfSeek) {
        await this.audioInstance.setPositionAsync(positionMillis)
        this.audioInstance.playAsync()
      } else {
        this.audioInstance.setPositionAsync(positionMillis)
      }
    }
  }

  millisToMinutesAndSeconds(millis) {
    if (millis) {
      var minutes = Math.floor(millis / 60000)
      var seconds = ((millis % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  }

  render() {
    const { isPlaying, currentTime } = this.state
    const { voiceLead } = this.props
    const { createdAt } = voiceLead
    return (
      <View style={styles.mainContainer}>
        <View style={styles.secondaryContainer}>
          {this.state.isBuffering ? (
            <ActivityIndicator style={{ alignSelf: 'center' }} color="black" size="small" />
          ) : (
            <TouchableOpacity onPress={this._askForPermissionsAndPlaySound}>
              <Image
                source={
                  isPlaying
                    ? require('../../../assets/img/pause.png')
                    : require('../../../assets/img/play.png')
                }
                style={styles.playPause}
              />
            </TouchableOpacity>
          )}

          <Slider
            style={styles.slider}
            disabled={this.state.isBuffering}
            // minimumTrackTintColor={isEqual(Platform.OS, 'ios') ? '#333' : '#bbb'}
            // maximumTrackTintColor={isEqual(Platform.OS, 'ios') ? '#bbb' : '#333'}
            thumbTintColor={isEqual(Platform.OS, 'ios') ? 'white' : AppStyles.colors.primaryColor}
            maximumValue={this.state.durationMillis}
            value={this.state.positionMillis}
            onValueChange={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
          />
        </View>
        <View>
          <View style={[styles.secondaryContainer, styles.extraSecondary]}>
            {!this.state.isBuffering && (
              <Text style={styles.duration}>{this.millisToMinutesAndSeconds(currentTime)}</Text>
            )}
            {!this.state.isBuffering && (
              <Text style={styles.createdDate}>
                {moment(createdAt).format('hh:mm A, MMM DD YY')}
              </Text>
            )}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 10,
  },
  secondaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraSecondary: {
    marginHorizontal: 5,
  },
  duration: {
    width: '25%',
    textAlign: 'right',
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 12,
  },
  createdDate: {
    width: '75%',
    textAlign: 'right',
    paddingHorizontal: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 12,
  },
  playPause: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  slider: {
    marginHorizontal: '3%',
    flex: 1,
  },
})

export default VoicePlayer
