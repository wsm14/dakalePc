import React from 'react';
import update from 'immutability-helper';
import { Form, Badge, InputNumber } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import './index.less';

// 补充信息表单 特惠商品
const SpecialGoodsFormItem = (props) => {
  const { index, form, goodsType } = props;

  const data = form.getFieldValue([goodsType, index]) || {};

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
    activitySellBean,
  } = data;

  const maxPrice = sellPrice * 100 + Number(sellBean);

  // 更新数据
  const updateData = (val) => {
    const listData = form.getFieldValue(goodsType) || [];
    form.setFieldsValue({
      [goodsType]: update(listData, {
        $splice: [[index, 1, { ...(listData[index] || {}), ...val }]],
      }),
    });
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
                  <div>结算价 ￥{settlePrice}</div>
                </div>
              </div>
            </div>
          </div>
          {/* 表单  */}
          <div className="supplyInfoFormItem_form">
            {!['free', 'self'].includes(paymentModeType) && (
              <Form.Item
                label="秒杀价"
                name={[index, 'activitySellPrice']}
                rules={[{ required: true, message: '请输入秒杀价' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  max={maxPrice / 100}
                  placeholder="请输入秒杀价"
                  style={{ width: 220 }}
                ></InputNumber>
              </Form.Item>
            )}
            <Form.Item required label="秒杀价(卡豆)" hidden={paymentModeType !== 'self'}>
              <Form.Item
                noStyle
                name={[index, 'activitySellBean']}
                rules={[{ required: true, message: '请输入秒杀价(卡豆)' }]}
              >
                <InputNumber
                  min={0}
                  max={Math.trunc(maxPrice)}
                  precision={0}
                  style={{ width: 100 }}
                  onChange={(e) => {
                    updateData({ activitySellPrice: (maxPrice - e) / 100 });
                  }}
                ></InputNumber>
              </Form.Item>{' '}
              秒杀价:{' '}
              {paymentModeType == 'self' && (
                <Form.Item
                  noStyle
                  name={[index, 'activitySellPrice']}
                  rules={[{ required: true, message: '请输入秒杀价' }]}
                >
                  <InputNumber
                    min={0}
                    max={(maxPrice - activitySellBean) / 100}
                    precision={2}
                    addonAfter={`折扣`}
                    style={{ width: 100 }}
                  />
                </Form.Item>
              )}
              {/* 活动结算价 */}
              <Form.Item noStyle hidden name={[index, 'settlePrice']}>
                <InputNumber min={0} precision={2} style={{ width: 100 }} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="秒杀库存"
              name={[index, 'activityTotal']}
              rules={[{ required: true, message: '请输入秒杀库存' }]}
            >
              <InputNumber
                min={0}
                precision={0}
                style={{ width: 220 }}
                placeholder="请输入秒杀库存"
              ></InputNumber>
            </Form.Item>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
};

export default SpecialGoodsFormItem;
