import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { SERVICE_TYPE, DIVISION_TEMPLATE_TYPE, COMMISSION_TYPE } from '@/common/constant';
import { NUM_ALL } from '@/common/regExp';
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
    handleRate();
    if (show && type === 'edit') {
      setCommissType(detail.divisionTemplateType);
    } else {
      setCommissType(false);
    }
  }, [show]);

  //哒人分佣显示达人最高等级（当前为四星豆长，根据配置）的直推和团队收益之和
  const handleRate = () => {
    dispatch({
      type: 'expertAllocation/fetchGetList',
      callback: (list) => {
        const configUserLevelList = list[list.length - 1].configUserLevelList;
        const data = configUserLevelList[configUserLevelList.length - 1];
        form.setFieldsValue({
          differenceDivisionObjects: {
            daren: Number(data.shareCommission) + Number(data.teamCommission),
          },
        });
      },
    });
  };

  //平台分佣比例自动计算。
  // 计算公式：100%-省代分佣比例-地级市分佣比例-区县分佣比例-用户家主分佣比例-店铺家主分佣比例-哒人最高分佣比例
  const handleChange = () => {
    const values = form.getFieldsValue();
    const { differenceDivisionObjects = {} } = values;
    const {
      province = 0,
      city = 0,
      district = 0,
      userParent = 0,
      merchantParent = 0,
      daren = 0,
    } = differenceDivisionObjects;
    const total =
      Number(province) +
      Number(city) +
      Number(district) +
      Number(userParent) +
      Number(merchantParent) +
      Number(daren);
    form.setFieldsValue({
      differenceDivisionObjects: {
        platform: (100 - total).toFixed(2),
      },
    });
  };

  const formItems = [
    {
      label: '关联行业',
      name: 'categoryIds',
      type: 'select',
      mode: 'multiple',
      select: tradeList,
      disabled: type === 'edit',
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
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      onChange: (e) => handleChange(),
    },
    {
      label: '地级市分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'city'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      onChange: (e) => handleChange(),
    },
    {
      label: '区县分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'district'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      onChange: (e) => handleChange(),
    },
    {
      label: '用户家主分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'userParent'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      onChange: (e) => handleChange(),
    },
    {
      label: '店铺家主分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'merchantParent'],
      addonAfter: '%',
      visible: commissType === 'difference',
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      onChange: (e) => handleChange(),
    },
    // {
    //   label: '哒人分佣比例', // 手动分佣需要展示
    //   name: ['differenceDivisionObjects', 'daren'],
    //   addonAfter: '%',
    //   visible: commissType === 'difference',
    //   disabled: true,
    //   addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
    // },
    {
      label: '平台分佣比例', // 手动分佣需要展示
      name: ['differenceDivisionObjects', 'platform'],
      addonAfter: '%',
      visible: commissType === 'difference',
      disabled: true,
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
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
