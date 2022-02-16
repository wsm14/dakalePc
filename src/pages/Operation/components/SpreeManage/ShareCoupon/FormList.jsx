import React from 'react';
import { Space } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom, couponsDom, platformCouponsDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move, handleType } = props;

  return (
    <Space key={field.key} className={styles.ifame_carouseal} align="baseline">
      <div className={styles.ifame_btnArr}>
        <UpSquareOutlined
          onClick={() => {
            move(field.name, field.name - 1);
          }}
        />
        <DownSquareOutlined
          onClick={() => {
            move(field.name, field.name + 1);
          }}
        />
      </div>

      {(() => {
        const goodsItem = form.getFieldValue(type)[field.name];
        return {
          platformCoupon: platformCouponsDom(goodsItem, goodsItem?.platformCouponId),
          rightGoods: goodsDom(goodsItem, goodsItem?.specialGoodsId),
          rightCoupon: couponsDom(goodsItem, goodsItem?.ownerCouponIdString),
        }[goodsItem?.tagType || 'platformCoupon'];

        // return (
        //   <>
        //     <div className={styles.listItem_img}>
        //       <img src={goodsItem.goodsImg} />
        //     </div>
        //     <div className={styles.listItem_info}>
        //       <div>商品名称：{goodsItem.goodsName}</div>
        //       <div>售价：{goodsItem.buyFlag === '0' ? '免费' : `￥${goodsItem.realPrice}`}</div>
        //       <div>
        //         <span className={styles.tip}>原价：￥{goodsItem.oriPrice}</span>
        //       </div>
        //     </div>
        //   </>
        // );
      })()}
      {handleType !== 'edit' && <DeleteOutlined onClick={() => remove(field.name)} />}
    </Space>
  );
};

export default FormList;
