import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';

const ActiveTemplate = () => {
  const [visible, setVisible] = useState({ show: false, info: {} });

  /**
   * 模版选项
   * @img 封面图片
   * @templateUrl 模版链接
   * @id 模版id
   * @title 模版说明标题
   */
  const cardItem = [
    {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      templateUrl: 'https://web-new.dakale.net/dakale-web-exercise/page/demo.html',
      id: '1',
      title: '活动模版1',
    },
  ];

  return (
    <>
      <Card>
        <Row gutter={[75, 28]}>
          {cardItem.map((item) => (
            <Col key={item.id}>
              <Card
                cover={<img alt="example" src={item.img} />}
                actions={[
                  <div onClick={() => setVisible({ show: true, info: item })}>使用模版</div>,
                ]}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <ActiveTemplateEdit visible={visible} onClose={() => setVisible(false)}></ActiveTemplateEdit>
    </>
  );
};

export default ActiveTemplate;
