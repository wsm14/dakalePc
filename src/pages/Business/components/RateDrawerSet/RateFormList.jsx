import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, DatePicker } from 'antd';
import { connect } from 'umi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    setIsEdit(disabled);
  }, [disabled]);

  const scanArr = scanValues.scan ? scanValues.scan : [];
  const verArr = verificationValue.verification ? verificationValue.verification : [];
  const proArr = promotionValue.promotion ? promotionValue.promotion : [];

  const checkArr = { scan: scanArr, verification: verArr, promotion: proArr }[rateType];
  const checkEditType = (index) => (checkArr[index]?.rate ? !isEdit[index] : false);

  //编辑 || 保存
  const handleSave = (index, type) => {
    console.log(index, type);
    if (type === 'edit') {
      setIsEdit({ ...isEdit, [index]: type === 'edit' });
    }
    form.validateFields().then((values) => {
      const { scan, verification, promotion } = values;
      let beginDate = '';
      let endDate = '';
      let rate = '';
      let ownerManualId = '';
      //编辑
      if (type === 'edit') {
        switch (rateType) {
          case 'scan':
            ownerManualId = scanValues.scan[index].ownerManualId; //详情index对应 的id
            beginDate = scan[index].time[0].format('YYYY-MM-DD');
            endDate = scan[index].time[1].format('YYYY-MM-DD');
            rate = scan[index].rate;
            break;
          case 'verification':
            ownerManualId = verificationValue.verification[index].ownerManualId;
            beginDate = verification[index].time[0].format('YYYY-MM-DD');
            endDate = verification[index].time[1].format('YYYY-MM-DD');
            rate = verification[index].rate;
            break;
          case 'promotion':
            ownerManualId = promotionValue.promotion[index].ownerManualId;
            beginDate = promotion[index].time[0].format('YYYY-MM-DD');
            endDate = promotion[index].time[1].format('YYYY-MM-DD');
            rate = promotion[index].rate;
            break;
        }
      } else {
        switch (rateType) {
          case 'scan':
            beginDate = scan[index].time[0].format('YYYY-MM-DD');
            endDate = scan[index].time[1].format('YYYY-MM-DD');
            rate = scan[index].rate;
            break;
          case 'verification':
            beginDate = verification[index].time[0].format('YYYY-MM-DD');
            endDate = verification[index].time[1].format('YYYY-MM-DD');
            rate = verification[index].rate;
            break;
          case 'promotion':
            beginDate = promotion[index].time[0].format('YYYY-MM-DD');
            endDate = promotion[index].time[1].format('YYYY-MM-DD');
            rate = promotion[index].rate;
            break;
        }
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
        if (!checkEditType(index)) {
          dispatch({
            type: apiUrl,
            payload: payload,
            callback: () => {
              fetchGetRate(listPayload); // 获取详情
              setIsEdit({ ...isEdit, [index]: type === 'edit' });
            },
          });
        } else {
          dispatch({
            type: apiUrl,
            payload: payload,
            callback: () => {
              fetchGetRate(listPayload); // 获取详情
              setIsEdit({ ...isEdit, [index]: type === 'edit' });
            },
          });
        }
      }
    });
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
                <RangePicker disabled={checkEditType(index)} />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'rate']}
                fieldKey={[fieldKey, 'rate']}
                rules={[{ required: true, message: '请输入费率' }]}
              >
                <Input placeholder="请输入费率" suffix="%" disabled={checkEditType(index)} />
              </Form.Item>
              <a onClick={() => handleSave(name, checkArr[index]?.rate ? 'edit' : 'save')}>
                {checkEditType(index) && checkArr[index]?.rate ? '编辑' : '保存'}
              </a>
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
