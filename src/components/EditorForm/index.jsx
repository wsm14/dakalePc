import React, { useState, useEffect, useRef } from 'react';
import Editor from 'wangeditor';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import imageCompress from '@/utils/imageCompress';
import aliOssUpload from '@/utils/aliOssUpload';
import styles from './style.less';

let editor = '';

// 富文本隐藏的工具栏
const TEXT_SET_TOOL = [
  'todo', // 代办事项
  'quote', // 引用
  'emoticon', // 表情
  'video', // 插入视频
  'code', // 插入代码
];

const EditorForm = ({
  content,
  maxImgSize = 1000,
  AllImgSize = 5000,
  editClass,
  contentClass,
  editCallback,
  maxLength = 0,
  // dispatch,
}) => {
  EditorForm.defaultProps = {
    content: '',
    maxImgSize: 1,
    AllImgSize: 5000,
    editClass: undefined,
    contentClass: undefined,
    maxLength: 0,
  };

  EditorForm.propTypes = {
    content: PropTypes.string,
    maxImgSize: PropTypes.number,
    AllImgSize: PropTypes.number,
    maxLength: PropTypes.number,
    editClass: PropTypes.string,
    contentClass: PropTypes.string,
    editCallback: PropTypes.func.isRequired,
  };

  // 菜单ref
  const refTool = useRef(null);
  // 编辑区域ref
  const refEdit = useRef(null);
  // 文本统计
  const [textLength, setTextLength] = useState(0);

  // maxleng存在时超长 编辑区域警告样式
  const maxTextError = textLength > maxLength ? styles.maxlength_box_red : '';

  // maxleng存在时超长 数字警告样式
  const maxNumberError = textLength > maxLength ? styles.maxlength_red : {};

  // 自定义方法
  const customhandle = {
    // 赋值粘贴文本a标签替换
    pasteText: (contents) => {
      const newtext = contents
        .replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '')
        .replace(/<a/g, '<p')
        .replace(/<\/a/g, '</p')
        .replace(/<xml>[\s\S]*?<\/xml>/gi, '')
        .replace(/<style>[\s\S]*?<\/style>/gi, '')
        .replace(/<\/?[^>]*>/g, '')
        .replace(/[ | ]*\n/g, '\n')
        .replace(/&nbsp;/gi, '')
        .replace(/\s+/g, '');
      return newtext;
    },
    // 自定义提示
    alert: (info) => {
      Modal.info({
        title: info,
      });
    },
    // 自定义图片上传
    uploadImg: (files, insert) => {
      // files 是 input 中选中的文件列表
      const fileArr = [];
      files.map((item, i) =>
        imageCompress(item).then(({ file }) => {
          fileArr.push(file);
          if (i === files.length - 1) {
            aliOssUpload(fileArr).then((res) => {
              // 上传代码返回结果之后，将图片插入到编辑器中
              res.map((item) => {
                insert(item);
              });
            });
          }
        }),
      );
    },
    // 富文本内容修改回调
    change: (html) => {
      if (editCallback) editCallback(html, editor.txt.text());
      if (maxLength !== 0) setTextLength(editor.txt.text().length);
    },
  };

  const editorCreate = () => {
    const elemtb = refTool.current;
    const elem = refEdit.current;
    editor = new Editor(elemtb, elem);
    editor.config.excludeMenus = TEXT_SET_TOOL; // 剔除菜单
    editor.config.uploadImgMaxSize = maxImgSize * 1024 * 1024; // 图片大小限制
    editor.config.pasteIgnoreImg = true; // 忽略粘贴内容中的图片
    editor.config.showLinkImg = false; // 隐藏“网络图片”tab
    editor.config.zIndex = 100; // 配置编辑区域的 z-index
    editor.config.uploadImgMaxLength = 3; // 上传图片数量
    editor.config.pasteFilterStyle = true; // 过滤掉复制文本的样式
    editor.config.pasteTextHandle = customhandle['pasteText']; // 赋值粘贴文本a标签替换
    editor.config.customUploadImg = customhandle['uploadImg']; // 自定义图片上传
    editor.config.customAlert = customhandle['alert']; // 自定义提示
    editor.config.onchange = customhandle['change']; // 富文本内容修改回调
    editor.create(); // 初始化
    editor.txt.html(content); // 初始化富文本内容
    maxLength !== 0 && content && editor.change(); // 统计一次数值
  };

  useEffect(() => {
    editorCreate();
  }, []);

  return (
    <div className={`${styles.editor} ${editClass}`}>
      {/* 菜单区域 */}
      <div ref={refTool} className={styles.toolbar} />
      <div className={styles.padd} />
      {/* 编辑区域 */}
      <div ref={refEdit} className={`${styles.content} ${contentClass} ${maxTextError}`} />
      {/* 数值统计 */}
      {maxLength != 0 && (
        <div style={{ textAlign: 'right' }}>
          <span className={maxNumberError}>{textLength}</span> / {maxLength}
        </div>
      )}
    </div>
  );
};

export default EditorForm;
