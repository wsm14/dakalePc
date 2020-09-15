import React, { useContext, useState, useEffect } from 'react';
import { Collapse, Radio } from 'antd';
import { PictureOutlined, FontSizeOutlined } from '@ant-design/icons';
import styles from '../style.less';

const { Panel } = Collapse;

const ActiveTemplateLeft = (props) => {
  const { context } = props;
  const { moduleData, dispatchData, componentsShow } = useContext(context);

  const { showPanel } = moduleData;
  const [radioValue, setRadioValue] = useState('');

  useEffect(() => {
    setRadioValue('');
  }, [showPanel]);

  const handlePanelChange = (e) => {
    setRadioValue(e.target.value);
    dispatchData({
      type: 'showActiveEditor',
      payload: {
        moduleId: 1,
        type: e.target.value,
      },
    });
  };

  const panelItem = [
    {
      header: '图片类',
      type: 'img',
      children: [
        {
          icon: <PictureOutlined style={{ fontSize: 24 }} />,
          text: '单张图片',
          type: 'solaImg',
        },
        {
          icon: <PictureOutlined style={{ fontSize: 24 }} />,
          text: '轮播图片',
          type: 'carouseal',
        },
      ],
    },
    {
      header: '文本类',
      type: 'text',
      children: [
        {
          icon: <FontSizeOutlined style={{ fontSize: 24 }} />,
          text: '标题',
          type: 'title',
        },
      ],
    },
  ];

  return (
    <>
      {componentsShow && (
        <div className={styles.active_Template_Left}>
          <Collapse bordered={false} activeKey={[showPanel]}>
            {panelItem.map((item) => (
              <Panel
                forceRender
                header={item.header}
                key={item.type}
                disabled={showPanel !== item.type}
              >
                <Radio.Group
                  value={radioValue}
                  className={styles.aT_Left_RadioGroup}
                  onChange={handlePanelChange}
                >
                  {item.children.map((children) => (
                    <Radio.Button value={children.type} key={children.text}>
                      <div className={styles.aT_Left_RadioGroup_icon}>{children.icon}</div>
                      <span>{children.text}</span>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Panel>
            ))}
          </Collapse>
        </div>
      )}
    </>
  );
};

export default ActiveTemplateLeft;
