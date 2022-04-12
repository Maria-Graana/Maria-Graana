import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name) {
  navigationRef.current?.navigate(name, {screen: name});
}


export function navigateToSpecificTab(name, tab) {
  navigationRef.current?.navigate(name, { screen: tab})
}

export function navigateTo(name, params) {
  navigationRef.current?.navigate(name, params);
}