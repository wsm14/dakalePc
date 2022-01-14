import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Cascader } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

/**
 * 店铺
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ ruleShowApi, categoryCascaderList, dispatch }) => {
  const [visible, setVisible] = useState(false); // 选择店铺Modal
  // const [visible, setVisible] = useState(false); // 暂存数据

  return (
    <FormItem label="指定店铺" required>
      <Button type="link">选择</Button>
    </FormItem>
  );
};

export default connect(({ sysTradeList }) => ({
  categoryCascaderList: sysTradeList.categoryCascaderList,
}))(index);
