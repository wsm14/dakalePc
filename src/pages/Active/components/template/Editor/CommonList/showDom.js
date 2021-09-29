import React from 'react';

// 回显dom
export default ({ styleIndex = 0, list = [] }) => {
  const disFlexAC = {
    display: 'flex',
    alignItems: 'center',
  };

  return [
    <div style={{ padding: '4px 12px 16px 12px' }}>
      {list.map((item) => (
        <div
          key={item.specialGoodsId}
          style={{
            padding: 8,
            marginTop: 12,
            borderRadius: 4,
            ...disFlexAC,
            width: '100%',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              marginRight: 8,
              borderRadius: 4,
              background: `url(${item.goodsImg}) center/cover`,
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
                marginTop: 8,
                ...disFlexAC,
                color: '#999999',
              }}
            >
              <img
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                }}
                src={item.ownerImg}
              ></img>
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 'initial',
                }}
              >
                {item.ownerName}
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, marginTop: 16, color: '#999999' }}>
                  原价: <span style={{ textDecoration: 'line-through' }}>¥{item.oriPrice}</span>
                </div>
                <div style={{ fontSize: 12, marginTop: 7, color: '#333333' }}>
                  优惠价:
                  <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.realPrice}</span>
                </div>
                <div
                  style={{
                    height: 16,
                    marginTop: 6,
                    borderRadius: 8,
                    border: '1px solid #ef476f',
                    display: 'inline-flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      ...disFlexAC,
                      height: 'inherit',
                      background: '#ef476f',
                      fontSize: 10,
                      color: '#ffffff',
                      paddingLeft: 4,
                      paddingRight: 3,
                    }}
                  >
                    卡豆再省
                  </div>
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '16px solid #ef476f',
                      borderRight: '2px solid transparent',
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#ef476f',
                      background: '#ffffff',
                      borderRadius: '0px 50px 50px 0px',
                      paddingRight: 4,
                    }}
                  >
                    ￥0
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 52,
                  height: 27,
                  fontSize: 14,
                  borderRadius: 13,
                  ...disFlexAC,
                  color: '#FFFFFF',
                  background: '#EF476F',
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexWrap: 'wrap',
      }}
    >
      {list.map((item) => (
        <div
          key={item.specialGoodsId}
          style={{
            width: 172,
            background: ' #FFFFFF',
            borderRadius: 4,
            marginBottom: 12,
            padding: '4px 4px 12px',
          }}
        >
          <div
            style={{
              width: 164,
              height: 122,
              borderRadius: 2,
              background: `url(${item.goodsImg}) center/cover`,
            }}
          ></div>
          <div style={{ padding: '12px 4px 0' }}>
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
                marginTop: 8,
                ...disFlexAC,
                color: '#999999',
              }}
            >
              <img
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                }}
                src={item.ownerImg}
              ></img>
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 'initial',
                }}
              >
                {item.ownerName}
              </div>
            </div>
            <div
              style={{
                marginTop: 12,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                lineHeight: 'initial',
              }}
            >
              <span style={{ fontSize: 12, color: '#333333' }}>
                优惠价:
                <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.realPrice}</span>
              </span>
              <span style={{ fontSize: 12, marginLeft: 4, color: '#999999' }}>
                原价: <span style={{ textDecoration: 'line-through' }}>¥{item.oriPrice}</span>
              </span>
            </div>
            <div
              style={{
                height: 16,
                marginTop: 4,
                borderRadius: 8,
                border: '1px solid #ef476f',
                display: 'inline-flex',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  ...disFlexAC,
                  height: 'inherit',
                  background: '#ef476f',
                  fontSize: 10,
                  color: '#ffffff',
                  paddingLeft: 4,
                  paddingRight: 3,
                }}
              >
                卡豆再省
              </div>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '16px solid #ef476f',
                  borderRight: '2px solid transparent',
                }}
              ></div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#ef476f',
                  background: '#ffffff',
                  borderRadius: '0px 50px 50px 0px',
                  paddingRight: 4,
                }}
              >
                ￥0
              </div>
            </div>
            <div
              style={{
                width: 154,
                height: 27,
                fontSize: 14,
                marginTop: 16,
                borderRadius: 13,
                ...disFlexAC,
                color: '#FFFFFF',
                background: '#EF476F',
                justifyContent: 'center',
              }}
            >
              抢购
            </div>
          </div>
        </div>
      ))}
    </div>,
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexWrap: 'wrap',
      }}
    >
      {list.map((item) => (
        <div
          key={item.specialGoodsId}
          style={{
            width: 115,
            background: ' #FFFFFF',
            borderRadius: 3,
            marginBottom: 4,
            padding: '4px 4px 8px',
          }}
        >
          <div
            style={{
              width: 106,
              height: 79,
              borderRadius: 1,
              background: `url(${item.goodsImg}) center/cover`,
            }}
          ></div>
          <div style={{ padding: '12px 2px 0' }}>
            <div
              style={{
                fontSize: 13,
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
                marginTop: 8,
                ...disFlexAC,
                color: '#999999',
              }}
            >
              <img
                style={{
                  width: 12,
                  height: 12,
                  marginRight: 4,
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                }}
                src={item.ownerImg}
              ></img>
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 'initial',
                }}
              >
                {item.ownerName}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 12,
                color: '#999999',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                lineHeight: 'initial',
              }}
            >
              原价: <span style={{ textDecoration: 'line-through' }}>¥{item.oriPrice}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 5,
                color: '#333333',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                lineHeight: 'initial',
              }}
            >
              优惠价:
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.realPrice}</span>
            </div>
            <div
              style={{
                height: 16,
                marginTop: 4,
                borderRadius: 8,
                border: '1px solid #ef476f',
                display: 'inline-flex',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  ...disFlexAC,
                  height: 'inherit',
                  background: '#ef476f',
                  fontSize: 10,
                  color: '#ffffff',
                  paddingLeft: 4,
                  paddingRight: 3,
                }}
              >
                卡豆再省
              </div>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '16px solid #ef476f',
                  borderRight: '2px solid transparent',
                }}
              ></div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#ef476f',
                  background: '#ffffff',
                  borderRadius: '0px 50px 50px 0px',
                  paddingRight: 4,
                }}
              >
                ￥0
              </div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ border: '1 solid transparent', width: 115 }}></div>
    </div>,
  ][styleIndex];
};
