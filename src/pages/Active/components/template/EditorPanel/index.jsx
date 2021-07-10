import React, { useEffect, useState, useContext } from 'react';
import { Collapse, Radio } from 'antd';
import panelItem from './panelItem';
import styles from '../style.less';

const { Panel } = Collapse;

const EditorPanel = (props) => {
  const { context } = props;
  const {
    // 组件选项打开类型
    showPanel: { id, ptype },
    iframeHeight,
    moduleData,
    showEditor,
    dispatchData,
    componentsShow,
  } = useContext(context);

  const [pActive, setPactive] = useState([ptype]);

  // 当组件显示时判断数据是否已经输入过 输入过则显示
  useEffect(() => {
    setPactive([ptype]);
    const checkData = moduleData.filter((i) => i.id === id);
    if (checkData.length) {
      dispatchData({
        type: 'showEditor',
        payload: {
          id: checkData[0].id, // 需要编辑的组件id
          type: checkData[0].type,
          moduleEditData: checkData[0].content,
        },
      });
    }
  }, [id]);

  // 选择组件 向reducer储存当前选择组件，显示组件编辑面板
  const handlePanelChange = (e, ftype) => {
    const nowID = ftype === 'public' ? e.target.value : id;
    if (ftype === 'public') {
      dispatchData({
        type: 'showPanel',
        payload: {
          id: e.target.value, // 组件id
          type: 'script', // 组件类型
          height: iframeHeight, // 组件高
          ptype: ftype, // 组件选项面板类型
        },
      });
    }
    const checkData = moduleData.filter((i) => i.id === nowID);
    dispatchData({
      type: 'showEditor',
      payload: {
        id: nowID, // 需要编辑的组件id
        type: e.target.value,
        moduleEditData: checkData.length
          ? checkData[0].type === e.target.value
            ? checkData[0].content
            : undefined
          : undefined,
      },
    });
  };

  return (
    <>
      {componentsShow && (
        <div className={styles.active_Template_right}>
          <Collapse bordered={false} activeKey={pActive} onChange={(val) => setPactive(val)}>
            {panelItem.map((item) => (
              <Panel
                forceRender
                header={item.header}
                key={item.type}
                // disabled={ptype !== item.ptype}
              >
                <Radio.Group
                  value={showEditor.type}
                  className={styles.aT_Left_RadioGroup}
                  onChange={(e) => handlePanelChange(e, item.type)}
                  disabled={ptype !== item.type && item.type !== 'public'}
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

export default EditorPanel;
