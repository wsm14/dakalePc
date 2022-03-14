import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import uploadLive from '@/utils/uploadLive';
import DrawerCondition from '@/components/DrawerCondition';
import PointManageSet from './Form/PointManageSet';
import PointManageVideoSet from './Form/PointManageVideoSet';
import PointManageAwardSet from './Form/PointManageAwardSet';

const PointManageDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', show = false, detail = {}, hittingMainId, setBodySelect } = visible;
  const [form] = Form.useForm();
  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { districtCode, distanceFlag, range, ...other } = values;
      dispatch({
        type: {
          add: 'pointManage/fetchSaveHittingMain',
          edit: 'pointManage/fetchUpdateHittingMain',
        }[type],
        payload: {
          hittingMainId,
          ...other,
          provinceCode: districtCode.slice(0, 2),
          cityCode: districtCode.slice(0, 4),
          districtCode,
          distanceFlag,
          range: distanceFlag === '0' ? '999999999' : range,
        },
        callback: (content) => {
          setBodySelect && setBodySelect([{ ...values, hittingMainId: content.hittingMainId }]);
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 设置首刷视频
  const handleAdvertUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { url, videoId, length } = values;
      uploadLive({
        data: videoId ? videoId : url,
        title: Math.random() * 1000,
        callback: (videos) => {
          dispatch({
            type: 'pointManage/fetchSetStrapContent',
            payload: {
              videoId: videos,
              hittingMainId,
              length: String(length),
            },
            callback: () => {
              onClose();
              childRef.current.fetchGetData();
            },
          });
        },
      });
    });
  };

  // 设置奖励
  const handleAwardUpAudit = () => {
    form.validateFields().then(async (values) => {
      const {
        beanPoolList,
        beanPoolRange,
        dayCount,
        remain,
        timeRangeStart,
        timeRangeEnd,
        total,
        specialTime,
        // 以上是卡豆奖励配置
        goodsObject = [],
        hittingRewardRightGoodsObject, // 平台权益商品
        hittingRewardOnlineGoodsObject, // 电商品
        hittingRewardActualGoodsObject, // 自提商品
        // 以上是奖品配置及关联视频
      } = values;

      let data = {
        hittingMainId,
        hittingRewardObject: {
          beanPoolList,
          beanPoolRange,
          dayCount,
          remain: dayCount,
          timeRange: specialTime === 'all' ? undefined : `${timeRangeStart}-${timeRangeEnd}`,
          total,
        },
      };
      if (goodsObject.includes('hittingRewardRightGoodsObject')) {
        data = {
          ...data,
          hittingRewardRightGoodsObject: {
            ...hittingRewardRightGoodsObject,
            // 筛去权益商品数据对象
            subRewardList: hittingRewardRightGoodsObject.subRewardList.map(
              ({ activityGoodsDTO, total, rewardIdString, ...other }) => ({
                ...other,
                rewardId: rewardIdString,
                shardingKey: Number(activityGoodsDTO.ownerIdString),
                total,
                weight: total,
                acquireType: 'manual',
              }),
            ),
          },
        };
      }
      if (goodsObject.includes('hittingRewardOnlineGoodsObject')) {
        data = {
          ...data,
          hittingRewardOnlineGoodsObject: {
            ...hittingRewardOnlineGoodsObject,
            subRewardList: hittingRewardOnlineGoodsObject.subRewardList.map(
              ({ total, ...other }) => ({ ...other, total, weight: total, acquireType: 'manual' }),
            ),
          },
        };
      }
      if (goodsObject.includes('hittingRewardActualGoodsObject')) {
        data = {
          ...data,
          hittingRewardActualGoodsObject: {
            ...hittingRewardActualGoodsObject,
            subRewardList: hittingRewardActualGoodsObject.subRewardList.map(
              ({ total, ...other }) => ({ ...other, total, weight: total, acquireType: 'manual' }),
            ),
          },
        };
      }
      dispatch({
        type: 'pointManage/fetchSetHittingReward',
        payload: data,
        callback: onClose,
      });
    });
  };

  const listProp = {
    type,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '主体详情',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    add: {
      title: '新建主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    edit: {
      title: '编辑主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    advert: {
      title: '打卡广告设置',
      children: <PointManageVideoSet form={form} initialValues={detail}></PointManageVideoSet>,
    },
    award: {
      title: '打卡奖励设置',
      children: (
        <PointManageAwardSet
          form={form}
          initialValues={{ specialTime: 'all', ...detail }}
        ></PointManageAwardSet>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    width: 780,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) ? (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ) : ['advert'].includes(type) ? (
      <Button onClick={handleAdvertUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ) : ['award'].includes(type) ? (
      <Button onClick={handleAwardUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ) : null,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['pointManage/fetchSaveHittingMain'] ||
    loading.effects['pointManage/fetchUpdateHittingMain'],
  loadingDetail:
    loading.effects['pointManage/fetchGetHittingMainById'] ||
    loading.effects['pointManage/fetchGetStrapContent'],
}))(PointManageDrawer);
