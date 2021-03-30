import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const BusinessAwardSet = (props) => {
  const {
    dispatch,
    cRef,
    visible: { show: visible = false, record = {} },
    onClose,
    loading,
  } = props;

  const [form] = Form.useForm();
  const [inputShow, setInputShow] = useState({ arrive: true, share: true });

  useEffect(() => {
    setInputShow({ arrive: !!Number(record.markSetFlag), share: !!Number(record.momentSetFlag) });
  }, [visible]);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'businessList/fetchMerchantSet',
        payload: {
          merchantId: record.userMerchantIdString,
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '到店打卡卡豆',
      name: 'markSetFlag',
      type: 'radio',
      select: ['平台固定', '商家自定义'],
      onChange: (e) => setInputShow({ ...inputShow, arrive: e.target.value === '1' }),
    },
    {
      label: '平台固定卡豆数',
      name: 'markBean',
      type: 'number',
      disabled: inputShow.arrive,
      visible: !inputShow.arrive,
      rules: [{ required: !inputShow.arrive, message: `请确认平台固定卡豆数` }],
    },
    {
      label: '图文视频分享',
      name: 'momentSetFlag',
      type: 'radio',
      select: ['平台固定', '商家自定义'],
      onChange: (e) => setInputShow({ ...inputShow, share: e.target.value === '1' }),
    },
    {
      label: '平台固定卡豆数',
      name: 'momentSetBean',
      type: 'number',
      disabled: inputShow.share,
      visible: !inputShow.share,
      rules: [{ required: !inputShow.share, message: `请确认平台固定卡豆数` }],
    },
  ];

  const modalProps = {
    title: `设置 - ${record.merchantName}`,
    width: 560,
    visible,
    onClose,
    footer: (
      <Button onClick={fetchFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} initialValues={record} form={form} loading={loading} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessAwardSet);
