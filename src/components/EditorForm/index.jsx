import React, { useState, useEffect, useRef } from 'react';
import Editor from 'wangeditor';
// import Editor from 'wangeditor-dx/release/wangEditor';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import imageCompress from '@/utils/imageCompress';
import aliOssUpload from '@/utils/aliOssUpload';
import styles from './style.less';

let editor = '';

// 富文本工具栏
const TEXT_SET_TOOL = [
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'fontName', // 字体
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'backColor', // 背景颜色
  'link', // 插入链接
  // 'list', // 列表
  'justify', // 对齐方式
  // 'quote', // 引用
  // 'emoticon', // 表情
  'image', // 插入图片
  'table', // 表格
  // 'video', // 插入视频
  // 'code', // 插入代码
  'undo', // 撤销
  'redo', // 重复
];

const EditorForm = ({
  content,
  fileApi = '/admin/file/uploads',
  maxImgSize = 1000,
  AllImgSize = 5000,
  editClass,
  contentClass,
  setContent,
  // dispatch,
}) => {
  EditorForm.defaultProps = {
    content: '',
    fileApi: '/admin/file/uploads',
    maxImgSize: 1000,
    AllImgSize: 5000,
    editClass: undefined,
    contentClass: undefined,
  };

  EditorForm.propTypes = {
    content: PropTypes.string,
    fileApi: PropTypes.string,
    maxImgSize: PropTypes.number,
    AllImgSize: PropTypes.number,
    editClass: PropTypes.string,
    contentClass: PropTypes.string,
    setContent: PropTypes.func.isRequired,
  };

  const refTb = useRef(null);
  const refFa = useRef(null);

  const setEditor = () => {
    const elemtb = refTb.current;
    const elem = refFa.current;
    editor = new Editor(elemtb, elem);
    editor.customConfig.menus = TEXT_SET_TOOL;
    // editor.customConfig.uploadImgServer = `${APIURL}${fileApi}`; // 上传服务器api
    // editor.customConfig.uploadFileName = 'files'; // 上传formdata参数名
    editor.customConfig.uploadImgMaxSize = (maxImgSize / 1000) * 1024 * 1024; // 图片大小限制
    editor.customConfig.withCredentials = true; // 跨域传递 cookie
    editor.customConfig.pasteIgnoreImg = true; // 忽略粘贴内容中的图片
    editor.customConfig.showLinkImg = false; // 隐藏“网络图片”tab
    editor.customConfig.zIndex = 100; // 配置编辑区域的 z-index
    editor.customConfig.uploadImgMaxLength = 3; // 上传图片数量
    editor.customConfig.pasteFilterStyle = true;
    editor.customConfig.onchange = (html) => {
      if (setContent) setContent(html === '<p><br></p>' ? '' : html);
      // 填充html数据后获取剩余图片数据
    }; // 回显 保存 html
    editor.customConfig.pasteTextHandle = (contents) => {
      // 赋值粘贴文本a标签替换
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
    };
    editor.customConfig.customUploadImg = function (files, insert) {
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
    };
    editor.customConfig.customAlert = (info) => {
      // info 是需要提示的内容
      Modal.info({
        title: info,
      });
    };
    editor.create(); // 初始化
    editor.txt.html(content); // 初始化富文本内容
  };

  useEffect(() => {
    setEditor();
  }, []);

  return (
    <div className={`${styles.editor} ${editClass}`}>
      <div ref={refTb} className={styles.toolbar} />
      <div className={styles.padd} />
      <div ref={refFa} className={`${styles.content} ${contentClass}`} />
    </div>
  );
};

export default EditorForm;
