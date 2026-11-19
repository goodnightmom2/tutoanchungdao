import { CauHoi, HinhVeTamGiac } from '../kieuDuLieu/troChoi';

export interface Diem2D {
  x: number;
  y: number;
}

export interface KetQuaTamGiac2D {
  A: Diem2D;
  B: Diem2D;
  C: Diem2D;
  trungDiemBC: Diem2D;
  chanDuongCaoA: Diem2D;
  tamNgoaiTiep: Diem2D;
  banKinhNgoaiTiep: number;
  tamNoiTiep: Diem2D;
  banKinhNoiTiep: number;
}

/**
 * Chuan hoa chuoi so nhap tu nguoi choi (ho tro dau phay thap phan, dau do, phan so don gian a/b).
 */
export function chuanHoaSoNhap(chuoi: string): number | null {
  const sach = chuoi
    .trim()
    .replace(/,/g, '.')
    .replace(/[°\s]/g, '');
  if (!sach) return null;

  if (/^[+-]?\d+(\.\d+)?\/[+-]?\d+(\.\d+)?$/.test(sach)) {
    const [tu, mau] = sach.split('/').map(Number);
    if (!Number.isFinite(tu) || !Number.isFinite(mau) || mau === 0) return null;
    return tu / mau;
  }

  const giaTri = Number(sach);
  return Number.isFinite(giaTri) ? giaTri : null;
}

/**
 * Cham dap an cho ca 3 dang cau hoi: tracNghiem, dungSai, dienSo.
 */
export function chamDapAn(cauHoi: CauHoi, giaTriNhap: string | number): boolean {
  if (cauHoi.dang === 'dienSo') {
    const soNhap =
      typeof giaTriNhap === 'number'
        ? giaTriNhap
        : chuanHoaSoNhap(String(giaTriNhap));
    const dapAnSo =
      typeof cauHoi.dapAn === 'number'
        ? cauHoi.dapAn
        : chuanHoaSoNhap(String(cauHoi.dapAn));
    if (soNhap === null || dapAnSo === null) return false;
    const saiSo = cauHoi.saiSo ?? 0.01;
    return Math.abs(soNhap - dapAnSo) <= saiSo + 1e-9;
  }

  const chiSoNhap = Number(giaTriNhap);
  const chiSoDung = Number(cauHoi.dapAn);
  return Number.isFinite(chiSoNhap) && chiSoNhap === chiSoDung;
}

/**
 * Xao tron cac phuong an trac nghiem nhung giu nguyen tinh dung dan cua dapAn.
 * Khong xao tron dang dungSai de giu thu tu [Dung, Sai].
 */
export function chuanBiCauHoiNgauNhien(cauHoi: CauHoi): CauHoi {
  if (cauHoi.dang !== 'tracNghiem' || !cauHoi.luaChon || cauHoi.luaChon.length < 2) {
    return cauHoi;
  }
  const chiSoDungGoc = Number(cauHoi.dapAn);
  const cap = cauHoi.luaChon.map((noiDung, idx) => ({
    noiDung,
    laDung: idx === chiSoDungGoc,
  }));
  for (let i = cap.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cap[i], cap[j]] = [cap[j], cap[i]];
  }
  return {
    ...cauHoi,
    luaChon: cap.map((c) => c.noiDung),
    dapAn: cap.findIndex((c) => c.laDung),
  };
}

/**
 * Lay ngau nhien N cau hoi khong trung lap trong tap hop cho truoc.
 */
export function chonCauHoiKhongTrung(
  danhSach: CauHoi[],
  soLuong: number,
  loaiTruIds: string[] = []
): CauHoi[] {
  const uuTien = danhSach.filter((c) => !loaiTruIds.includes(c.id));
  const nguon = uuTien.length >= soLuong ? [...uuTien] : [...danhSach];

  for (let i = nguon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nguon[i], nguon[j]] = [nguon[j], nguon[i]];
  }
  return nguon.slice(0, Math.min(soLuong, nguon.length)).map(chuanBiCauHoiNgauNhien);
}

