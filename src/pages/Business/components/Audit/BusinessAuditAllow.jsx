import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, TimePicker, Switch, Modal } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import FormCondition from '@/components/FormCondition';
// import aliOssUpload from '@/utils/aliOssUpload';
import moment from 'moment';
import styles from '../style.less';

const BusinessAuditAllow = (props) => {
  const {
    dispatch,
    visible,
    onClose,
    loading,
    merchantName,
    categoryId,
    merchantVerifyId,
    initialValues,
    fetchFormData,
  } = props;

  const [form] = Form.useForm();

  const { businessTime } = initialValues;
  const bTimeArr = businessTime.split(',');

  const [serviceLsit, setServiceLsit] = useState(false);
  const [speacialLsit, setSpeacialLsit] = useState(false);
  const [allTime, setAllTime] = useState(businessTime.indexOf('00:00-23:59') > -1 ? true : false);
  const [timeItem, setTimeItem] = useState(
    businessTime ? bTimeArr.map((val, i) => `item${i + 1}`) : ['time1'],
  );
  const [itemNum, setItemNum] = useState(1);
  // 审核时间默认值显示
  const [inValues] = useState(() => {
    const newInVlaues = { ...initialValues };
    const newTimeObj = {};
    bTimeArr.map((val, i) => {
      const timeArr = val.split('-');
      newTimeObj[`item${i + 1}`] = [moment(timeArr[0], 'HH:mm'), moment(timeArr[1], 'HH:mm')];
    });
    newInVlaues.businessTime = businessTime ? newTimeObj : '';
    return newInVlaues;
  });

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        title: '审核通过',
        content: '是否确认审核通过？',
        onOk() {
          const {
            allImages,
            tags,
            businessTime,
            property: { service, speacial },
          } = values;
          // aliOssUpload(allImages).then((res) => {
          const selectTime = values.allTime
            ? '00:00-23:59'
            : timeItem.map(
                (item) =>
                  `${businessTime[item][0].format('HH:mm')}-${businessTime[item][1].format(
                    'HH:mm',
                  )}`,
              );
          const info = {
            merchantVerifyId,
            verifyStatus: 3,
            perCapitaConsumption: values.perCapitaConsumption,
            businessTime: selectTime.toString(),
            // allImages: '',
            tags: tags.toString(),
            property: {
              service: service.toString(),
              speacial: speacial ? speacial.toString() : '',
            },
          };
          fetchFormData(info);
          // });
        },
      });
    });
  };

  // 店铺服务/基础设施
  const fetchGetService = () => {
    dispatch({
      type: 'sysTradeList/fetchDetailList',
      payload: { type: 'base', categoryId: categoryId[0] },
      callback: (val) => setServiceLsit(val),
    });
  };

  // 特色服务
  const fetchGetSpeacial = () => {
    dispatch({
      type: 'sysTradeList/fetchDetailList',
      payload: { type: 'special', categoryId: categoryId[0] },
      callback: (val) => setSpeacialLsit(val),
    });
  };

  // 添加时间选择器
  const handleAddTimePicker = () => {
    setTimeItem([...timeItem, [`item${itemNum}`]]);
    setItemNum(itemNum + 1);
  };

  // 删除时间选择器
  const handleRemoveTimePicker = (key) => {
    form.setFieldsValue({ businessTime: { [key]: undefined } });
    setTimeItem(timeItem.filter((item) => item != key));
  };

  useEffect(() => {
    if (categoryId) {
      fetchGetService();
      fetchGetSpeacial();
    }
  }, [categoryId]);

  const formItems = [
    // {
    //   label: '店铺主图',
    //   name: 'allImages',
    //   type: 'upload',
    //   maxFile: 3,
    // },
    {
      label: '人均消费',
      name: 'perCapitaConsumption',
      type: 'number',
    },
    {
      label: '营业时间',
      type: 'children',
      rules: 'false',
      required: true,
      children: (
        <>
          {timeItem.map((item, i) => (
            <div className={styles.audit_picker_item} key={item}>
              <Form.Item
                name={['businessTime', item]}
                noStyle
                rules={[{ required: !allTime, message: '请选择营业时间' }]}
              >
                <TimePicker.RangePicker
                  disabled={allTime}
                  order={false}
                  style={{ width: i > 0 ? '64%' : '65%' }}
                  format={'HH:mm'}
                />
              </Form.Item>
              {i != timeItem.length - 1 && (
                <MinusCircleOutlined
                  onClick={() => handleRemoveTimePicker(item)}
                  style={{ fontSize: 22, margin: '0 10px' }}
                />
              )}
              {i == timeItem.length - 1 && (
                <>
                  {i != 0 && (
                    <MinusCircleOutlined
                      onClick={() => handleRemoveTimePicker(item)}
                      style={{ fontSize: 22, marginLeft: 10 }}
                    />
                  )}
                  {timeItem.length < 4 && (
                    <PlusCircleOutlined
                      onClick={handleAddTimePicker}
                      style={{ fontSize: 22, margin: '0 10px' }}
                    />
                  )}
                </>
              )}
              {i == 0 && (
                <Form.Item name="allTime" initialValue={allTime} noStyle valuePropName="checked">
                  <Switch
                    checkedChildren="24小时营业"
                    unCheckedChildren="24小时营业"
                    onChange={() => {
                      setAllTime(!allTime);
                    }}
                  />
                </Form.Item>
              )}
            </div>
          ))}
        </>
      ),
      // 临时
      extra: REACT_APP_ENV !== 'prod' && (
        <>
          <span style={{ color: 'red' }}>可以键入 说明：05:00 回车 23:59 回车</span>
        </>
      ),
    },
    {
      label: '店铺服务',
      type: 'checkbox',
      name: ['property', 'service'],
      loading: loading.effects['sysTradeList/fetchDetailList'],
      select: serviceLsit || [],
    },
    {
      label: '特色服务',
      type: 'checkbox',
      name: ['property', 'speacial'],
      rules: [{ required: false }],
      loading: loading.effects['sysTradeList/fetchDetailList'],
      select: speacialLsit || [],
    },
    {
      label: '店铺标签',
      name: 'tags',
      type: 'checkbox',
      select: [
        { label: '人气商家', value: '人气商家' },
        { label: '景观店家', value: '景观店家' },
        { label: '品牌连锁', value: '品牌连锁' },
      ],
    },
  ];

  return (
    <Drawer
      title={`完善商户信息 - ${merchantName}`}
      width={600}
      visible={visible}
      maskClosable={false}
      destroyOnClose={false}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button
              onClick={fetchUpData}
              type="primary"
              loading={
                loading.effects['sysTradeList/fetchDetailList'] || loading.models.businessAudit
              }
            >
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} form={form} initialValues={inValues} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({ loading }))(BusinessAuditAllow);
