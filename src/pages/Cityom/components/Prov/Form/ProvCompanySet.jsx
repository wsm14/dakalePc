import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, Skeleton, notification } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import AddDetail from './AddFrom/index';

const ProvCompanySet = (props) => {
  const { dispatch, cRef, visible = {}, initialValues = false, onClose, loading } = props;

  const { type = 'add', show = false } = visible;

  const [form] = Form.useForm();
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // 提交数据
  const handleUpData = () => {
    form.validateFields().then((values) => {
      const { password, contactMobile, entryDate, allCityCode, allCityName, lat } = values;
      if (!lat) {
        notification.info({
          message: '温馨提示',
          description: '请查询地址获取经纬度信息',
        });
        return;
      }
      dispatch({
        type: { add: 'provCompany/fetchProvAdd', edit: 'provCompany/fetchProvEdit' }[type],
        payload: {
          ...values,
          provinceCode: allCityCode[0],
          cityCode: allCityCode[1],
          districtCode: allCityCode[2],
          provinceName: allCityName[0],
          cityName: allCityName[1],
          districtName: allCityName[2],
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
        },
      });
    });
  };

  const modalProps = {
    title: `${{ add: '新增省公司', edit: '编辑信息' }[type]}`,
    width: 700,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    onClose();
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
              保存
            </Button>
            <Button onClick={closeDrawer} type="primary" loading={loading}>
              下一步
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType} active>
        <AddDetail form={form}></AddDetail>
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['provCompany/fetchProvAdd'] || loading.effects['provCompany/fetchProvEdit'],
}))(ProvCompanySet);
