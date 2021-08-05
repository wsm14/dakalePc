import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import RateFormList from './RateFormList';

const ReteDrawerSet = (props) => {
  const { visible = {}, onClose, fetchGetRate } = props;
  const { type, show, initialValues = {} } = visible;
  const { userMerchantIdString: ownerId, merchantName, groupId, listPayload } = initialValues;

  console.log(initialValues, 'initialValues');
  // type merchant:'门店' ，group：集团

  const [scan] = Form.useForm();
  const [verification] = Form.useForm();
  const [promotion] = Form.useForm();

  const commonProps = {
    disabled: groupId ? true : false,
    ownerId,
    fetchGetRate,
    listPayload,
  };

  const formContent = [
    {
      title: '扫码付',
      rateType: 'scan',
      form: scan,
      initialValues: initialValues.scanDetail,
      formItems: [
        {
          label: '行业通用费率',
          name: 'scanRate',
          disabled: true,
          rules: [{ required: false }],
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: (
            <RateFormList
              name="scan"
              form={scan}
              rateType="scan"
              {...commonProps}
              scanValues={initialValues.scanDetail}
            ></RateFormList>
          ),
        },
      ],
    },
    {
      title: '核销订单',
      rateType: 'verification',
      form: verification,
      initialValues: initialValues.verificationDetail,
      formItems: [
        {
          label: '行业通用费率',
          name: 'verificationRate',
          disabled: true,
          rules: [{ required: false }],
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: (
            <RateFormList
              rateType="verification"
              {...commonProps}
              verificationValue={initialValues.verificationDetail}
              name="verification"
              form={verification}
            ></RateFormList>
          ),
        },
      ],
    },
    {
      title: '推广费',
      rateType: 'promotion',
      form: promotion,
      initialValues: initialValues.promotionDetail,
      formItems: [
        {
          label: '行业通用费率',
          name: 'promotionRate',
          disabled: true,
          rules: [{ required: false }],
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: (
            <RateFormList
              rateType="promotion"
              name="promotion"
              {...commonProps}
              promotionValue={initialValues.promotionDetail}
              form={promotion}
            ></RateFormList>
          ),
        },
      ],
    },
  ];

  const modalProps = {
    title: `费率设置--${merchantName}`,
    visible: show,
    onClose,
    width: 850,
  };
  return (
    <DrawerCondition {...modalProps}>
      {formContent.map((item) => (
        <div key={item.rateType}>
          <div style={{ fontSize: 16, fontWeight: 'bold', margin: 15 }}>{item.title}</div>
          <FormCondition
            form={item.form}
            formItems={item.formItems}
            initialValues={item.initialValues}
          ></FormCondition>
        </div>
      ))}
    </DrawerCondition>
  );
};

export default connect()(ReteDrawerSet);
