import React from 'react';
import SearchData from '../searchData';
import QRCode from 'qrcode.react';
import { Button, Popover } from 'antd';

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
    url: {
      searchInput: false,
      searchApi: 'activeTemplate/fetchActiveList',
      itemkey: 'jumpUrl',
      itemName: [
        {
          title: '活动名称',
          dataIndex: 'activityTitle',
        },
        {
          title: '活动链接',
          dataIndex: 'jumpUrl',
          render: (val) => (
            <Popover
              placement="bottom"
              content={
                <div>
                  <QRCode
                    value={`${val}?timestamp=${new Date().getTime()}`} //value参数为生成二维码的链接
                    size={150} //二维码的宽高尺寸
                    fgColor="#000000" //二维码的颜色
                  />
                  <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                    请使用手机扫一扫预览
                  </div>
                </div>
              }
              trigger="click"
            >
              <Button>预览</Button>
            </Popover>
          ),
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