/**
 * Tinh toa do 2D chinh xac cua tam giac ABC de ve bang SVG (he truc man hinh: y huong xuong).
 */
export function tinhToaDoTamGiac(
  hinh: HinhVeTamGiac,
  chieuRong = 300,
  chieuCao = 210,
  le = 36
): KetQuaTamGiac2D {
  let a = 7;
  let b = 6;
  let c = 5;

  if (hinh.doDaiCanh && hinh.doDaiCanh[0] > 0 && hinh.doDaiCanh[1] > 0 && hinh.doDaiCanh[2] > 0) {
    [a, b, c] = hinh.doDaiCanh;
  } else if (hinh.goc && hinh.goc[0] > 0) {
    const gocARad = (hinh.goc[0] * Math.PI) / 180;
    b = hinh.doDaiCanh?.[1] || 6;
    c = hinh.doDaiCanh?.[2] || 7;
    a = Math.sqrt(Math.max(0.01, b * b + c * c - 2 * b * c * Math.cos(gocARad)));
  }

  // Kiem tra bat dang thuc tam giac an toan
  if (a + b <= c || a + c <= b || b + c <= a) {
    a = 7;
    b = 6;
    c = 5;
  }

  // Dat B tai (0, 0), C tai (a, 0), A nam phia tren (y am trong he SVG)
  const cosB = Math.max(-0.99, Math.min(0.99, (a * a + c * c - b * b) / (2 * a * c)));
  const sinB = Math.sqrt(Math.max(0.001, 1 - cosB * cosB));

  const gB: Diem2D = { x: 0, y: 0 };
  const gC: Diem2D = { x: a, y: 0 };
  const gA: Diem2D = { x: c * cosB, y: -c * sinB };

  // Tinh cac diem phu trong he toa do thuc
  const trungDiemBCGoc: Diem2D = { x: a / 2, y: 0 };
  const chanDuongCaoAGoc: Diem2D = { x: gA.x, y: 0 };

  // Tam ngoai tiep
  const d = 2 * (gA.x * (gB.y - gC.y) + gB.x * (gC.y - gA.y) + gC.x * (gA.y - gB.y));
  const a2 = gA.x * gA.x + gA.y * gA.y;
  const b2 = gB.x * gB.x + gB.y * gB.y;
  const c2 = gC.x * gC.x + gC.y * gC.y;
  const ox =
    Math.abs(d) > 1e-6
      ? (a2 * (gB.y - gC.y) + b2 * (gC.y - gA.y) + c2 * (gA.y - gB.y)) / d
      : a / 2;
  const oy =
    Math.abs(d) > 1e-6
      ? (a2 * (gC.x - gB.x) + b2 * (gA.x - gC.x) + c2 * (gB.x - gA.x)) / d
      : gA.y / 2;
  const tamNgoaiGoc: Diem2D = { x: ox, y: oy };
  const rNgoaiGoc = Math.hypot(gA.x - ox, gA.y - oy);

  // Tam noi tiep
  const chuVi = a + b + c;
  const tamNoiGoc: Diem2D = {
    x: (a * gA.x + b * gB.x + c * gC.x) / chuVi,
    y: (a * gA.y + b * gB.y + c * gC.y) / chuVi,
  };
  const p = chuVi / 2;
  const dienTich = Math.sqrt(Math.max(0.0001, p * (p - a) * (p - b) * (p - c)));
  const rNoiGoc = dienTich / p;

  // Bao gom ca vong tron ngoai tiep neu veThem co 'ngoaiTiep'
  const veNgoaiTiep = hinh.veThem?.includes('ngoaiTiep');
  const minX = veNgoaiTiep
    ? Math.min(gA.x, gB.x, gC.x, ox - rNgoaiGoc)
    : Math.min(gA.x, gB.x, gC.x);
  const maxX = veNgoaiTiep
    ? Math.max(gA.x, gB.x, gC.x, ox + rNgoaiGoc)
    : Math.max(gA.x, gB.x, gC.x);
  const minY = veNgoaiTiep
    ? Math.min(gA.y, gB.y, gC.y, oy - rNgoaiGoc)
    : Math.min(gA.y, gB.y, gC.y);
  const maxY = veNgoaiTiep
    ? Math.max(gA.y, gB.y, gC.y, oy + rNgoaiGoc)
    : Math.max(gA.y, gB.y, gC.y);

  const wThuc = Math.max(0.001, maxX - minX);
  const hThuc = Math.max(0.001, maxY - minY);
  const tiLe = Math.min(
    (chieuRong - le * 2) / wThuc,
    (chieuCao - le * 2) / hThuc
  );

  const dichX = (chieuRong - wThuc * tiLe) / 2 - minX * tiLe;
  const dichY = (chieuCao - hThuc * tiLe) / 2 - minY * tiLe;

  const bienDoi = (pt: Diem2D): Diem2D => ({
    x: Number((pt.x * tiLe + dichX).toFixed(2)),
    y: Number((pt.y * tiLe + dichY).toFixed(2)),
  });

  return {
    A: bienDoi(gA),
    B: bienDoi(gB),
    C: bienDoi(gC),
    trungDiemBC: bienDoi(trungDiemBCGoc),
    chanDuongCaoA: bienDoi(chanDuongCaoAGoc),
    tamNgoaiTiep: bienDoi(tamNgoaiGoc),
    banKinhNgoaiTiep: Number((rNgoaiGoc * tiLe).toFixed(2)),
    tamNoiTiep: bienDoi(tamNoiGoc),
    banKinhNoiTiep: Number((rNoiGoc * tiLe).toFixed(2)),
  };
}

