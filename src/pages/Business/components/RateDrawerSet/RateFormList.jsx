import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Space, DatePicker } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const RateFormList = (props) => {
  const {
    dispatch,
    loading,
    name = 'scan',
    form,
    scanValues = {},
    verificationValue = {},
    promotionValue = {},
    rateType,
    fetchGetRate,
    disabled,
    ownerId,
    listPayload,
  } = props;
  const [isEdit, setIsEdit] = useState({});

  // 子门店不可编辑
  useEffect(() => {
    setIsEdit(disabled);
  }, [disabled]);

  const scanArr = scanValues.scan ? scanValues.scan : [];
  const verArr = verificationValue.verification ? verificationValue.verification : [];
  const proArr = promotionValue.promotion ? promotionValue.promotion : [];

  const checkArr = { scan: scanArr, verification: verArr, promotion: proArr }[rateType];
  const checkEditType = (index) => (checkArr[index]?.rate ? !isEdit[index] : false);

  const getDispatch = (url, payload, index, type) => {
    dispatch({
      type: url,
      payload: payload,
      callback: () => {
        fetchGetRate(listPayload); // 获取详情
        setIsEdit({ ...isEdit, [index]: type === 'edit' });
      },
    });
  };

  //编辑 || 保存
  const handleSave = (index, type) => {
    if (type === 'edit') {
      setIsEdit({ ...isEdit, [index]: type === 'edit' });
    }
    form.validateFields().then((values) => {
      const { scan, verification, promotion } = values;

      let beginDate = '';
      let endDate = '';
      let rate = '';
      let ownerManualId = '';

      switch (rateType) {
        case 'scan':
          ownerManualId = type === 'edit' ? scanValues.scan[index].ownerManualId : ''; //详情index对应 的id | 编辑
          beginDate = scan[index].time[0].format('YYYY-MM-DD'); //新增|编辑参数
          endDate = scan[index].time[1].format('YYYY-MM-DD');
          rate = scan[index].rate;
          break;
        case 'verification':
          ownerManualId =
            type === 'edit' ? verificationValue.verification[index].ownerManualId : '';
          beginDate = verification[index].time[0].format('YYYY-MM-DD');
          endDate = verification[index].time[1].format('YYYY-MM-DD');
          rate = verification[index].rate;
          break;
        case 'promotion':
          ownerManualId = type === 'edit' ? promotionValue.promotion[index].ownerManualId : '';
          beginDate = promotion[index].time[0].format('YYYY-MM-DD');
          endDate = promotion[index].time[1].format('YYYY-MM-DD');
          rate = promotion[index].rate;
          break;
      }

      const apiUrl = {
        save: 'businessList/fetchsetManualRate',
        edit: 'businessList/fetchUpdateManualRate',
      }[type];
      const payload = {
        save: {
          ownerId,
          ownerType: listPayload.type,
          rateType,
          rate,
          beginDate,
          endDate,
        },
        edit: {
          ownerManualId,
          beginDate,
          endDate,
          rate,
        },
      }[type];

      if (type === 'edit') {
        //编辑时请求update接口
        if (!checkEditType(index)) {
          getDispatch(apiUrl, payload, index, type);
        }
      } else {
        getDispatch(apiUrl, payload, index, type);
      }
    });
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'day');
  };

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }, index) => (
            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'time']}
                fieldKey={[fieldKey, 'time']}
                rules={[{ required: true, message: '请选择时间范围' }]}
              >
                <RangePicker
                  ranges={{
                    '3个月': [moment(), moment().add(3, 'month')],
                    '6个月': [moment(), moment().add(6, 'month')],
                    '1年': [moment(), moment().add(1, 'year')],
                    '2年': [moment(), moment().add(2, 'year')],
                    永久: [moment(), moment('2999-12-31', 'YYYY-MM-DD')],
                  }}
                  disabledDate={disabledDate}
                  disabled={checkEditType(index)}
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'rate']}
                fieldKey={[fieldKey, 'rate']}
                rules={[{ required: false, message: '请输入费率' }]}
              >
                <InputNumber
                  style={{ width: 150 }}
                  min={0}
                  placeholder="请输入费率"
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                  disabled={checkEditType(index)}
                />
              </Form.Item>
              {checkArr[index]?.isExpired}

              {/* 过期无操作按钮 */}
              {!checkArr[index]?.isExpired && (
                <a onClick={() => handleSave(name, checkArr[index]?.rate ? 'edit' : 'save')}>
                  {checkEditType(index) && checkArr[index]?.rate ? '编辑' : '保存'}
                </a>
              )}
              {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              disabled={disabled}
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              新增
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
export default connect(({ loading }) => ({
  loading: loading.models.businessList,
}))(RateFormList);
