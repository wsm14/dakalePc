import React from 'react';
import SearchData from '../searchData';

/**
 *
 * @type {*} merchant  url
 * @onCancel 关闭
 * @valueName 回填参数名
 * @onOk 确认回调 valueName 不满足时
 */
const SearchDataContent = (props) => {
  const { form, type, visible, onCancel, valueName, onOk } = props;

  const propsItem = {
    merchant: {
      searchApi: 'businessList/fetchGetList',
      searchName: 'merchantName',
      itemkey: 'userMerchantIdString',
      itemName: [
        {
          title: '商户账号',
          dataIndex: 'account',
        },
        {
          title: '商户简称',
          dataIndex: 'merchantName',
        },
        {
          title: '所在城市',
          dataIndex: 'cityName',
        },
        {
          title: '详细地址',
          dataIndex: 'address',
        },
      ],
    },
    url: {
      searchApi: 'businessList/fetchGetList',
      searchName: 'merchantName',
      itemkey: 'userMerchantIdString',
      itemName: [
        {
          title: '活动名称',
          dataIndex: 'account',
        },
        {
          title: '活动链接',
          dataIndex: 'merchantName',
        },
      ],
    },
  }[type];

  return (
    <SearchData
      key={type}
      {...propsItem}
      visible={visible}
      onOk={(param) => {
        if (!onOk) {
          form.setFieldsValue({ [valueName]: param });
        } else onOk(param);
        onCancel();
      }}
      onCancel={onCancel}
    ></SearchData>
  );
};

export default SearchDataContent;
