import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name) {
  navigationRef.current?.navigate(name, {screen: name});
}

export function navigateTo(name, params) {
  navigationRef.current?.navigate(name, params);
}