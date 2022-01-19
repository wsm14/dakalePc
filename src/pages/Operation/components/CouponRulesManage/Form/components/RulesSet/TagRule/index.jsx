import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Radio, Select, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { TAG_TYPE } from '@/common/constant';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 标签
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ configGoodsTagList, dispatch, form }) => {
  const [sonType, setSonType] = useState('platform');

  useEffect(() => {
    form.setFieldsValue({
      remark: '',
      ruleConditions: [],
      subRuleType: {
        platform: 'platformGoodsTags',
        merchant: 'merchantTags',
      }[sonType],
    });
    dispatch({
      type: 'baseData/fetchListConfigGoodsTag',
      payload: {
        tagType: sonType,
      },
    });
  }, [sonType]);

  // 选择标签种类
  const handleTagChange = (e, option) => {
    setSonType(e.target.value);
  };

  // 具体选择标签
  const handleOneTagChange = (list) => {
    form.setFieldsValue({
      remark: `已选${list.length}个${TAG_TYPE[sonType]}`,
    });
  };

  return (
    <>
      <FormItem label="标签类型" required>
        <Radio.Group value={sonType} onChange={handleTagChange}>
          {Object.keys(TAG_TYPE).map((item) => (
            <Radio key={item} value={item}>
              {TAG_TYPE[item]}
            </Radio>
          ))}
        </Radio.Group>
      </FormItem>
      <FormItem label="指定商品标签" name="ruleConditions">
        <Select
          mode="multiple"
          placeholder={`请选择${TAG_TYPE[sonType]}`}
          onChange={handleOneTagChange}
        >
          {configGoodsTagList.map((item) => (
            <Option key={item.configGoodsTagId} value={item.configGoodsTagId}>
              {item.tagName}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem label="subRuleType" hidden name="subRuleType">
        <Input />
      </FormItem>
      <FormItem label="remark" hidden name="remark">
        <Input />
      </FormItem>
    </>
  );
};

export default connect(({ baseData }) => ({
  configGoodsTagList: baseData.configGoodsTagList,
}))(index);
