// 回显dom
export default ({ styleIndex = 0, data }) =>
  [`<image src="${data}" style="width: 100%"></image>`][styleIndex];
