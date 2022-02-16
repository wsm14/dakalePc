// import React from 'react';
// import { connect } from 'umi';
// import { WXFRIEND_SHARE_IMG } from '@/common/imgRatio';
// import { Form, Button } from 'antd';
// import DrawerCondition from '@/components/DrawerCondition';
// import FormCondition from '@/components/FormCondition';
// import aliOssUpload from '@/utils/aliOssUpload';

// const ShareImg = (props) => {
//   const { visible, onClose, onSubmit, childRef, loading } = props;
//   const { show = false, detail = {} } = visible;

//   const { momentId, ownerId, ownerName, title, videoContent } = detail;
//   const videoUrl = JSON.parse(videoContent || '{}')['url'];
//   const [form] = Form.useForm();

//   const formItems = [
//     {
//       label: '初始收藏数',
//       type: 'number',
//       name: 'collectionAmount',
//       rules: [{ required: false }],
//     },
//     {
//       label: '初始分享数',
//       type: 'number',
//       name: 'shareAmount',
//       rules: [{ required: false }],
//     },
//     {
//       label: '微信好友分享图',
//       name: 'friendShareImg',
//       type: 'upload',
//       maxFile: 1,
//       imgRatio: WXFRIEND_SHARE_IMG,
//       rules: [{ required: false }],
//       extra: '请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上）',
//     },
//   ];

//   const handleSave = () => {
//     form.validateFields().then(async (values) => {
//       const { friendShareImg = '', collectionAmount, shareAmount } = values;
//       const fImg = await aliOssUpload(friendShareImg);
//       onSubmit(
//         {
//           momentId,
//           ownerId,
//           collectionAmount,
//           shareAmount,
//           friendShareImg: fImg.toString(),
//         },
//         () => {
//           childRef.current.fetchGetData();
//           onClose();
//         },
//       );
//     });
//   };

//   const modalProps = {
//     visible: show,
//     title: `${ownerName}--${title}`,
//     onClose,
//     footer: (
//       <Button type="primary" onClick={handleSave} loading={loading}>
//         确认
//       </Button>
//     ),
//   };
//   return (
//     <DrawerCondition {...modalProps}>
//       <video src={videoUrl} style={{ width: '100%', height: '300px' }} controls></video>
//       <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
//     </DrawerCondition>
//   );
// };

// export default connect(({ loading }) => ({
//   loading: loading.effects['videoPlatform/fetchNewShareNoAudit'],
// }))(ShareImg);
