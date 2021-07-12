import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Space, Form, notification } from 'antd';
import { connect } from 'umi';
import Title from './title';
import BaseForm from './Form/BaseForm';
import ManagementForm from './Form/ManagementForm';
import UserForm from './Form/userForm';
import UserDetailsForm from './Form/userDetailsForm';
import ShopDetailsForm from './Form/shopDetailsForm';
import ActiveSetOneForm from './Form/activeByOneForm';
import CrmGroupSelect, { CrmBtn } from './Form/CrmGroupSelect';
import { TIME_YMD } from '@/common/timeConstant';
import aliOssUpload from '@/utils/aliOssUpload';

const addGroups = (props) => {
  const {
    onClose,
    visible = false,
    dispatch,
    saveVisible,
    groupDetails,
    merchantGroupDTO,
    businessLicense,
    childRef,
    loadingAdd,
    loadingUpDate,
  } = props;

  const [form] = Form.useForm();
  const [formCrm] = Form.useForm();

  const cRef = useRef();
  const cRef1 = useRef();
  const cRef2 = useRef();

  const [formType, setFormType] = useState('add'); // 表单内容 edit add
  const [crmSelect, setCrmSelect] = useState(true); // 是否显示crm 选择集团内容
  const [bottomBtn, setBottom] = useState('add');

  useEffect(() => {
    const { merchantGroupDTO } = groupDetails;
    setFormType(Object.keys(groupDetails).length > 0 ? 'edit' : 'add');
    setCrmSelect(Object.keys(groupDetails).length > 0 ? false : true);
    if (merchantGroupDTO) {
      setBottom('update');
    } else {
      setBottom('add');
    }
  }, [groupDetails]);

  const defauleVale = {
    groupDetails: {},
    merchantGroupDTO: {},
    businessLicense: {},
    initial: {},
    bankBindingInfo: {},
  };

  const closeBtn = (
    <Button onClick={() => saveVisible({ visible: false, ...defauleVale })}>取消</Button>
  );

  const Btn = {
    add: (
      <div style={{ textAlign: 'center' }}>
        <Space>
          {closeBtn}
          <Button
            loading={loadingAdd}
            onClick={() =>
              fetchAddLists(() => {
                saveVisible({ visible: false, ...defauleVale });
                childRef.current.fetchGetData();
              })
            }
          >
            保存
          </Button>
          <Button
            onClick={() =>
              fetchAddLists(() => {
                saveVisible({ visible: false, visible1: true });
                childRef.current.fetchGetData();
              })
            }
            type="primary"
            loading={loadingAdd}
          >
            下一步
          </Button>
        </Space>
      </div>
    ),
    update: (
      <div style={{ textAlign: 'center' }}>
        <Space>
          {closeBtn}
          <Button
            onClick={() =>
              fetchUpdateGroup(() => {
                childRef.current.fetchGetData();
                saveVisible({ visible: false, ...defauleVale });
              })
            }
            loading={loadingUpDate}
            type="primary"
          >
            保存
          </Button>
        </Space>
      </div>
    ),
  }[bottomBtn];

  const panelList = [
    {
      title: '基础信息',
      form: (
        <BaseForm cRef={cRef} formType={formType} form={form} initialValues={merchantGroupDTO} />
      ),
      showArrow: false,
      disabled: true,
    },
    {
      title: '营业执照信息',
      form: (
        <ActiveSetOneForm
          cRef={cRef}
          formType={formType}
          form={form}
          initialValues={merchantGroupDTO}
        />
      ),
      disabled: true,
    },
    {
      title: '品牌信息',
      form: <ManagementForm form={form} cRef={cRef2} initialValues={merchantGroupDTO} />,
    },
    {
      title: '登录信息',
      form: <UserForm cRef={cRef1} form={form} initialValues={merchantGroupDTO} />,
      showArrow: false,
      disabled: true,
    },
    {
      title: '联系人信息',
      form: <UserDetailsForm form={form} initialValues={merchantGroupDTO} />,
      showArrow: false,
      disabled: true,
    },
    {
      title: '店铺信息',
      form: <ShopDetailsForm form={form} initialValues={merchantGroupDTO} />,
      // extra: '(上传后可同步至旗下子店铺)',
    },
  ];

  const fetchAddLists = (callback) => {
    // const roleIds = cRef1.current.getRoleIds()
    form.validateFields().then(async (val) => {
      const payload = cRef.current.fetchAllData();
      const payload1 = cRef2.current.getImage();
      const { lat, lnt } = payload;
      if (!lat && !lnt) {
        return notification.error({
          message: '请点击查询!设置经纬度',
        });
      } else {
        let {
          brandLogo,
          localImages,
          mainImages,
          activeValidity,
          businessLicenseObject,
          ...other
        } = val;
        brandLogo = await aliOssUpload(brandLogo);
        localImages = await aliOssUpload(localImages);
        mainImages = await aliOssUpload(mainImages);
        dispatch({
          type: 'groupSet/fetchAddList',
          payload: {
            ...other,
            ...payload,
            ...payload1,
            businessLicenseObject: {
              ...businessLicenseObject,
              validityPeriod: TIME_YMD(activeValidity[0]),
              establishDate: TIME_YMD(activeValidity[1]),
            },
            localImages: localImages.toString(),
            mainImages: mainImages.toString(),
          },
          callback: () => callback(),
        });
      }
    });
  };

  const fetchUpdateGroup = (callback) => {
    form.validateFields().then(async (val) => {
      const payload = cRef.current.fetchAllData();
      const payload1 = cRef2.current.getImage();
      let {
        brandLogo,
        localImages,
        mainImages,
        activeValidity,
        businessLicenseObject,
        ...other
      } = val;
      brandLogo = await aliOssUpload(brandLogo);
      localImages = await aliOssUpload(localImages);
      mainImages = await aliOssUpload(mainImages);
      dispatch({
        type: 'groupSet/fetchUpdateGroup',
        payload: {
          ...groupDetails.merchantGroupDTO,
          ...other,
          ...payload,
          ...payload1,
          businessLicenseObject: {
            ...businessLicenseObject,
            validityPeriod: TIME_YMD(activeValidity[0]),
            establishDate: TIME_YMD(activeValidity[1]),
          },
          localImages: localImages.toString(),
          mainImages: mainImages.toString(),
        },
        callback: () => callback(),
      });
    });
  };

  // 认领或创建店铺前往新增
  const handleCrmAddGroup = (merchantGroupDTO) => {
    dispatch({
      type: 'groupSet/save',
      payload: {
        merchantGroupDTO,
      },
    });
    setBottom('add');
    setCrmSelect(false);
  };

  return (
    <>
      <Drawer
        title={formType == 'edit' ? '修改集团信息' : `新增集团`}
        width={850}
        visible={visible}
        destroyOnClose={true}
        onClose={onClose}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          {
            true: <CrmBtn form={formCrm}>{closeBtn}</CrmBtn>, // 认领搜索
            false: Btn, // 原编辑
          }[crmSelect]
        }
      >
        {crmSelect ? (
          <CrmGroupSelect form={formCrm} goSet={handleCrmAddGroup} />
        ) : (
          <Title panelList={panelList}></Title>
        )}
      </Drawer>
    </>
  );
};

export default connect(({ sysTradeList, groupSet, loading }) => ({
  ...sysTradeList,
  ...groupSet,
  loading: loading.effects['circleMaster/fetchMasterTotal'],
  loadingAdd: loading.effects['groupSet/fetchAddList'],
  loadingUpDate: loading.effects['groupSet/fetchUpdateGroup'],
}))(addGroups);
