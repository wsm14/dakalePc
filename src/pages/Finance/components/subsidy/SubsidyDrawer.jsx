import React, { useState } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Form, Space, Skeleton, notification } from 'antd';

const SubsidyDrawer = (props) => {
  const { dispatch, cRef, visible = {}, detail = {}, setVisible, loading, loadingDetail } = props;

  const { type = 'add', show = false } = visible;

  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // 提交数据
  const handleUpData = (next) => {
    (type == 'add' ? formAdd : form).validateFields().then((values) => {
      const { password, contactMobile, entryDate, lat } = values;
      if (!lat) {
        notification.info({
          message: '温馨提示',
          description: '请查询地址获取经纬度信息',
        });
        return;
      }
      dispatch({
        type: { add: 'areaCenter/fetchAreaAdd', edit: 'areaCenter/fetchAreaEdit' }[type],
        payload: {
          ...values,
          entryDate: entryDate.format('YYYY-MM-DD'),
          password: password
            ? password
            : type == 'edit'
            ? undefined
            : contactMobile.match(/.*(.{6})/)[1],
        },
        callback: () => {
          closeDrawer();
          cRef.current.fetchGetData();
          if (next == 'next') {
            setVisible({ type: 'add', show: true });
          }
        },
      });
    });
  };

  const modalProps = {
    title: `${{ add: '新增', detail: '详情' }[type]}`,
    width: 650,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    setVisible(false);
  };

  return (
    <Drawer
      {...modalProps}
      onClose={closeDrawer}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          setSkeletonType(false);
        } else {
          setSkeletonType(true);
        }
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={closeDrawer}>取消</Button>
            <Button onClick={handleUpData} type="primary" loading={loading}>
              提交
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType || loadingDetail} active>
        {
          {
            add: '111111',
            detail: '333333',
          }[type]
        }
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ areaCenter, loading }) => ({
  detail: areaCenter.detail,
  loading:
    loading.effects['areaCenter/fetchAreaAdd'] || loading.effects['areaCenter/fetchAreaEdit'],
  loadingDetail: loading.effects['areaCenter/fetchAreaDetail'],
}))(SubsidyDrawer);
