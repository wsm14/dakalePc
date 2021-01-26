import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs, Alert, Button, Form, Modal, notification } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import AddDetail from './AddForm/index';
import AccountForm from './AccountForm/CorporateAccount';
import DrawerCondition from '@/components/DrawerCondition';

const AreaCompanySet = (props) => {
  const {
    dispatch,
    cRef,
    visible = {},
    detail = {},
    setVisibleSet,
    setVisibleAct,
    loading,
    loadingDetail,
    partnerId,
  } = props;

  const { type = 'add', show = false } = visible;

  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

  const [tabKey, setTabKey] = useState('1');

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
          partnerId,
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
            setVisibleAct({ type: 'add', show: true });
          }
        },
      });
    });
  };

  // 修改省公司状态
  const fetchAreaEdit = (status) => {
    Modal.confirm({
      title: `确认${{ 0: '启用', 1: '冻结', 2: '解约' }[status]}？`,
      onOk() {
        dispatch({
          type: 'areaCenter/fetchAreaEdit',
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

  const closeDrawer = () => {
    dispatch({
      type: 'areaCenter/fetchCloseData',
      callback: () => setVisibleSet(false),
    });
  };

  const modalProps = {
    title: `${{ add: '新增', edit: '编辑信息', detail: '公司详情' }[type]}`,
    visible: show,
    maskClosable: false,
    // 编辑信息时 关闭事件为关闭当前修改框回到详情展示
    onClose: type === 'edit' ? () => setVisibleSet({ ...visible, type: 'detail' }) : closeDrawer,
    loading: loadingDetail,
    afterCallBack: () => setTabKey('1'),
    footer: {
      add: (
        <>
          <Button onClick={handleUpData} type="primary" loading={loading}>
            保存
          </Button>
          <Button onClick={() => handleUpData('next')} type="primary" loading={loading}>
            下一步
          </Button>
        </>
      ),
      edit: (
        <Button onClick={handleUpData} type="primary" loading={loading}>
          保存
        </Button>
      ),
      detail: (
        <>
          {tabKey == '1' && (
            <>
              <AuthConsumer auth="relieve" show={detail.partnerStatus != 2}>
                <Button onClick={() => fetchAreaEdit(2)} type="primary" loading={loading}>
                  解约
                </Button>
              </AuthConsumer>
              <AuthConsumer
                auth="status"
                show={detail.partnerStatus == 0 || detail.partnerStatus == 1}
              >
                <Button
                  onClick={() => fetchAreaEdit(1 ^ Number(detail.partnerStatus))}
                  type="primary"
                  loading={loading}
                >
                  {detail.partnerStatus == 0 ? '冻结' : '启用'}
                </Button>
              </AuthConsumer>
              <AuthConsumer auth="edit" show={detail.partnerStatus != 2}>
                <Button
                  onClick={() => setVisibleSet({ ...visible, type: 'edit' })}
                  type="primary"
                  loading={loading}
                >
                  编辑
                </Button>
              </AuthConsumer>
            </>
          )}
          <AuthConsumer auth="edit" show={tabKey == '2' && detail.partnerStatus != 2}>
            <Button
              onClick={() => setVisibleAct({ type: 'edit', show: true })}
              type="primary"
              loading={loading}
            >
              去编辑
            </Button>
          </AuthConsumer>
        </>
      ),
    }[type],
  };

  return (
    <DrawerCondition {...modalProps}>
      {
        {
          add: <AddDetail form={formAdd} type={type}></AddDetail>,
          edit: <AddDetail form={form} type={type}></AddDetail>,
          detail: (
            <Tabs defaultActiveKey="1" onChange={setTabKey}>
              <Tabs.TabPane tab="公司信息" key="1">
                <AddDetail form={form} type={type}></AddDetail>
              </Tabs.TabPane>
              <Tabs.TabPane tab="账户信息" key="2">
                {detail.ownerInfo && detail.ownerInfo.bankStatus == 2 && (
                  <Alert message={detail.ownerInfo.bankRejectReason} type="error" />
                )}
                <AccountForm form={form} type={type}></AccountForm>
              </Tabs.TabPane>
            </Tabs>
          ),
        }[type]
      }
    </DrawerCondition>
  );
};

export default connect(({ areaCenter, loading }) => ({
  detail: areaCenter.detail,
  partnerId: areaCenter.partnerId,
  loading:
    loading.effects['areaCenter/fetchAreaAdd'] || loading.effects['areaCenter/fetchAreaEdit'],
  loadingDetail: loading.effects['areaCenter/fetchAreaDetail'],
}))(AreaCompanySet);
