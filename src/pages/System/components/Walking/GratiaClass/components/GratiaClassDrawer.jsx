import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { VANE_URL_TYPE } from '@/common/constant';
import { VANE_ICON } from '@/common/imgRatio';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const GratiaClassDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading, tradeList } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  const { configSpecialGoodsCategoryId, version, userOs, area, cityCode } = detail;
  const [form] = Form.useForm();

  const allProps = {
    add: {
      title: '新增',
      api: 'walkingManage/fetchSaveConfigSpecialGoodsCategory',
      flag: 'addConfig',
    },
    edit: {
      title: '修改',
      api: 'walkingManage/fetchUpdateConfigSpecialGoodsCategory',
      flag: 'updateConfig',
    },
  }[type];

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: allProps.api,
        payload: {
          flag: allProps.flag,
          configSpecialGoodsCategoryId,
          userOs,
          version,
          area,
          cityCode,
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 获取行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  const formItems = [
    {
      label: '行业类目',
      name: 'categoryId',
      type: 'select',
      select: tradeList,
      fieldNames: {
        label: 'categoryName',
        value: 'categoryIdString',
      },
      onChange: (val, option) => {
        form.setFieldsValue({
          categoryName: option.option.categoryName,
        });
      },
    },
    {
      label: '显示文案',
      maxLength: 4,
      name: 'showCopy',
    },
    {
      label: '副标题',
      maxLength: 4,
      name: 'subtitle',
    },
    {
      label: '行业名称',
      name: 'categoryName',
      hidden: true,
    },
  ];

  const modalProps = {
    title: allProps.title,
    visible: show,
    zIndex: 1001,
    onClose,
    afterCallBack: () => {
      fetchTradeList();
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading, sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
  loading: loading.models.walkingManage,
}))(GratiaClassDrawer);
