import React, { useState, useEffect, useContext } from 'react';
import styles from '../style.less';

const IframeActiveEdit = (props) => {
  const { context } = props;

  const { moduleData, dispatchData, componentsShow } = useContext(context);
  const { showActiveEditor = { type: '' } } = moduleData;
  const { type } = showActiveEditor;

  return <> {type && <div className={styles.previewer_active_editor}></div>}</>;
};

export default IframeActiveEdit;
