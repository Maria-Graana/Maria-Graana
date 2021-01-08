import * as types from '../types';

export function setlead(lead){
    return {
        type: types.SET_LEAD,
        payload: lead
    }
}

export function setLeadRes(lead){
    return (dispatch, getsState) => {
        dispatch({
            type: types.SET_LEAD,
            payload: lead
        })
        return lead
    }
}

export function removelead(lead){
    return {
        type: types.REMOVE_LEAD,
        payload: lead
    }
}

export function goBack(object) {
 const { lead, type, fromScreen, navigation} = object;
 let page = '';
 if(type === 'Investment') {
       // CM LEAD FLOW
       if (fromScreen === 'payments') {
         page = 'Payments'
       } else if(fromScreen === 'meetings') {
         page = 'Meetings'
       }
       navigation.navigate('CMLeadTabs', {
         screen: page,
         params: { lead: lead },
       })
 }
 else if(type === 'Property'){
   // PROPERTY RCM LEAD FLOW
   if (fromScreen === 'viewing') {
     page = 'Viewing'
   }
   if (fromScreen === 'offer') {
     page = 'Offer'
   }
   if (fromScreen === 'propsure') {
     page = 'Propsure'
   }
   if (fromScreen === 'payment') {
     page = 'Payment'
   }
   navigation.navigate('PropertyTabs', {
     screen: page,
     params: { lead: lead },
   })
 }
 else{
   // NORMAL RCM LEAD FLOW
   if (fromScreen === 'match') {
     page = 'Match'
   }
   if (fromScreen === 'viewing') {
     page = 'Viewing'
   }
   if (fromScreen === 'offer') {
     page = 'Offer'
   }
   if (fromScreen === 'propsure') {
     page = 'Propsure'
   }
   if (fromScreen === 'payment') {
     page = 'Payment'
   }
   navigation.navigate('RCMLeadTabs', {
     screen: page,
     params: { lead: lead }
   })
 }

}