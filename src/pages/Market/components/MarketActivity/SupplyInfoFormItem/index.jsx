import React from 'react';
import update from 'immutability-helper';
import { Form, Badge, InputNumber } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import './index.less';

// 补充信息表单
const SupplyInfoFormItem = (props) => {
  const { index, form, goodsType, discountMax, ruleTypeArr = [] } = props;

  const data = form.getFieldValue(goodsType)[index] || {};
  // 表单折扣
  const formDiscount = Form.useWatch([goodsType, index, 'discount'], form) || 0;
  // 表单卡豆
  const formSellBean = Form.useWatch([goodsType, index, 'activitySellBean'], form) || 0;
  // 表单价格
  const formSellPrice = Form.useWatch([goodsType, index, 'activitySellPrice'], form) || 0;
  // 表单结算价
  const formSettlePrice = Form.useWatch([goodsType, index, 'activitySettlePrice'], form) || 0;

  const {
    paymentModeType,
    sellPrice = 0,
    sellBean = 0,
    settlePrice = 0,
    relateName,
    goodsImg,
    goodsName,
    activityTimeRule,
    activityStartDate,
    activityEndDate,
  } = data;

  // 计算价格
  const countPrice = (val) => {
    return Number((val / 10 < 0.001 ? 0 : val / 10).toFixed(2));
  };

  // 售卖价格
  const payPrice = countPrice(sellPrice * discountMax);
  // 结算价
  const paySettlePrice = countPrice(settlePrice * discountMax);

  // 更新数据
  const updateData = (val) => {
    const listData = form.getFieldValue(goodsType) || [];
    form.setFieldsValue({
      [goodsType]: update(listData, {
        $splice: [[index, 1, { ...(listData[index] || {}), ...val }]],
      }),
    });
  };

  // 校验价格是否相等折扣
  const checkPrice = (val, type) => {
    // 当前折扣后价格
    const newDisPrice =
      countPrice(formDiscount * sellPrice) * 100 + Math.trunc((formDiscount * sellBean) / 10);
    // 修改后折扣价格
    let editDisPrice = 0;

    if (type === 'bean') {
      editDisPrice = formSellPrice * 100 + val;
    } else {
      editDisPrice = formSellPrice * 100 + formSellBean;
    }
    if (newDisPrice !== editDisPrice) {
      return Promise.reject(new Error(`卡豆+现金活动售价需等于当前售价*${formDiscount}折`));
    }
    return Promise.resolve();
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Badge.Ribbon text={index + 1}>
        <div className="supplyInfoFormItem_box">
          {/* 商家名称 */}
          <div className="supplyInfoFormItem_head">{relateName}</div>
          <div className="supplyInfoFormItem_goodsInfo">
            {/* 商品图片 */}
            <PopImgShow width={80} url={goodsImg} />
            <div className="goodsInfo">
              <div className="goodsInfo_name">{goodsName}</div>
              {/* 特惠活动时间 */}
              {goodsType === 'specialGoods' && (
                <div className="goodsInfo_name">
                  活动时间：
                  {
                    { fixed: `${activityStartDate} ~ ${activityEndDate}`, infinite: '长期' }[
                      activityTimeRule
                    ]
                  }
                </div>
              )}
              {/* 商品价格 */}
              <div className="goodsInfo_price">
                <div>
                  <div>
                    售价
                    {
                      {
                        defaultMode: `￥${sellPrice}`,
                        cashMode: `￥${sellPrice}`,
                        self: `￥${sellPrice}+${sellBean}卡豆`,
                        free: '免费',
                      }[paymentModeType]
                    }
                  </div>
                  {ruleTypeArr.includes('discount') && (
                    <div className="price_color">
                      活动最高价
                      {
                        {
                          defaultMode: `￥${payPrice}`,
                          cashMode: `￥${payPrice}`,
                          self: `￥${payPrice}+${Math.trunc((sellBean * discountMax) / 10)}卡豆`,
                          free: '免费',
                        }[paymentModeType]
                      }
                    </div>
                  )}
                </div>
                {/* 特惠显示结算价 */}
                {goodsType === 'specialGoods' && ruleTypeArr.includes('discount') && (
                  <div className="goodsInfo_priceEnd">
                    <div>结算价￥{settlePrice}</div>
                    <div className="price_color">结算最高价￥{paySettlePrice}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 表单 */}
          <div className="supplyInfoFormItem_form">
            <Form.Item
              label="活动折扣"
              name={[index, 'discount']}
              rules={[{ required: true, message: '请输入活动折扣' }]}
              extra={
                ruleTypeArr.includes('discount') && (
                  <>
                    <div>活动折扣不可高于{discountMax}折</div>
                    {formDiscount !== 0 && (
                      <div>
                        {paymentModeType !== 'self' && `折后价:￥${formSellPrice} `}
                        折后结算价:{formSettlePrice}
                      </div>
                    )}
                  </>
                )
              }
            >
              <InputNumber
                min={0}
                precision={0}
                max={discountMax}
                addonAfter={'折'}
                placeholder="请输入活动折扣"
                onChange={(val) => {
                  updateData({
                    activitySellBean: Math.trunc((val * sellBean) / 10),
                    activitySellPrice: countPrice(val * sellPrice),
                    activitySettlePrice: countPrice(val * settlePrice),
                  });
                }}
              ></InputNumber>
            </Form.Item>
            <Form.Item required label="活动售价(卡豆)" hidden={paymentModeType !== 'self'}>
              <Form.Item
                noStyle
                name={[index, 'activitySellBean']}
                rules={[
                  { required: true, message: '请输入活动售价(卡豆)' },
                  {
                    validator: (_, value) => checkPrice(value, 'bean'),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={
                    countPrice(formDiscount * sellPrice) * 100 +
                    Math.trunc((formDiscount * sellBean) / 10)
                  }
                  precision={0}
                  style={{ width: 100 }}
                  onChange={(e) => {
                    const maxPrice =
                      countPrice(formDiscount * sellPrice) * 100 +
                      Math.trunc((formDiscount * sellBean) / 10);
                    updateData({
                      activitySellPrice: (maxPrice - e) / 100,
                    });
                  }}
                ></InputNumber>
              </Form.Item>{' '}
              活动零售价:{' '}
              <Form.Item
                noStyle
                name={[index, 'activitySellPrice']}
                rules={[{ required: true, message: '请输入活动零售价' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  style={{ width: 100 }}
                  onChange={() => {
                    form.validateFields([[goodsType, index, 'activitySellBean']]);
                  }}
                />
              </Form.Item>
              {/* 活动结算价 */}
              <Form.Item noStyle hidden name={[index, 'activitySettlePrice']}>
                <InputNumber min={0} precision={2} style={{ width: 100 }} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="活动库存"
              name={[index, 'activityTotal']}
              rules={[{ required: true, message: '请输入活动售卖库存' }]}
            >
              <InputNumber
                min={0}
                precision={0}
                style={{ width: 220 }}
                placeholder="请输入活动售卖库存"
              ></InputNumber>
            </Form.Item>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
};

export default SupplyInfoFormItem;
