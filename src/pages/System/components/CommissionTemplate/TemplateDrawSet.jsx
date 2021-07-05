import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { SERVICE_TYPE, DIVISION_TEMPLATE_TYPE, COMMISSION_TYPE } from '@/common/constant';
import { NUM_PERCENTAGE } from '@/common/regExp';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TemplateDrawSet = (props) => {
  const { visible, onClose, tabKey, tradeList, dispatch, cRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  detail.serviceType = tabKey;

  const [commissType, setCommissType] = useState(false);
  const { divisionTemplateId } = detail;

  const [form] = Form.useForm();
  useEffect(() => {
    if (show && type === 'edit') {
      setCommissType(detail.divisionTemplateType);
    } else {
      setCommissType(false);
    }
  }, [show]);

  const formItems = [
    {
      label: '关联行业',
      name: 'categoryIds',
      type: 'tags',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
    },
    {
      label: '类别',
      name: 'serviceType',
      type: 'select',
      select: SERVICE_TYPE,
      disabled: true,
    },
    {
      label: '分佣方式',
      name: 'divisionTemplateType',
      type: 'radio',
      disabled: type === 'edit',
      select: DIVISION_TEMPLATE_TYPE,
      onChange: (e) => {
        setCommissType(e.target.value);
      },
    },
    {
      label: '省代分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'province'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_PERCENTAGE, message: '输入格式不正确' }],
    },
    {
      label: '区县分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'district'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_PERCENTAGE, message: '输入格式不正确' }],
    },
    {
      label: '用户家主分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'userParent'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_PERCENTAGE, message: '输入格式不正确' }],
    },
    {
      label: '店铺家主分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'merchantParent'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_PERCENTAGE, message: '输入格式不正确' }],
    },
    {
      label: '哒人分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'daren'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_PERCENTAGE, message: '输入格式不正确' }],
    },
    {
      type: 'checkbox',
      name: 'manualDivisionObjects',
      select: COMMISSION_TYPE,
      visible: commissType === 'manual',
      wrapperCol: { offset: 6 },
    },
    {
      label: '上传凭证',
      name: 'certificate',
      type: 'upload',
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      const api = {
        add: 'commissionTemplate/fetchDivisionTemplateAdd',
        edit: 'commissionTemplate/fetchDivisionTemplateUpdate',
      }[type];
      const {
        divisionTemplateType = 'difference', // 分佣类型
        differenceDivisionObjects: dObj = {},
        manualDivisionObjects: mObj = [],
        certificate,
      } = values;
      // 模板类型键值
      const tType = 'divisionParticipantType';
      const objValue = {
        //差价分佣
        difference: Object.keys(dObj).map((key) => ({ [tType]: key, divisionValue: dObj[key] })),
        //手动分佣
        manual: mObj.map((items) => ({ [tType]: items })),
      }[divisionTemplateType];
      aliOssUpload(certificate).then((res) => {
        dispatch({
          type: api,
          payload: {
            divisionTemplateId,
            ...values,
            serviceType: tabKey,
            certificate: res.toString(),
            differenceDivisionObjects: divisionTemplateType === 'difference' ? objValue : null,
            manualDivisionObjects: divisionTemplateType === 'manual' ? objValue : null,
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const modalProps = {
    visible: show,
    title: `分佣模板配置--${SERVICE_TYPE[tabKey]}`,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.models.commissionTemplate,
}))(TemplateDrawSet);
