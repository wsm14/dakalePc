import React, { useContext } from 'react';
import { Collapse, Radio } from 'antd';
import panelItem from './panelItem';
import styles from '../style.less';

const { Panel } = Collapse;

const ActiveTemplateLeft = (props) => {
  const { context } = props;
  const {
    // 组件选项打开类型
    showPanel: { id, ptype },
    showEditor,
    dispatchData,
    componentsShow,
  } = useContext(context);

  // 选择组件 向reducer储存当前选择组件，显示组件编辑面板
  const handlePanelChange = (e) => {
    dispatchData({
      type: 'showEditor',
      payload: {
        id, // 需要编辑的组件id
        type: e.target.value,
      },
    });
  };

  return (
    <>
      {componentsShow && (
        <div className={styles.active_Template_Left}>
          <Collapse bordered={false} activeKey={[ptype]}>
            {panelItem.map((item) => (
              <Panel
                forceRender
                header={item.header}
                key={item.type}
                disabled={ptype !== item.ptype}
              >
                <Radio.Group
                  value={showEditor.type}
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
