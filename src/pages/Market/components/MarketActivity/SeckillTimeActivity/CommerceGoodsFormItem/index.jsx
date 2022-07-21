import React from 'react';
import { Form, Badge } from 'antd';
import { ELECTRICGOODS_SELL_PRICE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import SkuTableForm from './SkuTableForm';
import './index.less';

// 补充信息表单 电商品
const CommerceGoodsFormItem = (props) => {
  const { index, form, goodsType } = props;

  const data = form.getFieldValue([goodsType, index]) || {};

  const { paymentModeType, relateName, goodsImg, goodsName, skuList } = data;

  return (
    <div style={{ marginBottom: 16 }}>
      <Badge.Ribbon text={index + 1}>
        <div className="supplyCInfoFormItem_box">
          {/* 商家名称 */}
          <div className="supplyCInfoFormItem_head">{relateName}</div>
          <div className="supplyCInfoFormItem_goodsInfo">
            {/* 商品图片 */}
            <PopImgShow width={80} url={goodsImg} />
            <div className="goodsInfo">
              <div className="goodsInfo_name">{goodsName}</div>
              {/* 商品价格 电商品 */}
              <div className="goodsInfo_price">
                <div>售价 {ELECTRICGOODS_SELL_PRICE_TYPE[paymentModeType]}</div>
              </div>
            </div>
          </div>
          <div className="supplyCInfoFormItem_form">
            <Form.List name={[index, 'skuList']}>
              {(fields) => (
                <SkuTableForm
                  data={data}
                  form={form}
                  pIndex={index}
                  key={fields.key}
                  skuList={skuList}
                  goodsType={goodsType}
                  paymentModeType={paymentModeType}
                ></SkuTableForm>
              )}
            </Form.List>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
};

export default CommerceGoodsFormItem;
