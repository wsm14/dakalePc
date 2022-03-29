import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Space, DatePicker } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const VideoFormList = (props) => {
  const {
    dispatch,
    loading,
    name = 'collection',
    form,
    collectionValues = {},
    shareValues = {},
    rewardValues = {},
    ruleType,
    fetchGetRate,
    ownerId,
    momentId,
    listPayload,
  } = props;
  const [isEdit, setIsEdit] = useState({});

  console.log('collectionValues', collectionValues);

  const collectionArr = collectionValues.collection ? collectionValues.collection : [];
  const shareArr = shareValues.share ? shareValues.share : [];
  const rewardArr = rewardValues.reward ? rewardValues.reward : [];

  const checkArr = {
    collection: collectionArr,
    share: shareArr,
    reward: rewardArr,
  }[ruleType];
  const checkEditType = (index) => (checkArr[index]?.time[0] ? !isEdit[index] : false);

  const getDispatch = (url, payload, index, type) => {
    dispatch({
      type: url,
      payload: payload,
      callback: () => {
        fetchGetRate(listPayload); // 获取详情
        setIsEdit({ ...isEdit, [index]: false });
      },
    });
  };

  //编辑 || 保存
  const handleSave = (index, type) => {
    if (type === 'edit') {
      setIsEdit({ ...isEdit, [index]: type === 'edit' });
    }

    form.validateFields().then((values) => {
      const { collection, share, reward } = values;

      let beginTime = '';
      let endTime = '';
      let simulationNum = '';
      let configMomentSimulationId = '';

      switch (ruleType) {
        case 'collection':
          configMomentSimulationId =
            type === 'edit' ? collectionValues.collection[index].configMomentSimulationId : ''; //详情index对应 的id | 编辑
          beginTime = collection[index].time[0].format('YYYY-MM-DD'); //新增|编辑参数
          endTime = collection[index].time[1].format('YYYY-MM-DD');
          simulationNum = collection[index].simulationNum;
          break;
        case 'share':
          configMomentSimulationId =
            type === 'edit' ? shareValues.share[index].configMomentSimulationId : '';
          beginTime = share[index].time[0].format('YYYY-MM-DD');
          endTime = share[index].time[1].format('YYYY-MM-DD');
          simulationNum = share[index].simulationNum;
          break;
        case 'reward':
          configMomentSimulationId =
            type === 'edit' ? rewardValues.reward[index].configMomentSimulationId : '';
          beginTime = reward[index].time[0].format('YYYY-MM-DD');
          endTime = reward[index].time[1].format('YYYY-MM-DD');
          simulationNum = reward[index].simulationNum;
          break;
      }

      const apiUrl = {
        save: 'videoPlatform/fetchVideoFakeListAdd',
        edit: 'videoPlatform/fetchVideoFakeListEdit',
      }[type];
      const payload = {
        save: {
          ownerId,
          momentId,
          ruleType,
          simulationNum,
          beginTime,
          endTime,
        },
        edit: {
          configMomentSimulationId,
          beginTime,
          endTime,
          simulationNum,
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
    return current && current < moment();
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
                name={[name, 'simulationNum']}
                fieldKey={[fieldKey, 'simulationNum']}
                rules={[{ required: false, message: '请输入仿真数' }]}
              >
                <InputNumber
                  style={{ width: 150 }}
                  min={0}
                  placeholder="请输入仿真数"
                  disabled={checkEditType(index)}
                />
              </Form.Item>
              {checkArr[index]?.isExpired}

              {/* 过期无操作按钮 */}
              {!checkArr[index]?.isExpired && (
                <a onClick={() => handleSave(name, checkArr[index]?.time[0] ? 'edit' : 'save')}>
                  {checkEditType(index) && checkArr[index]?.time[0] != '' ? '编辑' : '保存'}
                </a>
              )}
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              新增
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
export default connect(({ loading }) => ({
  // loading: loading.models.businessList,
}))(VideoFormList);
