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
        // currentTime:
        //   this._getMMSSFromMillis(positionMillis) / this._getMMSSFromMillis(durationMillis),
      })

      // if the parent component needed to pause for some reason (e.g. navigating to another screen down the stack), pause
      // if (pausePlayback) this.audioInstance.pauseAsync()

      if (didJustFinish) {
        this.audioInstance.stopAsync()
      }
    }
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = (number) => {
      const string = number.toString()
      if (number < 10) {
        return '0' + string
      }
      return string
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
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
          currentTime: this._getMMSSFromMillis(durationMillis),
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
            // thumbTintColor="#333"
            maximumValue={this.state.durationMillis}
            value={this.state.positionMillis}
            onValueChange={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
          />
        </View>
        {/* <View>{!this.state.isBuffering && <Text>{currentTime}</Text>}</View> */}
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
    padding: 5,
    alignItems: 'center',
  },
  playPause: {
    width: 30,
    height: 30,
  },
  slider: {
    marginHorizontal: '3%',
    flex: 1,
  },
})

export default VoicePlayer
