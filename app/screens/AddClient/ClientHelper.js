/** @format */

import React from 'react'

export const refreshAddress = (formData) => {
  let copyFormData = formData;
    copyFormData.province = '';
    copyFormData.district = '';
    copyFormData.city = '';
    copyFormData.address = '';

}


export const refreshMailingAddress = (formData) => {
  
  let copyFormData = formData;
    copyFormData.mProvince = '';
    copyFormData.mDistrict = '';
    copyFormData.mCity = '';
    copyFormData.mAddress = '';

}


export function capitalizeFirstLetter(string) {
  return string?.charAt(0)?.toUpperCase() + string.slice(1);
}