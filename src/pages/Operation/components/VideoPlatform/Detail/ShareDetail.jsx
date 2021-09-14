import React from 'react';
import { connect } from 'umi';
import {
  NEW_SHARE_OWNER,
  NEW_SHARETIME_TYPE,
  NEW_SHARE_STATUS,
  SHARE_SEX_TYPE,
} from '@/common/constant';
import { couponsDom, goodsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const ShareDetail = (props) => {
  const { visible, total, getDetail, onClose, loadingDetail } = props;

  const { index, show = false, detail = {} } = visible;

  // 信息
  const formItems = [
    {
      label: '视频类型',
      name: 'ownerType',
      render: (val) => NEW_SHARE_OWNER[val],
    },
    {
      label: `${NEW_SHARE_OWNER[detail.ownerType]}名称`,
      name: 'ownerName',
    },
    {
      label: `视频`,
      name: ['videoContent', 'url'],
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
      label: `收藏数`,
      name: 'collectionAmount',
    },
    {
      label: `分享数`,
      name: 'shareAmount',
    },
    {
      label: '行业分类',
      name: 'topCategoryName',
      show: detail.ownerType !== 'user',
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
      label: '性别',
      name: 'gender',
      show: detail.ownerType !== 'user',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '年龄',
      name: 'age',
      show: detail.ownerType !== 'user',
      render: (val) => (val === '0-100' ? '不限' : val),
    },
    {
      label: '兴趣',
      name: 'tags',
      show: detail.ownerType !== 'user',
    },
    {
      label: '发布状态',
      name: 'status',
      render: (val) => NEW_SHARE_STATUS[val],
      show: detail.ownerType !== 'user',
    },
    // {
    //   label: '卡豆打赏',
    //   name: 'aaa',
    //   render: () => (
    //     <div>
    //       <div>目标曝光量：{detail.tippingCount || 0}</div>
    //       <div>单次曝光打赏：{Math.round(detail.tippingBean || 0)}</div>
    //       <div>投放时长：{NEW_SHARETIME_TYPE[detail.tippingTimeType]}</div>
    //       {detail.tippingTimeType !== '0' && (
    //         <div>投放时间：{`${detail.beginDate} ~ ${detail.endDate}`}</div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      label: '微信好友分享图',
      name: 'friendShareImg',
      type: 'upload',
    },
  ];

  const modalProps = {
    title: '视频详情',
    visible: show,
    onClose,
    loading: loadingDetail,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'video'),
    },
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingDetail: loading.effects['videoPlatform/fetchShareDetail'],
}))(ShareDetail);
