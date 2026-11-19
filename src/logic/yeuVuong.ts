export interface KetQuaSatThuong {
  satThuong: number;
  chiMang: boolean;
  coPhiKiem: boolean;
}

export function layMocPhaYeuVuong(soPha: 1 | 2 | 3): number[] {
  if (soPha === 3) return [66, 33];
  if (soPha === 2) return [50];
  return [];
}

export function layPhaYeuVuongHienTai(
  yeuLucPhanTram: number,
  soPha: 1 | 2 | 3
): number {
  if (soPha === 1) return 1;
  if (soPha === 2) {
    return yeuLucPhanTram > 50 ? 1 : 2;
  }
  if (yeuLucPhanTram > 66) return 1;
  if (yeuLucPhanTram > 33) return 2;
  return 3;
}

export function tinhSatThuongLenYeuVuong(thamSo: {
  tongDonN: number;
  giayTraLoi: number;
  chuoiNgoDao: number;
  heSoPhiKiem: number;
}): KetQuaSatThuong {
  const donCoBan = 100 / Math.max(1, thamSo.tongDonN);
  const chiMang = thamSo.giayTraLoi <= 10 || thamSo.chuoiNgoDao >= 3;
  const coPhiKiem = thamSo.heSoPhiKiem > 0;
  let tong = donCoBan;
  if (chiMang) tong *= 1.5;
  if (coPhiKiem) tong *= 1 + thamSo.heSoPhiKiem;

  return {
    satThuong: Number(tong.toFixed(1)),
    chiMang,
    coPhiKiem,
  };
}

export function dinhDangPhanTramYeuLuc(giaTri: number): string {
  const chuan = Math.max(0, Math.min(100, giaTri));
  return `${chuan.toFixed(1).replace('.', ',')}%`;
}