/**
 * Bo phan tich bieu thuc khoa hoc che do Do (Degree) an toan cho Thien Co Toan Ban.
 * Khong dung eval hay Function.
 */
export function tinhBieuThucDo(bieuThuc: string): number | null {
  try {
    const chuoi = bieuThuc
      .trim()
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi');

    if (!chuoi) return null;

    type Token =
      | { loai: 'so'; giaTri: number }
      | { loai: 'ham'; ten: string }
      | { loai: 'toanTu'; kyHieu: string }
      | { loai: 'ngoacMo' }
      | { loai: 'ngoacDong' };

    const tokens: Token[] = [];
    let i = 0;

    while (i < chuoi.length) {
      const ch = chuoi[i];
      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      if (/[0-9.]/.test(ch)) {
        let soStr = '';
        while (i < chuoi.length && /[0-9.]/.test(chuoi[i])) {
          soStr += chuoi[i++];
        }
        const v = Number(soStr);
        if (!Number.isFinite(v)) return null;
        tokens.push({ loai: 'so', giaTri: v });
        continue;
      }

      if (/[a-zA-Z√]/.test(ch)) {
        if (ch === '√') {
          tokens.push({ loai: 'ham', ten: 'sqrt' });
          i++;
          continue;
        }
        let ten = '';
        while (i < chuoi.length && /[a-zA-Z0-9_]/.test(chuoi[i])) {
          ten += chuoi[i++].toLowerCase();
        }
        if (ten === 'pi') {
          tokens.push({ loai: 'so', giaTri: Math.PI });
        } else if (
          ['sin', 'cos', 'tan', 'cot', 'asin', 'acos', 'atan', 'sqrt', 'abs'].includes(ten)
        ) {
          tokens.push({ loai: 'ham', ten });
        } else {
          return null;
        }
        continue;
      }

      if (ch === '(') {
        tokens.push({ loai: 'ngoacMo' });
        i++;
        continue;
      }
      if (ch === ')') {
        tokens.push({ loai: 'ngoacDong' });
        i++;
        continue;
      }
      if (['+', '-', '*', '/', '^'].includes(ch)) {
        // Nhan biet dau am mot ngoi
        const truoc = tokens[tokens.length - 1];
        if (
          ch === '-' &&
          (!truoc || truoc.loai === 'toanTu' || truoc.loai === 'ngoacMo' || truoc.loai === 'ham')
        ) {
          tokens.push({ loai: 'so', giaTri: 0 });
        }
        tokens.push({ loai: 'toanTu', kyHieu: ch });
        i++;
        continue;
      }

      return null;
    }

    let pos = 0;

    function docBieuThuc(): number {
      let kq = docSoHang();
      while (pos < tokens.length) {
        const tk = tokens[pos];
        if (tk.loai === 'toanTu' && (tk.kyHieu === '+' || tk.kyHieu === '-')) {
          pos++;
          const phai = docSoHang();
          kq = tk.kyHieu === '+' ? kq + phai : kq - phai;
        } else {
          break;
        }
      }
      return kq;
    }

    function docSoHang(): number {
      let kq = docLuyThua();
      while (pos < tokens.length) {
        const tk = tokens[pos];
        if (tk.loai === 'toanTu' && (tk.kyHieu === '*' || tk.kyHieu === '/')) {
          pos++;
          const phai = docLuyThua();
          if (tk.kyHieu === '*') kq *= phai;
          else {
            if (Math.abs(phai) < 1e-12) throw new Error('Chia cho 0');
            kq /= phai;
          }
        } else {
          break;
        }
      }
      return kq;
    }

    function docLuyThua(): number {
      const coSo = docYeuTo();
      if (pos < tokens.length) {
        const tk = tokens[pos];
        if (tk.loai === 'toanTu' && tk.kyHieu === '^') {
          pos++;
          const mu = docLuyThua();
          return Math.pow(coSo, mu);
        }
      }
      return coSo;
    }

    function docYeuTo(): number {
      const tk = tokens[pos];
      if (!tk) throw new Error('Thieu toan hang');

      if (tk.loai === 'so') {
        pos++;
        return tk.giaTri;
      }

      if (tk.loai === 'ham') {
        pos++;
        const arg = docYeuTo();
        const rad = (arg * Math.PI) / 180;
        switch (tk.ten) {
          case 'sin':
            return Math.sin(rad);
          case 'cos':
            return Math.cos(rad);
          case 'tan': {
            if (Math.abs(Math.cos(rad)) < 1e-10) throw new Error('tan khong xac dinh');
            return Math.tan(rad);
          }
          case 'cot': {
            if (Math.abs(Math.sin(rad)) < 1e-10) throw new Error('cot khong xac dinh');
            return 1 / Math.tan(rad);
          }
          case 'asin': {
            if (arg < -1 || arg > 1) throw new Error('Mien asin');
            return (Math.asin(arg) * 180) / Math.PI;
          }
          case 'acos': {
            if (arg < -1 || arg > 1) throw new Error('Mien acos');
            return (Math.acos(arg) * 180) / Math.PI;
          }
          case 'atan':
            return (Math.atan(arg) * 180) / Math.PI;
          case 'sqrt': {
            if (arg < 0) throw new Error('Can bac hai so am');
            return Math.sqrt(arg);
          }
          case 'abs':
            return Math.abs(arg);
          default:
            throw new Error('Ham khong ho tro');
        }
      }

      if (tk.loai === 'ngoacMo') {
        pos++;
        const kq = docBieuThuc();
        const dong = tokens[pos];
        if (!dong || dong.loai !== 'ngoacDong') throw new Error('Thieu ngoac dong');
        pos++;
        return kq;
      }

      throw new Error('Cu phap khong hop le');
    }

    const ketQua = docBieuThuc();
    if (pos !== tokens.length || !Number.isFinite(ketQua)) return null;
    // Lam tron so gan bang 0 do sai so dau phay dong (vd cos(90))
    return Math.abs(ketQua) < 1e-10 ? 0 : ketQua;
  } catch {
    return null;
  }
}
