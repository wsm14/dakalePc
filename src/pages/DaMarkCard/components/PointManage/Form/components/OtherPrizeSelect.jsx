import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { OTHER_PRIZE_TYPE } from '@/common/constant';

const OtherPrizeSelect = (props) => {
  const [goodsType, setGoodsType] = useState([]); // 选择的其他奖品类型

  // 改变选择的其他奖品类型
  const handleChange = (val) => {
    setGoodsType(val);
  };

  return (
    <Form.Item label="其他奖品" name="goodsObject">
      <Checkbox.Group onChange={handleChange}>
        {Object.keys(OTHER_PRIZE_TYPE).map((item) => (
          <div key={item}>
            <Checkbox value={item}>
              <span>{OTHER_PRIZE_TYPE[item]}</span>
              {goodsType.includes(item) && (
                <Button type="link">
                  {item === 'hittingRewardRightGoodsObject' ? '+选择' : '+新增'}
                </Button>
              )}
            </Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );
};

export default OtherPrizeSelect;
