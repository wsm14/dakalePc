import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Space, Tag, Spin } from 'antd';
import FormCondition from '@/components/FormCondition';

export const CrmBtn = connect(({ loading }) => ({
  loading: loading.effects['groupSet/fetchCrmGrounpList'],
}))(({ dispatch, form, children, goSet, loading }) => {
  // 搜索店铺列表
  const fetchCrmGrounpList = () => {
    form.validateFields().then((val) => {
      const { dcode, ...other } = val;
      const [provinceCode, cityCode, districtCode] = dcode;
      dispatch({
        type: 'groupSet/fetchCrmGrounpList',
        payload: {
          provinceCode,
          cityCode,
          districtCode,
          ...other,
        },
      });
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Space>
        {children}
        <Button loading={loading} onClick={fetchCrmGrounpList} type="primary">
          搜索
        </Button>
      </Space>
    </div>
  );
});

const CrmGroupSelect = ({ dispatch, crmList, goSet, loading, form }) => {
  const [cityName, setCityName] = useState(); // 城市名称

  useEffect(() => {
    dispatch({
      type: 'groupSet/clearDetail',
    });
  }, []);

  const formItems = [
    {
      label: '所在地区',
      type: 'cascader',
      name: 'dcode',
      onChange: (val, option) => setCityName(option),
    },
    {
      label: '集团名称',
      name: 'groupNameOrId',
      addonAfter: (
        <a
          onClick={() => {
            form.validateFields().then((val) => {
              const { dcode, groupNameOrId } = val;
              goSet({ allCode: dcode, cityName, groupName: groupNameOrId });
            });
          }}
        >
          创建店铺
        </a>
      ),
    },
  ];

  return (
    <>
      <FormCondition formItems={formItems} form={form} />
      <div style={{ padding: '0 50px 0 200px', minHeight: 200 }}>
        {loading ? (
          <Spin></Spin>
        ) : (
          crmList.map((item) => (
            <div
              key={item.merchantGroupId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 24,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                padding: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <Tag color="volcano">
                  {item.topCategoryName}/{item.categoryName}
                </Tag>
                {item.groupName}{' '}
                <text style={{ fontSize: 13, color: '#a2a2a2' }}>{item.merchantGroupId}</text>
                <div style={{ fontSize: 13, color: '#a2a2a2', marginTop: 5 }}>{item.address}</div>
              </div>
              <Button
                type="primary"
                onClick={() => {
                  const {
                    provinceCode,
                    cityCode,
                    districtCode,
                    topCategoryIdStr,
                    categoryIdStr,
                    categoryName,
                    categoryNode,
                    topCategoryName,
                    merchantGroupId,
                  } = item;
                  goSet({
                    ...item,
                    sellMerchantGroupId: merchantGroupId,
                    cityName,
                    topCategSelect: [topCategoryIdStr, categoryIdStr],
                    categoryObj: {
                      topCategoryIdStr,
                      categoryIdStr,
                      categoryName,
                      categoryNode,
                      topCategoryName,
                    },
                    handle: 'crm',
                    allCode: [provinceCode, cityCode, districtCode],
                  });
                }}
              >
                认领
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default connect(({ groupSet, loading }) => ({
  crmList: groupSet.crmList,
  loading: loading.effects['groupSet/fetchCrmGrounpList'],
}))(CrmGroupSelect);
