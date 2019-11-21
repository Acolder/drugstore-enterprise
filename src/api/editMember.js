import ajax from '@/utils/ajax';
// editData: {} , Name: 姓名, Gender: 性别(1:男，0：女), Age: 年龄, Description: 描述
// Mobile: 手机号 , MemberID: 就诊人编号（没有是添加，有是编辑）Is_Default: 是否默认就诊人(1是，0否)
export function editMember(editData) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/user/EditUserMember', editData).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        resolve(res.data);
      } else {
        resolve();
      }
    });
  });
}
// searchData: {name: name, pageIndex: pageIndex, pageSize: pageSize}
export function getMember(searchData) {
  return new Promise((resolve, reject) => {
    ajax.get('/api/user/MemberList', { params: searchData }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        resolve(res.data);
      }
    });
  });
}