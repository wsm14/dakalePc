import request from '@/utils/request';
// get 卡豆红包 - 列表
export async function fetchListRedEnvelopesManagement(params) {
  return request('/admin/redEnvelopes/listRedEnvelopesManagement', {
    params,
  });
}

//红包领取记录  listRedEnvelopesManagement
export async function fetchListRedEnvelopesReceives(params) {
  return request('/admin/redEnvelopes/listRedEnvelopesReceives', {
    params,
  });
}

//拼手气红包设置回显
export async function fetchGetRedEnvelopeDetail(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// 拼手气红包设置

export function fetchSetLuckyRedEnvelopeAuthority(data) {
  return request('/admin/redEnvelopes/setLuckyRedEnvelopeAuthority', {
    method: 'POST',
    data,
  });
}

// 普通红包设置

export function fetchSetNormalRedEnvelopeAuthority(data) {
  return request('/admin/redEnvelopes/setNormalRedEnvelopeAuthority', {
    method: 'POST',
    data,
  });
}

// get 普通红包 - 列表
export async function fetchWhiteNameList(params) {
  return request('/admin/redEnvelopes/listConfigRedEnvelopeWhiteAccountManagement', {
    params,
  });
}

// 普通红包 - 白名单 - 删除
export function fetchWhiteNameListDelete(data) {
  return request('/admin/redEnvelopes/deleteNormalRedEnvelopeWhiteAccount', {
    method: 'POST',
    data,
  });
}

// 普通红包 - 白名单 - 设置
export function fetchWhiteNameListAdd(data) {
  return request('/admin/redEnvelopes/setNormalRedEnvelopeWhiteAccount', {
    method: 'POST',
    data,
  });
}
