import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import uploadLive from '@/utils/uploadLive';
import DrawerCondition from '@/components/DrawerCondition';
import PointManageSet from './Form/PlatformSet';
import PlatformVideoSet from './Form/PlatformVideoSet';
import PlatformAwardSet from './Form/PlatformAwardSet';

const PointManageDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', show = false, detail = {} } = visible;
  const { hittingMainId } = detail;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values);
      // return;
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
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 设置首刷视频
  const handleAdvertUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { url, videoId } = values;
      uploadLive({
        data: videoId ? videoId : url,
        title: Math.random() * 1000,
        callback: (videos) => {
          dispatch({
            type: 'pointManage/fetchSetStrapContent',
            payload: {
              videoId: videos,
              hittingMainId,
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
      console.log('award', values);
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
      children: <PlatformVideoSet form={form} initialValues={detail}></PlatformVideoSet>,
    },
    award: {
      title: '打卡奖励设置',
      children: <PlatformAwardSet form={form} initialValues={detail}></PlatformAwardSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
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
