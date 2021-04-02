import { notification, message } from 'antd';
import lodash from 'lodash';
import oss from 'ali-oss';
import request from './request';
import { uuid } from './utils';

/**
 * oss 文件上传
 * @param {*} file 文件数据 File Blob string | File[] Blob[] string[] | { file:UploadFile, fileList: object[] }
 * 本地文件流数组          | 单文件    | 路径( 字符串 | 数组 )（原样即刻返回）                     | upload组件数据
 * [File[100],File[100]] | File[100] | 'http://img.com' | ['http://img.com','http://img.com'] | {file:File[100], fileList: [{originFileObj:File[100]},{originFileObj:File[100]}]}
 * @param fieldNames 对象别名 默认upload原始数据字段 { listKey = 'fileList', originFileObj = 'originFileObj', url = 'url' }
 * @param policyType oss凭证获取类型 string image上传图片
 * @param ossType oss执行操作类型 string put上传
 * @param {*} return 返回Promise对象 array 按顺序返回文件url数组
 */

//  错误提醒
const notificationInfo = (info) => {
  message.destroy();
  notification.info({
    message: '温馨提示',
    description: info,
  });
  return new Promise((reject) => reject('error'));
};

// 获取oss凭证
const fetchGetOssPolicy = async ({ policyType, ossType }) => {
  // 上传类型
  const uploadType = { image: 'resource', app: '' }[policyType];

  const res = await request('/common/oss/getOssPolicy', { params: { uploadType } });
  if (!res) {
    notificationInfo('common OSS服务未启动');
    return;
  }
  const { folder, host, securityToken: stsToken } = res.content;
  // oss sdk实例化
  const client = new oss({ region: 'oss-cn-hangzhou', stsToken, ...res.content });
  return async (file) => {
    // 设置路径 + 文件名 + 文件后缀
    let _fileRath = `${folder}/${uuid()}${file['name'].replace(/.+\./, '.')}`;
    // 提交文件
    if (ossType === 'put') {
      const putres = await client.put(_fileRath, file);
      const { status, statusCode } = putres.res;
      if (status === 200 && statusCode === 200) {
        return host + _fileRath;
      } else {
        message.destroy();
        return false;
      }
    }
  };
};

// 上传文件
const aliOssUpload = async (file = '', fieldNames = {}, policyType = 'image', ossType = 'put') => {
  // file 默认是数组直接赋值
  let fileDataArray = file || [];

  // 预处理file数据 无论如何 处理成数组形式
  if (ossType === 'put') {
    if (typeof file === 'string') {
      message.destroy();
      // file 是字符串直接返回 （已经上传的文件生成了http信息）
      message.destroy();
      return new Promise((resolve) => resolve(file));
    } else if (file instanceof Blob || file instanceof File) {
      // file 是单个文件 File[100]
      fileDataArray = [file];
    } else if (lodash.isPlainObject(file)) {
      // file 是原始对象 {file:File[100], fileList: [{url:'http://img.com'},{originFileObj:File[100]}]}
      const { listKey = 'fileList', originFileObj = 'originFileObj', url = 'url' } = fieldNames;
      fileDataArray = file[listKey].map((item) => item[originFileObj] || item[url]);
    }
  }

  message.loading('文件上传中......', 0);
  // 向后台获取oss凭证 后上传文件
  const osshandle = await fetchGetOssPolicy({ policyType, ossType });
  // 最后返回文件url数组
  const fileUrlArray = [];
  // 文件数组遍历
  for (const item_1 of fileDataArray) {
    if (typeof item_1 === 'string') {
      fileUrlArray.push(item_1);
    } else {
      await osshandle(item_1).then((res) => {
        if (!res) {
          notificationInfo('文件上传失败');
          return;
        }
        fileUrlArray.push(res);
      });
    }
  }
  message.destroy();
  return fileUrlArray;
};

export default aliOssUpload;
