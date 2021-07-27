import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import cityList from '@/common/city';
import moment from 'moment';

const activeForm = ({ form, initialValues, dispatch, cRef }) => {
  const fetchGetOcrBankLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBankLicense',
      payload: payload,
      callback: (val) => callback(val),
    });
  };
  const [city, setCity] = useState({});

  useImperativeHandle(cRef, () => ({
    getCity: () => {
      return { ...city };
    },
  }));

  const formItems = [
    {
      label: '开户许可证',
      name: 'openAccountPermit',
      type: 'upload',
      maxSize: 1,
      maxFile: 1,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        form.setFieldsValue({
          openAccountPermit: imgUrl[0],
        });
        if (imgUrl) {
          fetchGetOcrBankLicense({ imageUrl: imgUrl[0] }, (res) => {
            const { enterpriseNameCH = '', enterpriseBankId = '', enterpriseBankName } = res;
            form.setFieldsValue({
              cardName: enterpriseNameCH,
              bankBranchName: enterpriseBankName,
              cardNo: enterpriseBankId,
            });
          });
        }
      },
    },
    {
      label: '开户名称',
      name: 'cardName',
    },
    {
      label: '银行卡号',
      name: 'cardNo',
    },
    {
      label: '开户银行',
      name: 'bankBranchName',
      // addRules: [{ pattern: PHONE_PATTERN, message: '注册帐号为手机号，手机号不正确' }],
    },
    {
      label: '开户支行城市',
      name: 'city',
      type: 'cascader',
      select: JSON.parse(JSON.stringify(cityList)).map((item) => {
        item.children = item.children.map((items) => {
          return { label: items.label, value: items.value };
        });
        return item;
      }),
      onChange: (val, option) => {
        const { value } = option[0];
        setCity({
          provCode: value,
          areaCode: option[1].value,
          areaName: option[1].label,
        });
      },
    },
    {
      label: '开户行号',
      name: 'bankSwiftCode',
      rules: [{ required: false }],
      // type: 'select',
      // onSearch: vale => console.log(vale),
      // select:
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ groupSet }) => ({
  ...groupSet,
}))(activeForm);
