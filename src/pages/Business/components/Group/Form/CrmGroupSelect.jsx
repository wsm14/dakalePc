import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Space, Tag, Spin, Empty } from 'antd';
import FormCondition from '@/components/FormCondition';

export const CrmBtn = connect(({ loading }) => ({
  loading: loading.effects['groupSet/fetchCrmGrounpList'],
}))(({ dispatch, form, children, loading }) => {
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
    <div style={{ marginTop: 15, paddingLeft: 155 }}>
      <Space>
        <Button loading={loading} onClick={fetchCrmGrounpList} type="primary">
          搜索
        </Button>
        {children}
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
    },
  ];

  return (
    <>
      <FormCondition formItems={formItems} form={form} />
      <div style={{ padding: '0 50px 0 200px', minHeight: 30 }}>
        {loading ? (
          <Spin></Spin>
        ) : crmList.length ? (
          crmList.map((item) => (
            <div
              key={item.merchantGroupIdString}
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
                <text style={{ fontSize: 13, color: '#a2a2a2' }}>{item.merchantGroupIdString}</text>
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
                    merchantGroupIdString,
                  } = item;
                  goSet({
                    ...item,
                    sellMerchantGroupId: merchantGroupIdString,
                    cityName,
                    topCategSelect: [topCategoryIdStr, categoryIdStr],
                    categoryObj: {
                      topCategoryId: topCategoryIdStr,
                      categoryId: categoryIdStr,
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
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <CrmBtn form={form}>
        <Button
          type="link"
          onClick={() => {
            form.validateFields().then((val) => {
              const { dcode, groupNameOrId } = val;
              goSet({ allCode: dcode, cityName, groupName: groupNameOrId });
            });
          }}
        >
          创建店铺
        </Button>
      </CrmBtn>
    </>
  );
};
export default connect(({ groupSet, loading }) => ({
  crmList: groupSet.crmList,
  loading: loading.effects['groupSet/fetchCrmGrounpList'],
}))(CrmGroupSelect);
