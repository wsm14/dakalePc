import React from 'react';

// 回显dom
export default ({ styleIndex = 0, list = [] }) => {
  const disFlexAC = {
    display: 'flex',
    alignItems: 'center',
  };

  // 设计图 750 这里 350 设计图/2
  return [
    <div key="vgoods" style={{ padding: '12px 12px 0.1px', backgroundColor: '#FFFFFF' }}>
      {list.map((item, i) => (
        <div
          key={`${item.goodsId}${i}`}
          style={{
            marginBottom: 12,
            borderRadius: 4,
            ...disFlexAC,
            backgroundColor: '#FFFFFF',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              marginRight: 8,
              borderRadius: 4,
              backgroundColor: '#D8D8D8',
              background: `url(${item.goodsImg}) center/cover`,
            }}
          ></div>
          <div style={{ flex: 1, overflow: 'hidden', height: 112 }}>
            <div
              style={{
                fontSize: 14,
                lineHeight: '20px',
                display: '-webkit-box',
                color: '#333333',
                overflow: 'hidden',
                whiteSpace: 'normal',
                textOverflow: 'clip',
                wordWrap: 'break-word',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.goodsName}
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 4,
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
                src={item.relateImg}
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
                {item.relateName}
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    marginTop: 15,
                    lineHeight: 1,
                    fontWeight: 'bold',
                    color: '#333333',
                    ...disFlexAC,
                  }}
                >
                  {
                    {
                      defaultMode: `¥${item.sellPrice}`,
                      cashMode: `¥${item.sellPrice}`,
                      self: (
                        <>
                          <span>
                            ¥{item.sellPrice}+{item.sellBean}
                          </span>
                          <span style={{ fontSize: 12, marginLeft: 2 }}>卡豆</span>
                        </>
                      ),
                      free: '¥0',
                    }[item.paymentModeType]
                  }
                </div>
                {item.paymentModeType === 'defaultMode' && (
                  <div
                    style={{
                      height: 18,
                      marginTop: 4,
                      borderRadius: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#FEF1F4',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 'inherit',
                        backgroundImage:
                          'url(https://wechat-config.dakale.net/miniprogram/image/icon895.png)',
                        backgroundSize: 'contain',
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#ef476f',
                        padding: '0 4px',
                      }}
                    >
                      ￥0
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  minWidth: 60,
                  height: 26,
                  fontSize: 14,
                  padding: '0 8px',
                  borderRadius: 13,
                  ...disFlexAC,
                  color: '#FFFFFF',
                  background: '#EF476F',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
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
      key="hgoods"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '8px 12px',
      }}
    >
      {list.map((item) => (
        <div
          key={item.goodsId}
          style={{
            width: 172,
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            marginBottom: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: 137,
              background: `url(${item.goodsImg}) center/cover`,
            }}
          ></div>
          <div
            style={
              item.paymentModeType === 'defaultMode'
                ? { padding: '5px 8px 12px' }
                : { padding: '5px 8px 15px' }
            }
          >
            <div
              style={{
                height: 44,
                fontSize: 16,
                color: '#333333',
                lineHeight: '22px',
                display: '-webkit-box',
                overflow: 'hidden',
                whiteSpace: 'normal',
                textOverflow: 'clip',
                wordWrap: 'break-word',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.goodsName}
            </div>
            <div
              style={{
                marginTop: 3,
                ...disFlexAC,
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
                src={item.relateImg}
              ></img>
              <div
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: '#999999',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 'initial',
                }}
              >
                {item.relateName}
              </div>
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333333',
                lineHeight: 'initial',
                ...disFlexAC,
              }}
            >
              {
                {
                  defaultMode: `¥${item.sellPrice}`,
                  cashMode: `¥${item.sellPrice}`,
                  self: (
                    <>
                      <span>
                        ¥{item.sellPrice}+{item.sellBean}
                      </span>
                      <span style={{ fontSize: 12, marginLeft: 2 }}>卡豆</span>
                    </>
                  ),
                  free: '¥0',
                }[item.paymentModeType]
              }
            </div>
            {item.paymentModeType === 'defaultMode' && (
              <div style={disFlexAC}>
                <div
                  style={{
                    height: 18,
                    marginTop: 6,
                    maxWidth: 97,
                    marginRight: 4,
                    borderRadius: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#FEF1F4',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 'inherit',
                      backgroundImage:
                        'url(https://wechat-config.dakale.net/miniprogram/image/icon895.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      flexShrink: 0,
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#ef476f',
                      padding: '0 4px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    ￥0
                  </div>
                </div>
                <div
                  style={{
                    height: 18,
                    marginTop: 6,
                    borderRadius: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#FEF1F4',
                    marginRight: 4,
                    flex: 1,
                    maxWidth: 'fit-content',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      backgroundSize: '12px 10px',
                      height: 'inherit',
                      backgroundImage:
                        'url(https://wechat-config.dakale.net/miniprogram/image/z_icon.png)',
                      backgroundColor: '#FCE2E8',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#ef476f',
                      padding: '0 4px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    ￥0
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>,
  ][styleIndex];
};
