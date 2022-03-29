import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Select, Input, Row, Col, Cascader } from 'antd';
import CITYJSON from '@/common/cityJson';
import { getCityName } from '@/utils/utils';
import { CONPON_RULES_TYPE } from '@/common/constant';
import './index.less';

const FormItem = Form.Item;

/**
 * 可选区域
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ ruleShowApi, form }) => {
  const [citys, setCitys] = useState([]);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      ruleConditions: [],
      subRuleType: ruleShowApi === 'availableAreaRule' ? 'availableArea' : 'unavailableArea',
    });
    setCitys([]), setCodes([]);
  }, [ruleShowApi]);

  // 添加城市
  const addCity = () => {
    // const code = form.getFieldValue('ruleConditions')[1];
    const code = codes[1];
    if (code == undefined) return;
    if (citys.indexOf(code) > -1) {
      return;
    }
    setCitys([...citys, code]);
    form.setFieldsValue({
      ruleConditions: [...citys, code].map((item) => ({
        condition: item,
      })),
      remark: `已选${[...citys, code].length}个${CONPON_RULES_TYPE[ruleShowApi]}`,
    });
  };

  return (
    <>
      <FormItem label="可用区域" required>
        <Row gutter={8}>
          <Col span={18}>
            <Cascader
              value={codes}
              onChange={(val) => setCodes(val)}
              options={CITYJSON.filter((item) => item.level === '1').map((item) => ({
                ...item,
                children: CITYJSON.filter((items) => items.pid === item.id),
              }))}
              placeholder="请选择城市"
              allowClear
              fieldNames={{ label: 'name', value: 'id' }}
            ></Cascader>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={addCity}>
              添加
            </Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <div className="city_box">
          {citys.map((item) => {
            return <span key={item}>{`${getCityName(item)}；`}</span>;
          })}
        </div>
      </FormItem>
      <FormItem label="subRuleType" hidden name="subRuleType">
        <Input />
      </FormItem>
      <FormItem label="remark" hidden name="remark">
        <Input />
      </FormItem>
      <FormItem label="ruleConditions" hidden name="ruleConditions">
        <Input />
      </FormItem>
    </>
  );
};

export default connect(({ baseData }) => ({
  configGoodsTagList: baseData.configGoodsTagList,
}))(index);
