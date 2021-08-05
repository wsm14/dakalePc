import React from 'react';
import { connect } from 'umi';
import { BUSINESS_TYPE, SHARE_TIME_TYPE, SHARE_STATUS, SHARE_SEX_TYPE } from '@/common/constant';
import { couponsDom, goodsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const ShareDetail = (props) => {
  const { visible, total, getDetail, onClose, loadingDetail } = props;

  const { type = 'img', index, show = false, detail = {} } = visible;

  // 信息
  const formItems = [
    {
      label: '店铺类型',
      name: 'userType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: '店铺名称',
      name: 'merchantName',
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
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      label: '免费券',
      name: 'free',
      render: (val) => val !== '' && couponsDom(val),
    },
    {
      label: '推荐带货',
      name: 'promotionType',
      render: (val, row) =>
        ({ reduce: couponsDom(row.contact, '', '', 'valuable'), special: goodsDom(row.contact) }[
          val
        ]),
    },
    {
      label: '性别',
      name: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '年龄',
      name: 'age',
      render: (val) => (val === '0-100' ? '不限' : val),
    },
    {
      label: '地域',
      name: 'area',
    },
    {
      label: '兴趣',
      name: 'tags',
    },
    {
      label: '发布状态',
      name: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      label: '卡豆打赏',
      name: 'aaa',
      children: (
        <div>
          <div>目标曝光量：{detail.beanPersonAmount || 0}</div>
          <div>
            单次曝光打赏：{Math.round(detail.beanAmount + (detail.exposureBeanAmount || 0))}
          </div>
          <div>投放时长：{SHARE_TIME_TYPE[detail.rewardCycle]}</div>
          {detail.rewardCycle !== '0' && (
            <div>投放时间：{`${detail.rewardStartTime} ~ ${detail.rewardEndTime}`}</div>
          )}
        </div>
      ),
    },
    // {
    //   label: '平台补贴打赏奖励',
    //   name: 'bbb',
    //   children: (
    //     <div>
    //       <div>预计补贴人数：{detail.beanPersonAmount || 0}</div>
    //       <div>单用户补贴卡豆数：{detail.exposureBeanAmount || 0}</div>
    //     </div>
    //   ),
    // },
    {
      label: '微信好友分享图',
      name: 'shareImg',
      type: 'upload',
    },
  ];

  const modalProps = {
    title: '分享详情',
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
  loadingDetail: loading.effects['shareManage/fetchShareDetail'],
}))(ShareDetail);
