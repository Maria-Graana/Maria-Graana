/** @format */

import axios from 'axios'
import React, { Component } from 'react'
import { Alert, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppStyles from '../../AppStyles'
import CommentTile from '../../components/CommentTile'
import Loader from '../../components/loader'
import AddComment from './addComment'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import helper from '../../helper'
class Comments extends Component {
  comments = []

  constructor(props) {
    super(props)
    const { user, lead, permissions } = this.props
    this.state = {
      commentsList: [],
      comment: '',
      loading: true,
      type: 'comment',
      property: false,
      addCommentLoading: false,
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions),
    }
  }

  componentDidMount() {
    this.getCommentsFromServer()
  }

  getCommentsFromServer = () => {
    const { type, property } = this.state
    const { route, navigation } = this.props
    if ('rcmLeadId' in route.params || 'cmLeadId' in route.params) {
      navigation.setParams({ title: 'LEAD COMMENTS' })
      const { rcmLeadId, cmLeadId } = route.params
      const url = rcmLeadId
        ? `/api/leads/comments?rcmLeadId=${rcmLeadId}&type=${type}`
        : `/api/leads/comments?cmLeadId=${cmLeadId}&type=${type}`

      axios
        .get(url)
        .then((response) => {
          this.setState({ commentsList: response.data, comment: '', loading: false })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      navigation.setParams({ title: 'PROPERTY COMMENTS' })
      const { propertyId, screenName } = route.params
      const url = `/api/leads/comments?shortListPropertyId=${propertyId}`
      axios
        .get(url)
        .then((response) => {
          this.setState({
            property: true,
            commentsList: response.data,
            comment: '',
            loading: false,
          })
        })
        .catch((error) => {
          console.log(`ERROR: /api/leads/comments ${error}`)
        })
    }
  }

  setComment = (value) => {
    this.setState({ comment: value })
  }

  showDeleteDialog(item) {
    Alert.alert(
      'Delete comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteComment(item) },
      ],
      { cancelable: false }
    )
  }

  deleteComment = (commentId) => {
    axios
      .delete(`/api/leads/comments/remove?id=${commentId}`)
      .then((res) => {
        this.getCommentsFromServer()
      })
      .catch((error) => {
        console.log('error', error.message)
      })
  }

  addComment = () => {
    const { comment, property, closedLeadEdit } = this.state
    const { route } = this.props
    const { rcmLeadId, cmLeadId, screenName, propertyId, leadId } = route.params
    let commentObject = {}
    this.setState({ addCommentLoading: true }, () => {
      if (comment.length > 0 && comment !== '') {
        if (!property) {
          if (rcmLeadId) {
            commentObject = {
              value: comment,
              type: 'comment',
              rcmLeadId: rcmLeadId,
            }
          } else {
            commentObject = {
              value: comment,
              type: 'comment',
              cmLeadId: cmLeadId,
            }
          }
        } else {
          if (leadId) {
            commentObject = {
              value: comment,
              type: 'comment',
              shortListPropertyId: propertyId,
              title: screenName,
              rcmLeadId: leadId,
            }
          }
        }
        axios
          .post(`/api/leads/comments`, commentObject)
          .then((response) => {
            this.getCommentsFromServer()
          })
          .catch((error) => {
            console.log('error=>', error.message)
          })
          .finally(() => {
            this.setState({ addCommentLoading: false })
          })
      } else {
        alert('Please add something in comment!')
      }
    })
  }

  render() {
    const { commentsList, loading, comment, property, addCommentLoading, closedLeadEdit } =
      this.state
    const { permissions } = this.props
    return !loading ? (
      <KeyboardAwareScrollView
        style={[AppStyles.container, { paddingHorizontal: 0, marginBottom: 25 }]}
      >
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ref={(r) => (this.flatList = r)}
          data={commentsList}
          renderItem={({ item }) => (
            <CommentTile
              property={property}
              data={item}
              addComment={this.addComment}
              deleteComment={(item) => this.showDeleteDialog(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {getPermissionValue(
          PermissionFeatures.BUY_RENT_LEADS,
          PermissionActions.UPDATE,
          permissions
        ) && closedLeadEdit ? (
          <AddComment
            onPress={this.addComment}
            loading={addCommentLoading}
            comment={comment}
            setComment={this.setComment}
          />
        ) : null}
      </KeyboardAwareScrollView>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    permissions: store.user.permissions,
    lead: store.lead.lead,
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Comments)
