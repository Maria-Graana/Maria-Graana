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
