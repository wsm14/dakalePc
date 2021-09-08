import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { Form, Input, Row } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { Cascader, Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

const MreSelectSearch = ({ tradeList, cRef, dispatch, loading }) => {
  const [form] = Form.useForm();

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

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  return (
    <Form form={form}>
      <FormItem name={'groupName'}>
        <Input.Search
          placeholder="请输入集团名称"
          enterButton="搜索"
          prefix={<SearchOutlined />}
          onSearch={handleGetData}
        />
      </FormItem>
      <Row >
        <FormItem label="地区" name={'provinceCode'} style={{ width: 270 }}>
          <Cascader
            label="地区"
            allowClear
            changeOnSelect={true}
          />
        </FormItem>
        <FormItem label="行业" name={'topCategoryId'} style={{ width: 270 ,marginLeft:30}}>
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

export default connect(({ businessList, sysTradeList, loading }) => ({
  subsidyList: businessList.subsidyList,
  tradeList: sysTradeList.list.list,
  loading,
}))(MreSelectSearch);
