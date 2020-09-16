import React, { useContext } from 'react';
import IframeEditor from '@/components/IframeEditor';

const IframeActiveEdit = (props) => {
  const { context } = props;

  const { showEditor, showPanel, dispatchData } = useContext(context);

  const { type } = showEditor;

  // 关闭编辑框
  const handleCloseEdit = () => dispatchData({ type: 'closeEditor' });

  const handleOnSave = (values) => {
    console.log(values);
  };

  return (
    <>
      {type && (
        <IframeEditor
          showPanel={showPanel}
          type={type}
          onClose={handleCloseEdit}
          onSave={handleOnSave}
        ></IframeEditor>
      )}
    </>
  );
};

export default IframeActiveEdit;
