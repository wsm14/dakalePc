import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { Form, Input, Row } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { Cascader, Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

const MreSelectSearch = ({ tradeList, cRef, hubData, dispatch, loading }) => {
  const [form] = Form.useForm();
  const [hubSelect, setHubSelect] = useState(true); // 商圈搜索选择

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取搜索参数
  const handleGetData = () => {
    const nowData = form.getFieldsValue();
    const newData = lodash.pickBy(nowData, (value) => !!value && value.length);
    const { provinceCode } = newData;
    const valuesKey = ['provinceCode', 'cityCode', 'districtCode'];
    if (provinceCode) provinceCode.map((key, i) => (newData[valuesKey[i]] = key));
    cRef.current.fetchGetData({ ...newData, page: 1 });
  };

  // 获取商圈
  const fetchGetHubSelect = (payload) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload,
    });
  };

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  return (
    <Form form={form}>
      <FormItem name={'merchantName'}>
        <Input.Search
          placeholder="请输入店铺名称"
          enterButton="搜索"
          prefix={<SearchOutlined />}
          onSearch={handleGetData}
        />
      </FormItem>
      <Row justify="space-between">
        <FormItem label="地区" name={'provinceCode'} style={{ width: 270 }}>
          <Cascader
            label="地区"
            allowClear
            changeOnSelect={true}
            onChange={(val, option) => {
              form.setFieldsValue({ businessHubId: undefined });
              handleGetData();
              if (val.length === 3) fetchGetHubSelect({ districtCode: val[2] });
              else {
                setHubSelect(true);
                return;
              }
              setHubSelect(false);
            }}
          />
        </FormItem>
        <FormItem label="商圈" name={'businessHubId'} style={{ width: 270 }}>
          <Select
            label="商圈"
            allowClear
            loading={loading.models.baseData}
            disabled={hubSelect}
            select={hubData}
            fieldNames={{ label: 'businessHubName', value: 'businessHubIdString' }}
            onChange={handleGetData}
          />
        </FormItem>
        <FormItem label="行业" name={'topCategoryId'} style={{ width: 270 }}>
          <Select
            label="行业"
            allowClear
            select={tradeList}
            fieldNames={{
              label: 'categoryName',
              value: 'categoryIdString',
            }}
            onChange={handleGetData}
          />
        </FormItem>
      </Row>
    </Form>
  );
};

export default connect(({ businessList, sysTradeList, baseData, loading }) => ({
  subsidyList: businessList.subsidyList,
  tradeList: sysTradeList.list.list,
  hubData: baseData.hubData,
  loading,
}))(MreSelectSearch);
