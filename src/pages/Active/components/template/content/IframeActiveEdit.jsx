import React, { useContext } from 'react';
import IframeEditor from '@/components/IframeEditor';

const IframeActiveEdit = (props) => {
  const { context, iref } = props;

  const { showEditor, showPanel, dispatchData } = useContext(context);

  const { type, name, moduleEditData } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => {
    dispatchData({ type: 'closeEditor' });
  };

  // 向 iframe 发送数据
  const handleSendMessage = (values) => {
    iref.current.contentWindow.postMessage({ type: 'save', payload: values }, '*');
    dispatchData({ type: 'saveModuleData', payload: values });
    handleCloseEdit();
  };

  return (
    <>
      {type && (
        <IframeEditor
          showPanel={showPanel}
          type={type}
          name={name}
          initialValues={moduleEditData}
          onClose={handleCloseEdit}
          onSave={handleSendMessage}
        ></IframeEditor>
      )}
    </>
  );
};

export default IframeActiveEdit;
