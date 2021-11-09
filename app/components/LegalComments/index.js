/** @format */

import React from 'react'
import { Modal, SafeAreaView, Text, View, FlatList, KeyboardAvoidingView } from 'react-native'
import BackButton from '../../components/BackButton'
import CommentTile from '../../components/CommentTile'
import AddComment from '../../screens/Comments/addComment'
import LoadingNoResult from '../LoadingNoResult'
import CMBTN from '../../components/CMBTN'
import { connect } from 'react-redux'
import styles from './style'

class LegalComments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: '',
    }
  }

  addComment = () => {}

  showDeleteDialog = () => {}

  setComment = (value) => {
    this.setState({ comment: value })
  }

  render() {
    const { comment } = this.state
    const {
      active,
      toggleComments,
      selectedDocument,
      commentModalLoading,
      submitToAssignLegal,
      documentComments,
      viewCommentsCheck,
    } = this.props
    return (
      <Modal
        style={{ backgroundColor: AppStyles.colors.backgroundColor }}
        visible={active}
        animationType="slide"
        onRequestClose={toggleComments}
      >
        <SafeAreaView style={styles.flexView}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.topHeader}>
              <View style={styles.padLeft}>
                <BackButton onClick={toggleComments} />
              </View>
              <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerText}>
                  {' '}
                  {selectedDocument && selectedDocument.name && selectedDocument.name.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.barView}>
              <Text style={styles.barText}>COMMENTS</Text>
            </View>
            <View style={styles.commentStyle}>
              {documentComments && documentComments.length && viewCommentsCheck ? (
                <FlatList
                  contentContainerStyle={{ flexGrow: 1 }}
                  ref={(r) => (this.flatList = r)}
                  data={documentComments}
                  renderItem={({ item }) => (
                    <CommentTile
                      data={item}
                      addComment={this.addComment}
                      deleteComment={(item) => this.showDeleteDialog(item)}
                      deleteCommentCheck={false}
                    />
                  )}
                  keyExtractor={(item, index) => item.id.toString()}
                />
              ) : (
                <>{viewCommentsCheck ? <LoadingNoResult loading={commentModalLoading} /> : null}</>
              )}
              {(selectedDocument &&
                selectedDocument.status &&
                selectedDocument.status === 'uploaded' &&
                !viewCommentsCheck) ||
              (selectedDocument &&
                selectedDocument.status &&
                selectedDocument.status === 'rejected' &&
                !viewCommentsCheck) ? (
                <AddComment
                  onPress={this.addComment}
                  comment={comment}
                  setComment={this.setComment}
                  showBtn={false}
                />
              ) : null}
              {!viewCommentsCheck ? (
                <View style={styles.kfiBTN}>
                  <CMBTN
                    onClick={() => {
                      submitToAssignLegal(selectedDocument, comment)
                    }}
                    btnText={'SUBMIT TO LEGAL'}
                    checkLeadClosedOrNot={true}
                    extraStyle={styles.btnStyle}
                  />
                </View>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <SafeAreaView style={styles.safeView} />
      </Modal>
    )
  }
}

mapStateToProps = (store) => {
  return {
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(LegalComments)
