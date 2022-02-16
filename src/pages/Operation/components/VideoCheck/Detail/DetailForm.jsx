import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { couponsDom, goodsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import { SHARE_SEX_TYPE, NEW_SHARE_STATUS, SHARE_AREA_TYPE, VIDEO_TYPE } from '@/common/constant';

const DetailForm = (props) => {
  const { detail = {} } = props;

  const formItems = [
    {
      name: 'ownerType',
      label: '类型',
      render: (val) => VIDEO_TYPE[val],
    },
    {
      name: 'ownerName',
      label: `${VIDEO_TYPE[detail.ownerType]}名称`,
    },
    {
      name: ['videoContent', 'url'],
      label: '视频',
      type: 'videoUpload',
    },
    // {
    //   name: 'title',
    //   label: '标题',
    // },
    {
      name: 'message',
      label: '内容详情',
    },
    {
      label: `收藏数`,
      name: 'collectionAmount',
      render: (val) => (val ? val : '-'),
    },
    {
      label: `分享数`,
      name: 'shareAmount',
      render: (val) => (val ? val : '-'),
    },
    {
      label: '行业分类',
      name: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      label: '推荐带货',
      name: 'promotionList',
      render: (val, row) =>
        val.map((item) =>
          item.type === 'special' ? goodsDom(item) : couponsDom(item, '', '', item.type),
        ),
    },
    {
      name: 'gender',
      label: '性别',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '年龄',
      name: 'age',
      render: (val) => (val === '0-100' ? '不限' : val),
    },
    {
      label: '地域',
      name: 'areaType',
      show: detail.ownerType !== 'user',
      render: (val, row) =>
        `${SHARE_AREA_TYPE[val]}\n${
          {
            all: '',
            city: row?.area,
            district: row?.area,
            near: `${row.beanAddress || '--'}\n附近${row.area || 0}米`,
          }[val]
        }`,
    },
    {
      name: 'tags',
      label: '兴趣',
      render: (val) => (val ? val : '-'),
    },
    {
      label: '发布状态',
      name: 'status',
      render: (val) => (val && val !== '-1' ? NEW_SHARE_STATUS[val] : '-'),
    },
    {
      label: '发布时间',
      name: 'publishTime',
      render: (val, row) => (row.publishType == 'fixed' ? `${val}` : '立即发布'),
    },
  ];

  return (
    <>
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </>
  );
};
export default DetailForm;
