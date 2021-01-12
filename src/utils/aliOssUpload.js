import { notification, message } from 'antd';
import oss from 'ali-oss';
import request from './request';
import { uuid } from './utils';

/**
 * oss 文件上传
 * @param {*} file 本地文件流 数组或单文件或路径（原样即刻返回）
 * file 可以是
 * 'http://img.com'
 * File[100]
 * ['http://img.com']
 * [File[100],File[100]]
 * {file:File[100], fileList: [{originFileObj:File[100]},{originFileObj:File[100]}]}
 * {file:File[100], fileList: [{url:'http://img.com'},{originFileObj:File[100]}]}
 * @param {*} return 返回Promise对象 .then返回 上传后的url数组
 */

const notificationInfo = () => {
  message.destroy();
  notification.info({
    message: '温馨提示',
    description: '文件上传失败',
  });
};

const aliOssUpload = (
  file = '',
  fieldNames = {},
  apiType = 'image',
  oldFileName,
  ossType = 'put',
) => {
  const {
    listKey = 'fileList',
    originFileObj = 'originFileObj',
    url = 'url',
    type = '.html',
  } = fieldNames;
  let fileArray = [];

  if (ossType === 'put') {
    if (typeof file === 'string') {
      return new Promise((resolve) => resolve(file));
    } else if (Array.isArray(file)) {
      fileArray = file;
    } else if (file instanceof Blob || file instanceof File) {
      fileArray = file;
    } else {
      fileArray = file[listKey].map((item) => item[originFileObj] || item[url]);
    }
    message.loading('文件上传中......', 0);
  }

  // 向后台获取oss凭证
  return request('/common/oss/getOssPolicy', {
    params: { uploadType: 'resource' },
  })
    .then((res) => {
      if (!res) {
        message.destroy();
        return;
      }
      const {
        content: { accessKeyId, accessKeySecret, securityToken: stsToken, bucket, folder, host },
      } = res;

      // oss sdk配置
      const client = new oss({
        region: 'oss-cn-hangzhou',
        accessKeyId,
        accessKeySecret,
        stsToken,
        bucket,
      });

      // oss 上传
      const ossCallback = (file) => {
        // 文件名
        const fileType = {
          false: uuid(),
          true: oldFileName,
        }[!!oldFileName];
        // 文件储存路径
        const fileUrl = { image: folder, active: 'dev/active/page' }[apiType];
        // 文件后缀
        const fileSuffix = apiType === 'active' ? type : file['name'].replace(/.+\./, '.');

        // 设置路径+随机文件名
        let fileName = fileUrl + '/' + fileType + fileSuffix;

        // // 临时
        // let fileName = folder + '/' + uuid() + '.jpg';
        // // end
        // 提交文件
        if (ossType === 'put') {
          return client.put(fileName, file).then((putres) => {
            const {
              res: { status, statusCode },
            } = putres;
            if (status === 200 && statusCode === 200) {
              return host + fileName;
            } else {
              message.destroy();
              return false;
            }
          });
        }
        if (ossType === 'delete') {
          return client.delete(fileName).then((res) => {
            console.log(res);
            message.destroy();
            return false;
          });
        }
      };
      return ossCallback;
    })
    .then(async (ossCallback) => {
      if (!ossCallback) {
        notification.info({
          message: '温馨提示',
          description: 'common OSS服务未启动',
        });
        return;
      }
      if (ossType === 'delete') {
        ossCallback();
        return;
      }
      // 返回文件url数组
      const fileUrlArray = [];
      // 文件数组遍历上传 单个文件直接上传
      if (Array.isArray(fileArray)) {
        for (const item of fileArray) {
          if (typeof item === 'string') {
            fileUrlArray.push(item);
          } else {
            await ossCallback(item).then((res) => {
              if (!res) {
                notificationInfo();
                return;
              }
              fileUrlArray.push(res);
            });
          }
        }
      } else {
        await ossCallback(fileArray).then((res) => {
          if (!res) {
            notificationInfo();
            return;
          }
          fileUrlArray.push(res);
        });
      }
      message.destroy();
      // 返回url数组
      return fileUrlArray;
    });
};

export default aliOssUpload;
