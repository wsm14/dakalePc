import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs, Alert, Button, Form, Modal, notification } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import ExtraButton from '@/components/ExtraButton';
import AddDetail from './AddForm/index';
import AccountForm from './AccountForm/CorporateAccount';
import DrawerCondition from '@/components/DrawerCondition';

const CityCompanySet = (props) => {
  const {
    dispatch,
    cRef,
    visible = {},
    detail = {},
    setVisibleSet,
    setVisibleAct,
    loading,
    loadingDetail,
    cityId,
  } = props;

  const { type = 'edit', show = false } = visible;

  const [form] = Form.useForm();
  const [Addform] = Form.useForm();
  const [tabKey, setTabKey] = useState('1');

  // 提交数据
  const handleUpData = (next) => {
    (type == 'add' ? Addform : form).validateFields().then((values) => {
      const { agentCityCode, password, contactMobile, entryDate, allCityCode, allCityName, lat } =
        values;
      if (!lat) {
        notification.info({
          message: '温馨提示',
          description: '请查询地址获取经纬度信息',
        });
        return;
      }
      dispatch({
        type: { add: 'cityCompany/fetchCityAdd', edit: 'cityCompany/fetchCityEdit' }[type],
        payload: {
          ...values,
          cityId,
          agentCityCode: agentCityCode[1],
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
          if (next == 'next') {
            setVisibleAct({ type: 'add', show: true });
          }
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
          type: 'cityCompany/fetchCityEdit',
          payload: {
            cityId: detail.cityId,
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

  const closeDrawer = () => setVisibleSet(false);

  const btnList = [
    {
      auth: 'relieve',
      show: detail.status != 2,
      text: '解约',
      loading,
      onClick: () => fetchProvEdit(2),
    },
    {
      auth: 'status',
      show: detail.status == 0 || detail.status == 1,
      text: detail.status == 0 ? '冻结' : '启用',
      loading,
      onClick: () => fetchProvEdit(1 ^ Number(detail.status)),
    },
    {
      auth: 'edit',
      show: detail.status != 2,
      text: '编辑',
      loading,
      onClick: () => setVisibleSet({ ...visible, type: 'edit' }),
    },
  ];

  const modalProps = {
    title: `${{ add: '新增省公司', edit: '编辑信息', detail: '省公司详情' }[type]}`,
    visible: show,
    maskClosable: false,
    loading: loadingDetail,
    onClose: type === 'edit' ? () => setVisibleSet({ ...visible, type: 'detail' }) : closeDrawer,
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
        <>
          <Button onClick={handleUpData} type="primary" loading={loading}>
            保存
          </Button>
        </>
      ),
      detail: (
        <>
          {tabKey == '1' && <ExtraButton list={btnList}></ExtraButton>}
          <AuthConsumer auth="edit" show={tabKey == '2' && detail.status != 2}>
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
      <>
        {
          {
            add: <AddDetail form={Addform} type={type}></AddDetail>,
            edit: <AddDetail form={form} type={type} detail={detail}></AddDetail>,
            detail: (
              <Tabs defaultActiveKey="1" onChange={setTabKey}>
                <Tabs.TabPane tab="省公司信息" key="1">
                  <AddDetail type={type} detail={detail}></AddDetail>
                </Tabs.TabPane>
                <Tabs.TabPane tab="账户信息" key="2">
                  {detail.ownerInfo && detail.ownerInfo.bankStatus == 2 && (
                    <Alert message={detail.ownerInfo.bankRejectReason} type="error" />
                  )}
                  <AccountForm type={type} detail={detail}></AccountForm>
                </Tabs.TabPane>
              </Tabs>
            ),
          }[type]
        }
      </>
    </DrawerCondition>
  );
};

export default connect(({ cityCompany, loading }) => ({
  detail: cityCompany.detail,
  cityId: cityCompany.cityId,
  loading:
    loading.effects['cityCompany/fetchCityAdd'] || loading.effects['cityCompany/fetchCityEdit'],
  loadingDetail: loading.effects['cityCompany/fetchCityDetail'],
}))(CityCompanySet);
