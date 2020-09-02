import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import { COMMA_TWO_PATTERN, COMMA_SE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';

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
    {
      type: 'textArea',
      label: '商家标签',
      name: 'tag',
      extra: (
        <>
          多个用 英文 “ , ”（逗号） 隔开，最多三个；<br></br>例：人气商家,景观店家,热门商家
        </>
      ),
      rules: [
        { pattern: COMMA_TWO_PATTERN, message: `最多输入三个标签` },
        { pattern: COMMA_SE_PATTERN, message: `请勿以英文 “ , ”开头和结尾` },
      ],
    },
  ];

  const modalProps = {
    title: `设置 - ${record.merchantName}`,
    width: 560,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchFormData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} initialValues={record} form={form} loading={loading} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessAwardSet);
