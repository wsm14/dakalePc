import React from 'react';

// 回显dom
export default ({ styleIndex = 0, list = [] }) => {
  return [
    <div style={{ padding: '4px 12px 16px 12px' }}>
      {list.map((item) => (
        <div
          key={item.specialGoodsId}
          style={{
            width: '100%',
            borderRadius: 4,
            background: '#FFFFFF',
            padding: 8,
            display: 'flex',
            marginTop: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              marginRight: 8,
              background: `url(${item.goodsImg})`,
              backgroundSize: 'cover',
              borderRadius: 4,
            }}
          ></div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 14,
                color: '#333333',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {item.goodsName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#999999',
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <img
                style={{
                  borderRadius: '50%',
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  backgroundColor: '#f5f5f5',
                }}
                src={item.ownerImg}
              ></img>
              {item.ownerName}
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#999999', marginTop: 16 }}>
                  原价: <span style={{ textDecoration: 'line-through' }}>¥{item.realPrice}</span>
                </div>
                <div style={{ fontSize: 12, color: '#333333', marginTop: 4 }}>
                  优惠价:
                  <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.oriPrice}</span>
                </div>
              </div>
              <div
                style={{
                  width: 52,
                  height: 27,
                  background: '#EF476F',
                  borderRadius: 13,
                  color: '#FFFFFF',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                抢购
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>,
  ][styleIndex];
};
