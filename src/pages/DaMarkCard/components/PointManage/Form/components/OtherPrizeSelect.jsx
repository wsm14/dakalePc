import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { OTHER_PRIZE_TYPE } from '@/common/constant';
import FormList from './HittingRewardRightGoodsObject/FormList';
import GoodsSelectModal from './HittingRewardRightGoodsObject/GoodsSelectModal';

const OtherPrizeSelect = (props) => {
  const { form } = props;
  const [goodsType, setGoodsType] = useState([]); // 选择的其他奖品类型
  const [visible, setVisible] = useState(false); // 权益商品 弹窗

  // 改变选择的其他奖品类型
  const handleChange = (val) => {
    setGoodsType(val);
  };

  const handleVisible = (type) => {
    if (type === 'hittingRewardRightGoodsObject') {
      setVisible(true);
    }
  };

  const listProps = {
    hittingRewardRightGoodsObject: (
      <>
        <Form.List name={['hittingRewardRightGoodsObject', 'subRewardList']}>
          {(fields, { remove, move }, { errors }) => {
            return (
              <>
                <Form.ErrorList errors={errors} />
                {fields.map((field, name) => (
                  <FormList
                    type="subRewardList"
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    move={move}
                  ></FormList>
                ))}
                {fields.length !== 0 && (
                  <Form.Item label="概率" name={['hittingRewardRightGoodsObject', 'rate']}>
                    <InputNumber
                      min={0}
                      max={100}
                      placeholder="请输入比例"
                      addonAfter="%"
                    ></InputNumber>
                  </Form.Item>
                )}
              </>
            );
          }}
        </Form.List>
      </>
    ),
    hittingRewardOnlineGoodsObject: <></>,
    hittingRewardActualGoodsObject: <></>,
  };

  return (
    <>
      <Form.Item label="其他奖品" name="goodsObject">
        <Checkbox.Group onChange={handleChange}>
          {Object.keys(OTHER_PRIZE_TYPE).map((item) => (
            <div key={item}>
              <Checkbox value={item}>
                <span>{OTHER_PRIZE_TYPE[item]}</span>
                {goodsType.includes(item) && (
                  <Button type="link" onClick={() => handleVisible(item)}>
                    {item === 'hittingRewardRightGoodsObject' ? '+选择' : '+新增'}
                  </Button>
                )}
              </Checkbox>
              {listProps[item]}
            </div>
          ))}
        </Checkbox.Group>
      </Form.Item>
      {/* 选择平台权益商品 */}
      <GoodsSelectModal
        typeGoods="subRewardList"
        form={form}
        visible={visible}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default OtherPrizeSelect;
