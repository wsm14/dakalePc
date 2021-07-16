// 回显dom
export default ({ styleIndex = 0, img }) =>
  [`<image src="${img}" style="width: 100%"></image>`][styleIndex];
