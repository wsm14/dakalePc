import React from 'react';

// 回显dom
export default ({ styleIndex = 0, list = [] }) => {
  const disFlexAC = {
    display: 'flex',
    alignItems: 'center',
  };

  return [
    <div style={{ padding: '4px 12px 16px' }}>
      {list.map((item) => (
        <div
          style={{
            padding: 8,
            marginTop: 12,
            borderRadius: 4,
            width: '100%',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              ...disFlexAC,
              width: '100%',
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                marginRight: 8,
                borderRadius: 2,
                background: `url(${item.coverImg}) center/cover`,
                backgroundColor: '#f5f5f5',
              }}
            ></div>
            <div style={{ fontSize: 12, flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#333333',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.merchantName}
              </div>
              {item.businessTime && (
                <div
                  style={{
                    fontSize: 14,
                    color: '#108588',
                    backgroundColor: '#10858817',
                    padding: '3px 4px',
                    marginTop: 10,
                    width: 'fit-content',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>营业时间</span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 1,
                      height: 10,
                      background: '#1085884d',
                      margin: '0 4px',
                    }}
                  ></span>
                  <span style={{ color: '#108588' }}>{item.businessTime}</span>
                </div>
              )}
              {item.perCapitaConsumption && (
                <div style={{ color: '#999999', marginTop: 10 }}>
                  人均￥{item.perCapitaConsumption}
                </div>
              )}
              <div style={{ color: '#999999', marginTop: 10, display: 'flex' }}>
                {item.topCategoryName && (
                  <div style={{ marginRight: 10 }}>{item.topCategoryName}</div>
                )}
                <div
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.address}
                </div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#333333', display: 'flex' }}>
            {item.totalMarkBean && (
              <div style={{ margin: '12px 0 4px', ...disFlexAC }}>
                <img
                  style={{ width: 15 }}
                  src="https://resource-new.dakale.net/admin/image/merchant/beans.png"
                ></img>
                <span
                  style={{
                    color: '#EF476F',
                    margin: '0 8px 0 4px',
                  }}
                >
                  打卡捡豆{item.totalMarkBean}
                </span>
              </div>
            )}
            {item.onSellGoodsNum && (
              <div style={{ margin: '12px 0 4px', ...disFlexAC }}>
                <img
                  style={{ width: 16 }}
                  src="https://resource-new.dakale.net/admin/image/merchant/odds.png"
                ></img>
                <span
                  style={{
                    margin: '0 8px 0 4px',
                  }}
                >
                  {item.onSellGoodsNum}款特惠热卖中
                </span>
              </div>
            )}
            {item.onSellCouponList && (
              <div style={{ margin: '12px 0 4px', flex: 1, overflow: 'hidden', ...disFlexAC }}>
                <img
                  style={{ width: 16 }}
                  src="https://resource-new.dakale.net/admin/image/merchant/bond.png"
                ></img>
                <span
                  style={{
                    margin: '0 8px 0 4px',
                    flex: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.onSellCouponList.map((i) => `${i.buyPrice}元代${i?.reduceObject?.couponPrice}元`).join('，')}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>,
  ][styleIndex];
};
