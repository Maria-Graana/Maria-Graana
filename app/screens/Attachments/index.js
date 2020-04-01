import React, { Component } from 'react'
import { Text, View, FlatList, Image } from 'react-native'
import AttachmentTile from '../../components/AttachmentTile'
import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData';
import NoResultsComponent from '../../components/NoResultsComponent';
import _ from 'underscore';

class Attachments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachmentRows: StaticData.attachmentsRows,
        }
    }

    deleteAttachment = (item) => {
        const { attachmentRows } = this.state;
        let deletedRows = _.without(attachmentRows, item)
        this.setState({ attachmentRows: deletedRows })
    }

    render() {
        const { attachmentRows } = this.state;
        return (
            <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    data={attachmentRows}
                    renderItem={({ item }) => (
                        <AttachmentTile
                            data={item}
                            deleteAttachment={this.deleteAttachment}
                        />
                    )}
                    ListEmptyComponent={<NoResultsComponent imageSource={require('../../../assets/images/no-result2.png')} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        )
    }
}
export default Attachments;


