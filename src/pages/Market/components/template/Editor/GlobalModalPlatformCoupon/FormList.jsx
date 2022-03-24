import React from 'react';
import { Space } from 'antd';
import { MinusCircleOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import { PLATFORM_TICKET_TYPE } from '@/common/constant';
import styles from './index.less';

const FormList = (props) => {
  const { form, fields, field, remove, move } = props;

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
        const goodsItem = form.getFieldValue('list')[field.name];
        const {
          platformCouponId = '',
          couponValue, // 券价值
          thresholdPrice, // 门槛
          useScenesType,
          classType,
          couponName,
          remain,
          activeDateStr, //  使用有效期-固定时间-开始时间
          activeDate,
          endDateStr, //  使用有效期-固定时间-结束时间
          endDate,
          delayDays = 0, // 使用有效期-领取后-延迟生效天数
          activeDays, // 使用有效期-领取后-有效天数
        } = goodsItem;
        return (
          <>
            <div className={styles.listItem_img}>
              <div className={styles.listItem_price}>￥{couponValue}</div>
              <div className={styles.listItem_tp}>满{thresholdPrice}元可用</div>
            </div>
            <div className={styles.listItem_info}>
              <div>
                <span className={styles.listItem_tag}>
                  {PLATFORM_TICKET_TYPE[useScenesType][classType]}
                </span>
                {couponName}
              </div>
              <div>
                {(activeDateStr && endDateStr) || (activeDate && endDate)
                  ? `${activeDateStr || activeDate} - ${endDateStr || endDate}`
                  : delayDays != 0
                  ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                  : `有效期：领取后${activeDays}天内`}
              </div>
              <div>{platformCouponId}</div>
              <div style={{ color: '#b1b1b1' }}>剩余{remain}张</div>
            </div>
          </>
        );
      })()}
      {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
    </Space>
  );
};

export default FormList;
