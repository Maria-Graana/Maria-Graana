import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Animated, TextInput, TouchableOpacity, Text } from 'react-native';
// import { searchPropertiesFilterSearchParams } from '../../actions/property';
// import { getAreas } from '../../actions/home'
import _ from 'underscore';
import { Checkbox } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import fuzzy from 'fuzzy'
import AppStyles from '../../AppStyles';
import Loader from '../../components/loader';
import { getAreas, clearAreas, setAreaLoader, setSelectedAreas } from "../../actions/areas";
import { RotationGestureHandler } from 'react-native-gesture-handler';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class AreaPickerScreen extends React.Component {
    areaIds = []
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            selectedAreaIds: this.areaIds,
        }
    }

    componentDidMount() {
        const { route, dispatch, selectedAreaIds } = this.props;
        const { cityId } = route.params;
        dispatch(setAreaLoader(true))
        dispatch(getAreas(cityId));
        if (route.params.isEditMode) {
            this.areaIds = [...selectedAreaIds];
            this.setState({ selectedAreaIds: this.areaIds });
        }

    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        const { selectedAreaIds } = this.state;
        // Set Areas selected and update redux store
        dispatch(setSelectedAreas(selectedAreaIds))
        dispatch(clearAreas());
    }



    setSelectedArea = (obj) => {
        this.areaIds = [...this.state.selectedAreaIds]
        if (this.areaIds.includes(obj.value)) {
            this.areaIds = _.without(this.areaIds, obj.value);
        } else {
            this.areaIds.push(obj.value);
        }
        this.setState({ selectedAreaIds: this.areaIds }, () => {
        });

    }

    setStatus = (item) => {
        return _.contains(this.areaIds, item.value) ? 'checked' : 'unchecked';
    }

    renderListWithMultipleSelectOptions = ({ item }) => {

        return (
            <TouchableOpacity
                onPress={() => this.setSelectedArea(item)}>
                <View style={{ width: wp('100%'), paddingTop: hp('1.5%'), paddingBottom: hp('1.5%'), flexDirection: 'row', alignItems: 'center', borderTopColor: '#ddd', borderTopWidth: 0.5, alignSelf: 'stretch' }}>
                    <Text style={{ color: AppStyles.colors.textColor, marginLeft: wp('2.5%'), fontSize: 18, width: wp('80%') }}>{item.name}</Text>
                    <Checkbox
                        status={this.setStatus(item)}
                        color={AppStyles.colors.primaryColor}
                        onPress={() => this.setSelectedArea(item)}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { searchText } = this.state;
        const { areas, loading } = this.props;
        let data = [];

        if (searchText !== '' && data.length === 0) {
            data = fuzzy.filter(searchText, areas, { extract: (e) => e.name })
            data = data.map((item) => item.original)
        }
        else {
            data = areas;
        }

        return (
            !loading ?
                <View style={[AppStyles.container, { paddingHorizontal: 0, backgroundColor: AppStyles.bgcWhite.backgroundColor }]}>
                    <View style={[AppStyles.formControl, AppStyles.inputPadLeft, {
                        justifyContent: 'center', marginTop: 15, marginBottom: 15,
                        borderColor: 'grey',
                        borderWidth: 0.5,
                    }]}>
                        <TextInput
                            placeholder=' Type to filter '
                            value={searchText}
                            onChangeText={(value) => this.setState({ searchText: value })}
                        />
                    </View>
                    <AnimatedFlatList
                        data={
                            data
                        }
                        renderItem={this.renderListWithMultipleSelectOptions}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ paddingTop: 0 }}
                        scrollIndicatorInsets={{ top: 0 }}
                    />
                </View>
                :
                <Loader loading={loading} />
        );
    }
}

export default connect(store => {
    return {
        areas: store.areasReducer.areas,
        loading: store.areasReducer.areaLoader,
        selectedAreaIds: store.areasReducer.selectedAreas
    }
})(AreaPickerScreen)