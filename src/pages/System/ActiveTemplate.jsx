import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import StrollTemplateEdit from './components/Walking/StrollTemplate/StrollTemplateEdit';

const ActiveTemplate = () => {
  const [visible, setVisible] = useState({ show: false, info: {} });

  /**
   * 模版选项
   * @img 封面图片
   * @type 模版类型
   * @title 模版说明标题
   */
  const cardItem = [
    {
      img: '',
      type: 'public',
      title: '支持定制各类节日、主题活动，包括商品类，券类，店铺类以及组合模板',
    },
  ];

  // 选择活动 设置活动名称
  const handleSelectActive = () => setVisible({ show: true, info: { activityName: '111' } }); // 显示模版编辑

  return (
    <>
      <Card>
        <Row gutter={[75, 28]}>
          {cardItem.map((item) => (
            <Col key={item.type}>
              <Card
                cover={<img alt="example" src={item.img} style={{ width: 266, height: 160 }} />}
                actions={[<div onClick={() => handleSelectActive(item)}>使用模版</div>]}
                bodyStyle={{ maxWidth: 265 }}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {/* 活动模版编辑区域 */}
      <StrollTemplateEdit
        key="template"
        visible={visible}
        onClose={() => setVisible(false)}
      ></StrollTemplateEdit>
    </>
  );
};

export default connect()(ActiveTemplate);
