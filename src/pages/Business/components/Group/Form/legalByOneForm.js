import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import { PHONE_PATTERN } from '@/common/regExp';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
const legalForm = (props) => {
  const { form, initialValues, dispatch, cRef } = props;
  const fetchGetOcrIdCardFront = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrIdCardFront',
      payload: payload,
      callback: (val) => callback(val),
    });
  };
  const fetchGetOcrIdCardBack = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrIdCardBack',
      payload: payload,
      callback: (val) => callback(val),
    });
  };
  const formItems = [
    {
      label: '结算人身份证正面照',
      name: 'certFrontPhoto',
      type: 'upload',
      maxSize: 1,
      maxFile: 1,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        form.setFieldsValue({
          certFrontPhoto: imgUrl[0],
        });
        if (imgUrl) {
          fetchGetOcrIdCardFront({ imageUrl: imgUrl[0] }, (res) => {
            const { name, num } = res;
            form.setFieldsValue({
              legalPerson: name || '',
              legalCertId: num || '',
            });
          });
        }
      },
    },
    {
      label: '结算人身份证反面照',
      name: 'certReversePhoto',
      type: 'upload',
      maxSize: 1,
      maxFile: 1,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        form.setFieldsValue({
          certReversePhoto: imgUrl[0],
        });
        if (imgUrl) {
          fetchGetOcrIdCardBack({ imageUrl: imgUrl[0] }, (res) => {
            const { startDate, endDate } = res;
            form.setFieldsValue({
              activeBeginDate: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
            });
          });
        }
      },
    },
    {
      label: '结算人姓名',
      name: 'legalPerson',
      // rules: [{ required: true, message: `请确认店铺门头照` }],
    },
    {
      label: '结算人身份证号码',
      name: 'legalCertId',
    },
    {
      label: '结算人身份有效期',
      type: 'rangePicker',
      name: 'activeBeginDate',
      // disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ groupSet, loading }) => ({
  ...groupSet,
  loading: loading.models.groupSet,
}))(legalForm);
