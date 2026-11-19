// Danh sach tu tho tuc / phan cam co the mo rong de loc Dao hieu (khong phan biet dau/hoa thuong)
export const DANH_SACH_TU_CAM: string[] = [
  'dm',
  'dmm',
  'dcm',
  'dkm',
  'vcl',
  'vl',
  'clmm',
  'cc',
  'cmm',
  'dit',
  'du ma',
  'du me',
  'dit me',
  'con cac',
  'cai lon',
  'lon',
  'buoi',
  'cac',
  'chich',
  'xoac',
  'ngu nhu cho',
  'ngu ngoc',
  'do ngu',
  'oc cho',
  'mat day',
  'khon nan',
  'do cho',
  'fuck',
  'shit',
  'bitch',
  'dick',
  'pussy',
  'asshole',
  'sex',
  'porn',
  'admin',
  'quan tri vien',
  'quantrivien',
];

export function chuanHoaKhongDau(vanBan: string): string {
  return vanBan
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function chuaTuCam(vanBan: string): boolean {
  const chuan = chuanHoaKhongDau(vanBan);
  if (!chuan) return false;
  const cacTu = chuan.split(' ');
  for (const tuCam of DANH_SACH_TU_CAM) {
    if (tuCam.includes(' ')) {
      if (` ${chuan} `.includes(` ${tuCam} `)) {
        return true;
      }
    } else if (cacTu.includes(tuCam)) {
      return true;
    }
  }
  return false;
}
