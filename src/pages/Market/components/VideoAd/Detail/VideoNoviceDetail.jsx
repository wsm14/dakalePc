import React from 'react';
import { VIDEO_TIME_TYPE, VIDEO_NOVICE_STATUS, VIDEO_AREA_TYPE } from '@/common/constant';
import { couponsDom, goodsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import { checkCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const VideoNoviceDetail = (props) => {
  const { detail = {} } = props;

  const formItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: `视频`,
      name: ['videoContentOb', 'url'],
      type: 'videoUpload',
    },
    {
      label: '标题',
      name: 'title',
    },
    {
      label: '内容详情',
      name: 'message',
    },
    {
      label: '行业分类',
      name: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      label: '免费券',
      name: 'free',
      render: (val) => val !== '' && couponsDom(val),
    },
    {
      label: '关联优惠',
      name: 'promotionType',
      render: (val, row) =>
        ({ reduce: couponsDom(row.contact, '', '', 'valuable'), special: goodsDom(row.contact) }[
          val
        ]),
    },
    {
      label: '投放区域',
      name: 'areaType',
      render: (val, row) =>
        ({
          all: VIDEO_AREA_TYPE[val],
          district: checkCityName(row.area),
        }[val]),
    },
    {
      label: '发布状态',
      name: 'status',
      render: (val) => VIDEO_NOVICE_STATUS[val],
    },
    {
      label: '卡豆打赏',
      name: 'aaa',
      children: (
        <div>
          <div>目标曝光量：{detail.beanPersonAmount}</div>
          <div>单次曝光打赏：{detail.beanAmount}</div>
          <div>投放时长：{VIDEO_TIME_TYPE[detail.rewardCycle]}</div>
          {detail.rewardCycle !== '0' && <div>投放时间：{detail.rewardEndTime}</div>}
        </div>
      ),
    },
    {
      label: '微信好友分享图',
      name: 'shareImg',
      type: 'upload',
    },
    {
      label: '创建时间',
      name: 'createTime',
    },
    {
      label: '创建人',
      name: 'creatorName',
    },
    {
      label: '下架时间',
      name: 'offShelfTime',
    },
  ];

  return <DescriptionsCondition initialValues={detail} formItems={formItems} />;
};

export default VideoNoviceDetail;
