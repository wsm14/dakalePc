import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import EditorForm from '@/components/EditorForm';

const ServiceFeedBack = (props) => {
  return (
    <Card>
      <EditorForm
      // content={content}
      // setContent={setContent}
      // editClass={styles.editor}
      // contentClass={styles.editor_content}
      ></EditorForm>
    </Card>
  );
};

export default connect()(ServiceFeedBack);
