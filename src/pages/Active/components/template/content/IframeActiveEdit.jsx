import React, { useContext } from 'react';
import IframeEditor from '@/components/IframeEditor';

const IframeActiveEdit = (props) => {
  const { context, iref } = props;

  const { showEditor, showPanel, dispatchData } = useContext(context);

  const { type, name, moduleEditData, id } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => {
    dispatchData({ type: 'closeEditor' });
  };

  // 向 iframe 发送数据
  const handleSendMessage = (values) => {
    console.log('send to iframe', { type: values.messageType, payload: values });
    iref.current.contentWindow.postMessage({ type: values.messageType, payload: values }, '*');
    dispatchData({ type: 'saveModuleData', payload: values });
    handleCloseEdit();
  };

  return (
    <>
      {type && (
        <IframeEditor
          key={id}
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
