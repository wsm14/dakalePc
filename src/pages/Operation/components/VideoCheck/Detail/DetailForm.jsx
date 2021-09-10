import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { BUSINESS_TYPE, SEX_NEW_TYPE } from '@/common/constant';

const DetailForm = (props) => {
  const { detail = {}, form, tabkey, merchantList } = props;

  const ActiveformItems = [
    {
      name: 'ownerType',
      label: '店铺类型',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      name: 'ownerName',
      label: '店铺名称',
    },
  ];

  const formItems = [
    {
      name: 'frontImage',
      label: '视频',
      type: 'videoUpload',
    },
    {
      name: 'title',
      label: '标题',
    },
    {
      name: 'videoContent',
      label: '内容详情',
    },
    {
      name: 'ownerName',
      label: '收藏数',
    },
    {
      name: 'ownerName',
      label: '分享数',
    },
    {
      name: 'categoryName',
      label: '行业分类',
      render: (val, row) => `${row.topCategoryName}-${val}`,
    },
    {
      name: 'ownerName',
      label: '推荐带货',
    },
    {
      name: 'gender',
      label: '性别',
      render: (val) => SEX_NEW_TYPE[val],
    },
    {
      name: 'age',
      label: '年龄',
    },
    {
      name: 'ownerName',
      label: '兴趣',
    },
    {
      name: 'ownerName',
      label: '发布状态',
    },
    {
      name: 'ownerName',
      label: '卡豆打赏',
    },
  ];

  return (
    <>
      <DescriptionsCondition
        formItems={ActiveformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {ownerType === 'group' && (
        <div style={{ margin: '10px' }}>
          <MerchantListTable merchantList={merchantList || []}></MerchantListTable>
        </div>
      )}
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </>
  );
};
export default DetailForm;
