import request from './request';
import { uuid } from './utils';
import { message } from 'antd';
import '../../lib/aliyun-upload-sdk-1.5.2.min.js';

const uploadLive = ({ data, title, callback }) => {
  if (typeof data === 'string' || !data) {
    callback(data || undefined);
    return;
  }
  const { fileList = [] } = data;
  const file = fileList[0].originFileObj || fileList[0].url;
  const uploader = new AliyunUpload.Vod({
    userId: '202991694203247151', // 阿里账号ID，必须有值
    partSize: 1048576, // 分片大小默认1 MB，不能小于100 KB
    parallel: 5, // 并行上传分片个数，默认5
    retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
    retryDuration: 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
    enableUploadProgress: true, // 是否上报上传日志到视频点播，默认为true
    // 添加文件成功
    addFileSuccess: function (uploadInfo) {
      const { isImage } = uploadInfo;
      message.loading(
        `${
          {
            false: '视频',
            true: '图片',
          }[isImage]
        }上传中......`,
        0,
      );
      uploader.startUpload();
    },
    // 开始上传
    onUploadstarted: function (uploadInfo) {
      const { isImage } = uploadInfo;
      // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
      // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
      // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
      // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
      // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
      // 上传方式1，需要根据uploadInfo.videoId是否有值，调用视频点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
      const fileName = uuid();
      const apiProps = {
        false: {
          api: '/common/vod/getVideoUploadAuth',
          params: {
            title: title || fileName,
            fileName: `${fileName}${uploadInfo.file.name.replace(/.+\./, '.')}`,
          },
        },
        true: { api: '/common/vod/getImageUploadAuth', params: {} },
      }[isImage];
      request(apiProps.api, { params: apiProps.params }).then(({ content }) => {
        if (!content) {
          message.destroy();
          return;
        }
        const uploadAuth = content.uploadAuth;
        const uploadAddress = content.uploadAddress;
        const videoId = content.videoId || content.imageId;
        console.log('content', content);
        uploader.dakaleAuthContent = { ...content, isImage };
        uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
      });
    },
    // 文件上传成功
    onUploadSucceed: function (uploadInfo) {
      console.log(
        'onUploadSucceed: ' +
          uploadInfo.file.name +
          ', endpoint:' +
          uploadInfo.endpoint +
          ', bucket:' +
          uploadInfo.bucket +
          ', object:' +
          uploadInfo.object,
      );
    },
    // 文件上传失败
    onUploadFailed: function (uploadInfo, code, message) {
      console.log(
        'onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message,
      );
    },
    // 文件上传进度，单位：字节
    onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
      console.log(
        'onUploadProgress:file:' +
          uploadInfo.file.name +
          ', fileSize:' +
          totalSize +
          ', percent:' +
          Math.ceil(loadedPercent * 100) +
          '%',
      );
    },
    // 上传凭证超时
    onUploadTokenExpired: function (uploadInfo) {
      // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
      // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
      // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
      request('/common/vod/refreshVideoUploadAuth', {
        params: {
          videoId: uploadInfo.videoId,
        },
      }).then(({ content }) => {
        uploader.resumeUploadWithAuth(content.uploadAuth);
      });
    },
    // 全部文件上传结束
    onUploadEnd: function () {
      message.destroy();
      const { isImage, imageURL, videoId } = uploader.dakaleAuthContent;
      callback && callback(isImage ? imageURL : videoId);
      console.log('onUploadEnd: uploaded all the files');
    },
  });
  // 添加文件
  uploader.addFile(file);
};
export default uploadLive;
