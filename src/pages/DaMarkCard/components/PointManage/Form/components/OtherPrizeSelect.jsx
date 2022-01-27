import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { OTHER_PRIZE_TYPE } from '@/common/constant';
import FormList from './HittingRewardRightGoodsObject/FormList';
import FormListOnline from './HittingRewardOnlineGoodsObject/FormList';
import FormListActual from './HittingRewardActualGoodsObject/FormList';
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
    if (type === 'hittingRewardRightGoodsObject') {
    }
    if (type === 'hittingRewardActualGoodsObject') {
    }
  };

  const listProps = {
    hittingRewardRightGoodsObject: (
      <>
        <Form.List name={['hittingRewardRightGoodsObject', 'subRewardList']}>
          {(fields, { add, remove, move }, { errors }) => {
            return (
              <>
                {goodsType.includes('hittingRewardRightGoodsObject') && (
                  <Button type="link" onClick={() => add()}>
                    +选择
                  </Button>
                )}
                <Form.ErrorList errors={errors} />
                {fields.map((field) => (
                  <FormList
                    name={['hittingRewardRightGoodsObject', 'subRewardList']}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                  ></FormList>
                ))}
              </>
            );
          }}
        </Form.List>
        <Form.Item noStyle shouldUpdate={(pre, cur) => pre.path !== cur.path}>
          {({ getFieldValue }) =>
            getFieldValue(['hittingRewardRightGoodsObject', 'subRewardList'])?.length > 0 && (
              <Form.Item
                label="概率"
                name={['hittingRewardRightGoodsObject', 'rate']}
                rules={[{ required: true, message: '请输入概率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="请输入比例"
                  addonAfter="%"
                ></InputNumber>
              </Form.Item>
            )
          }
        </Form.Item>
      </>
    ),
    hittingRewardOnlineGoodsObject: (
      <>
        <Form.List name={['hittingRewardOnlineGoodsObject', 'subRewardList']}>
          {(fields, { add, remove, move }, { errors }) => {
            return (
              <>
                {goodsType.includes('hittingRewardOnlineGoodsObject') && (
                  <Button type="link" onClick={() => add()}>
                    +新增
                  </Button>
                )}
                <Form.ErrorList errors={errors} />
                {fields.map((field) => (
                  <FormListOnline
                    name={['hittingRewardOnlineGoodsObject', 'subRewardList']}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    add={add}
                  ></FormListOnline>
                ))}
              </>
            );
          }}
        </Form.List>
        <Form.Item noStyle shouldUpdate={(pre, cur) => pre.path !== cur.path}>
          {({ getFieldValue }) =>
            getFieldValue(['hittingRewardOnlineGoodsObject', 'subRewardList'])?.length > 0 && (
              <Form.Item
                label="概率"
                name={['hittingRewardOnlineGoodsObject', 'rate']}
                rules={[{ required: true, message: '请输入概率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="请输入比例"
                  addonAfter="%"
                ></InputNumber>
              </Form.Item>
            )
          }
        </Form.Item>
      </>
    ),
    hittingRewardActualGoodsObject: (
      <>
        <Form.List name={['hittingRewardActualGoodsObject', 'subRewardList']}>
          {(fields, { add, remove, move }, { errors }) => {
            return (
              <>
                {goodsType.includes('hittingRewardActualGoodsObject') && (
                  <Button type="link" onClick={() => add()}>
                    +新增
                  </Button>
                )}
                <Form.ErrorList errors={errors} />
                {fields.map((field) => (
                  <FormListActual
                    name={['hittingRewardActualGoodsObject', 'subRewardList']}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    add={add}
                  ></FormListActual>
                ))}
              </>
            );
          }}
        </Form.List>
        <Form.Item noStyle shouldUpdate={(pre, cur) => pre.path !== cur.path}>
          {({ getFieldValue }) =>
            getFieldValue(['hittingRewardOnlineGoodsObject', 'subRewardList'])?.length > 0 && (
              <Form.Item
                label="概率"
                name={['hittingRewardOnlineGoodsObject', 'rate']}
                rules={[{ required: true, message: '请输入概率' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="请输入比例"
                  addonAfter="%"
                ></InputNumber>
              </Form.Item>
            )
          }
        </Form.Item>
      </>
    ),
  };

  return (
    <>
      <Form.Item label="其他奖品" name="goodsObject">
        <Checkbox.Group onChange={handleChange}>
          {Object.keys(OTHER_PRIZE_TYPE).map((item) => (
            <div key={item}>
              <Checkbox value={item}>
                <span>{OTHER_PRIZE_TYPE[item]}</span>
                {/* {goodsType.includes(item) && (
                  <Button type="link" onClick={() => handleVisible(item)}>
                    {item === 'hittingRewardRightGoodsObject' ? '+选择' : '+新增'}
                  </Button>
                )} */}
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
        onSumbit={(list) => {
          // subRewardList.map(({ goodInfo, ...other }) => other);
          form.setFieldsValue({
            hittingRewardRightGoodsObject: {
              subRewardList: list.map((item) => ({
                rightGoodsObject: item,
                rewardId: item.activityGoodsId,
              })),
            },
          });
        }}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default OtherPrizeSelect;
