import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import PointSet from './PointSet';
import PointDetail from './PointDetail';

// 哒小卡点位   新增/编辑

const PointDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail, total, getDetail } = props;

  const { type = 'add', hittingId, show = false, index, detail = {}, setPointSelect } = visible;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { districtCode, ...other } = values;

      dispatch({
        type: {
          add: 'pointManage/fetchSaveHitting',
          edit: 'pointManage/fetchUpdateHitting',
        }[type],
        payload: {
          mainId: detail.mainId || detail.hittingMainId,
          hittingId,
          ...other,
          provinceCode: districtCode.slice(0, 2),
          cityCode: districtCode.slice(0, 4),
          districtCode,
        },
        callback: (content) => {
          if (setPointSelect && type === 'add') {
            const data = {
              name: values.name,
              otherData: values.address,
              dayCount: values.dayCount,
              value: content?.hittingId,
            };
            setPointSelect([data]);
          }

          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '点位详情',
      children: <PointDetail initialValues={detail}></PointDetail>,
    },
    add: {
      title: '新增点位',
      children: <PointSet form={form} detail={detail}></PointSet>,
    },
    edit: {
      title: '编辑点位',
      children: (
        <PointSet
          form={form}
          initialValues={{ ...detail, dayCount: detail.dayCount + '' }}
        ></PointSet>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    dataPage: type === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['pointManage/fetchSaveHitting'] ||
    loading.effects['pointManage/fetchUpdateHitting'],
  loadingDetail: loading.effects['pointManage/fetchGetHittingById'],
}))(PointDrawer);
