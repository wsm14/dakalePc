import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, Skeleton, Modal, notification } from 'antd';
import AddDetail from './AddForm/index';

const ProvCompanySet = (props) => {
  const { dispatch, cRef, visible = {}, setVisibleSet, loading } = props;

  const { type = 'add', show = false, detail = {} } = visible;

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

  // 修改省公司状态
  const fetchProvEdit = (status) => {
    Modal.confirm({
      title: `确认${{ 0: '启用', 1: '冻结', 2: '解约' }[status]}？`,
      onOk() {
        dispatch({
          type: 'provCompany/fetchProvEdit',
          payload: {
            companyId: detail.companyId,
            status,
          },
          callback: () => {
            closeDrawer();
            cRef.current.fetchGetData();
          },
        });
      },
      onCancel() {},
    });
  };

  const modalProps = {
    title: `${{ add: '新增省公司', edit: '编辑信息', detail: '省公司详情' }[type]}`,
    width: 700,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    setVisibleSet(false);
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
          {
            {
              add: (
                <Space>
                  <Button onClick={closeDrawer}>取消</Button>
                  <Button onClick={handleUpData} type="primary" loading={loading}>
                    保存
                  </Button>
                  <Button onClick={closeDrawer} type="primary" loading={loading}>
                    下一步
                  </Button>
                </Space>
              ),
              edit: (
                <Space>
                  <Button onClick={() => setVisibleSet({ ...visible, type: 'detail' })}>取消</Button>
                  <Button onClick={handleUpData} type="primary" loading={loading}>
                    保存
                  </Button>
                </Space>
              ),
              detail: (
                <Space>
                  <Button onClick={closeDrawer}>关闭</Button>
                  <Button onClick={() => fetchProvEdit(2)} type="primary" loading={loading}>
                    解约
                  </Button>
                  {(detail.status == 0 || detail.status == 1) && (
                    <Button
                      onClick={() => fetchProvEdit(1 ^ Number(detail.status))}
                      type="primary"
                      loading={loading}
                    >
                      {detail.status == 0 ? '冻结' : '启用'}
                    </Button>
                  )}
                  <Button
                    onClick={() => setVisibleSet({ ...visible, type: 'edit' })}
                    type="primary"
                    loading={loading}
                  >
                    编辑
                  </Button>
                </Space>
              ),
            }[type]
          }
        </div>
      }
    >
      <Skeleton loading={skeletonType} active>
        {
          {
            add: <AddDetail form={form} type={type}></AddDetail>,
            edit: <AddDetail form={form} type={type} detail={detail}></AddDetail>,
            detail: <AddDetail form={form} type={type} detail={detail}></AddDetail>,
          }[type]
        }
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['provCompany/fetchProvAdd'] || loading.effects['provCompany/fetchProvEdit'],
}))(ProvCompanySet);
