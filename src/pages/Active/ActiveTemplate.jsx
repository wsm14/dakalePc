import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';
import ActiveTemplateNameSet from './components/template/ActiveTemplateNameSet';

const ActiveTemplate = () => {
  const [visible, setVisible] = useState({ show: false, info: {} });
  const [visibleName, setVisibleName] = useState({ show: false, info: { activeName: '' } });

  /**
   * 模版选项
   * @img 封面图片
   * @type 模版类型
   * @title 模版说明标题
   */
  const cardItem = [
    {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      type: 'public',
      title: '通用模版',
    },
  ];

  // 选择活动 设置活动名称
  const handleSelectActive = (item) => setVisibleName({ show: true, info: item });

  // 输入活动名称回调
  const handleSetActiveName = (activeName) => {
    setVisibleName(false); // 关闭输入框
    setVisible({ show: true, info: { ...visibleName.info, activeName } }); // 显示模版编辑
  };

  return (
    <>
      <Card>
        <Row gutter={[75, 28]}>
          {cardItem.map((item) => (
            <Col key={item.type}>
              <Card
                cover={<img alt="example" src={item.img} />}
                actions={[<div onClick={() => handleSelectActive(item)}>使用模版</div>]}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {/* 设置活动名称 */}
      <ActiveTemplateNameSet
        visible={visibleName}
        callback={handleSetActiveName}
        onClose={() => setVisibleName(false)}
      ></ActiveTemplateNameSet>
      {/* 活动模版编辑区域 */}
      <ActiveTemplateEdit
        key="template"
        visible={visible}
        onClose={() => setVisible(false)}
      ></ActiveTemplateEdit>
    </>
  );
};

export default connect()(ActiveTemplate);
