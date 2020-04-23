import React, { Component } from 'react';
import { View, FlatList, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import _ from 'underscore';
import AppStyles from '../../AppStyles';
import AddComment from './addComment';
import CommentTile from '../../components/CommentTile'
import Loader from '../../components/loader'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Comments extends Component {
    comments = [];

    constructor(props) {
        super(props);
        this.state = {
            commentsList: [],
            comment: '',
            loading: true,
            type: 'comment'
        }
    }

    componentDidMount() {
        this.getCommentsFromServer();
    }

    getCommentsFromServer = () => {
        const { type } = this.state;
        const { route } = this.props;
        const { rcmLeadId, cmLeadId } = route.params;
        const url = rcmLeadId ? `/api/leads/comments?rcmLeadId=${rcmLeadId}&type=${type}`
            : `/api/leads/comments?cmLeadId=${cmLeadId}&type=${type}`

        axios.get(url).then(response => {
            this.setState({ commentsList: response.data, comment: '', loading: false });
        }).catch(error => {
            console.log(error);
        })
    }

    setComment = (value) => {
        this.setState({ comment: value })
    }

    showDeleteDialog(item) {
        Alert.alert('Delete comment', 'Are you sure you want to delete this comment?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => this.deleteComment(item) },
        ],
            { cancelable: false })
    }

    deleteComment = (commentId) => {
        axios.delete(`/api/leads/comments/remove?id=${commentId}`)
            .then((res) => {
                this.getCommentsFromServer();
            })
            .catch((error) => {
                console.log('error', error.message)
            })
    }

    addComment = () => {
        const { comment } = this.state;
        const { route } = this.props;
        const { rcmLeadId, cmLeadId } = route.params;
        let commentObject = {};

        if (comment.length > 0 && comment !== '') {
            if (rcmLeadId) {
                commentObject = {
                    value: comment,
                    type: 'comment',
                    rcmLeadId: rcmLeadId,
                }
            }
            else {
                commentObject = {
                    value: comment,
                    type: 'comment',
                    cmLeadId: cmLeadId,
                }
            }

            axios.post(`/api/leads/comments`, commentObject).then(response => {
                this.getCommentsFromServer();
            }).catch(error => {
                console.log('error=>', error.message);
            })
        }
        else {
            alert('Please add something in comment!')
        }

    }

    render() {
        const { commentsList, loading, comment } = this.state;
        return (
            !loading ?
                <KeyboardAwareScrollView style={[AppStyles.container, { paddingHorizontal: 0, marginBottom: 25 }]} >
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1 }}
                        ref={r => (this.flatList = r)}
                        data={commentsList}
                        renderItem={({ item }) => (
                            <CommentTile
                                data={item}
                                addComment={this.addComment}
                                deleteComment={(item) => this.showDeleteDialog(item)} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <AddComment onPress={this.addComment}
                        comment={comment}
                        setComment={this.setComment} />
                </KeyboardAwareScrollView>
                :
                <Loader loading={loading} />
        )
    }
}

export default Comments;
