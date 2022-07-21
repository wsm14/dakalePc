import React from 'react';
import update from 'immutability-helper';
import { Form, Badge, InputNumber } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import './index.less';

// 补充信息表单 特惠商品
const SpecialGoodsFormItem = (props) => {
  const { index, form, goodsType } = props;

  const data = form.getFieldValue([goodsType, index]) || {};
  // 表单折扣
  const formDiscount = Form.useWatch([goodsType, index, 'discount'], form) || 0;
  // 表单卡豆
  const formSellBean = Form.useWatch([goodsType, index, 'activitySellBean'], form) || 0;

  const {
    paymentModeType,
    sellPrice = 0,
    sellBean = 0,
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
  const checkPrice = (val) => {
    // 当前折扣后价格
    const newDisPrice =
      countPrice(formDiscount * sellPrice) * 100 + Math.trunc((formDiscount * sellBean) / 10);
    // 修改后折扣价格
    const editDisPrice = val * 100 + formSellBean;
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
              <div className="goodsInfo_name">
                活动时间：
                {
                  { fixed: `${activityStartDate} ~ ${activityEndDate}`, infinite: '长期' }[
                    activityTimeRule
                  ]
                }
              </div>
              {/* 商品价格 特惠商品 */}
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
                </div>
              </div>
            </div>
          </div>
          {/* 表单  */}
          <div className="supplyInfoFormItem_form">
            <Form.Item required label="活动售价(卡豆)" hidden={paymentModeType !== 'self'}>
              <Form.Item
                noStyle
                name={[index, 'activitySellBean']}
                rules={[{ required: true, message: '请输入活动售价(卡豆)' }]}
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
                rules={[
                  { required: true, message: '请输入活动零售价' },
                  {
                    validator: (_, value) => checkPrice(value),
                  },
                ]}
              >
                <InputNumber min={0} precision={2} style={{ width: 100 }} />
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

export default SpecialGoodsFormItem;
