import axios from 'axios';
import * as types from '../types';

export function flushImages() {
  return {
    type: types.FLUSH_IMAGES,
  };
}

export function removeImage(id) {
  return (dispatch, getState) => {
    let promise = axios.delete(`/api/inventory/image/${id}`).then((response) => {
      dispatch({
        type: types.IMAGE_REMOVE,
        payload: id,
      })
      return 'Image Deleted Successfully';
    }).catch(error => {
      console.log(error);
      return Promise.reject(error.response ? error.response.data : error.message);
    })
    return promise;
  }
}

export function setImageLoading(loading) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_IMAGE_LOADING,
      payload: loading,
    })
  }
}

export function addImage(image){
  return (dispatch,getState)=>{
    dispatch({
      type: types.ADD_IMAGES,
      payload: image,
    });
  }
}

export function uploadImage(image) {
  return (dispatch, getState) => {
    let index = getState().property.images.length;

    let fd = new FormData();
    fd.append('image', image);
    dispatch(addImage(image));
    let promise = axios.post(`/api/inventory/image`, fd)
      .then(response => {
        dispatch({
          type: types.IMAGE_UPLOAD_SUCCESS,
          payload: {
            index,
            id: response.data.id,
          },
        });
        dispatch(setImageLoading(false));
        return response.data;
      })
      .catch(error => {
        dispatch({
          type: types.IMAGE_UPLOAD_ERROR,
          payload: index,
        });
        return Promise.reject(error.response ? error.response.data : error.message);
      });
    return promise;
  }
}