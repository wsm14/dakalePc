import React, { useState, useEffect, useRef } from 'react';
import Editor from 'wangeditor';
// import Editor from 'wangeditor-dx/release/wangEditor';
import { Spin, Modal, Alert } from 'antd';
// import router from 'umi/router';
import PropTypes from 'prop-types';
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
  maxImgSize = 500,
  AllImgSize = 5000,
  editClass,
  contentClass,
  setContent,
  // dispatch,
}) => {
  EditorForm.defaultProps = {
    content: '',
    fileApi: '/admin/file/uploads',
    maxImgSize: 500,
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
  const [spinning, setSpinning] = useState(false); // 富文本内容上传图片等待
  const [imgsize, setImgsize] = useState(0); // 图片已上传大小
  const [imgsizeobj, setImgsizeobj] = useState([]); // 图片已上传url 和 size 保存

  const setEditor = () => {
    const elemtb = refTb.current;
    const elem = refFa.current;
    editor = new Editor(elemtb, elem);
    editor.customConfig.menus = TEXT_SET_TOOL;
    editor.customConfig.uploadImgServer = `${APIURL}${fileApi}`; // 上传服务器api
    editor.customConfig.uploadFileName = 'files'; // 上传formdata参数名
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
      const imgsave = imgsizeobj.filter((item) => html.indexOf(item.url) !== -1);
      // 计算富文本内图片大小
      setImgsize(imgsave.length ? imgsave.map((items) => items.size).reduce((a, b) => a + b) : 0);
      // 保存剩余图片数据
      setImgsizeobj(imgsave);
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
    // // 自定义上传请求
    // editor.customConfig.customUploadImg = (files, insert) => {
    //   // 上传文件前获取文件大小数据
    //   const allSize = files.map(item => item.size / 1024).reduce((a, b) => a + b);
    //   // 已保存图片文件大小
    //   const size = imgsizeobj.length
    //     ? imgsizeobj.map(items => items.size).reduce((a, b) => a + b)
    //     : 0;
    //   // 计算大小防止过大
    //   setSpinning(true);
    //   if (size + allSize > AllImgSize) {
    //     return {
    //       prevent: true,
    //       msg: `图片大小超过${AllImgSize}kb`,
    //     };
    //   }
    //   const formData = new FormData();
    //   files.forEach(item => {
    //     formData.append('files', item);
    //   });
    //   dispatch({
    //     type: 'storeInfo/fetchFileUpload',
    //     payload: formData,
    //     callback: data => {
    //       // eslint-disable-next-line array-callback-return
    //       data.map(item => {
    //         insert(item.fileUrl);
    //         // 插入图片保存该图片唯一URL 和大小 用于识别计算
    //         imgsizeobj.push({
    //           url: item.fileUrl,
    //           size: item.fileSize * 1024,
    //         });
    //       });
    //       setSpinning(false);
    //     },
    //   });
    //   return undefined;
    // };
    editor.customConfig.uploadImgHooks = {
      before(xhr, editors, files) {
        // 上传文件前获取文件大小数据
        const allSize = files.map((item) => item.size / 1024).reduce((a, b) => a + b);
        // 已保存图片文件大小
        const size = imgsizeobj.length
          ? imgsizeobj.map((items) => items.size).reduce((a, b) => a + b)
          : 0;
        // 计算大小防止过大
        setSpinning(true);
        if (size + allSize > AllImgSize) {
          return {
            prevent: true,
            msg: `图片大小超过${AllImgSize}kb`,
          };
        }
        return undefined;
      },
      // 回显 插入 图片
      customInsert(insertImg, result) {
        const { data: imgdata, code, message } = result;
        if (code === 21008 || code === 21001) {
          Modal.warning({
            title: message,
            okText: code === 21008 ? '去登录' : '确定',
            onOk: () => {
              Modal.destroyAll();
              // router.push('/user/login');
            },
          });
          return;
        }
        setSpinning(false);
        // eslint-disable-next-line array-callback-return
        imgdata.map((item) => {
          insertImg(item.fileUrl);
          // 插入图片保存该图片唯一URL 和大小 用于识别计算
          imgsizeobj.push({
            url: item.fileUrl,
            size: item.fileSize * 1024,
          });
        });
      },
    };
    editor.customConfig.customAlert = (info) => {
      setSpinning(false);
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
    <Spin tip="上传图片中，请勿操作..." spinning={spinning}>
      <div className={`${styles.editor} ${editClass}`}>
        <div ref={refTb} className={styles.toolbar} />
        <div className={styles.padd} />
        <div ref={refFa} className={`${styles.content} ${contentClass}`} />
      </div>
    </Spin>
  );
};

export default EditorForm;