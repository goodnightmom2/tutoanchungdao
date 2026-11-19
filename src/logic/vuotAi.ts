import { MaCanhGioi, MaGiaiDoan } from '../kieuDuLieu/troChoi';

export type LoaiO =
  | 'duongDi'
  | 'tuongNui'
  | 'hoNuoc'
  | 'hoNho'
  | 'chuongNgai'
  | 'linhThach'
  | 'ruongBau'
  | 'tieuNon'
  | 'congThienMon';

export type LoaiChuongNgai =
  | 'daTang'
  | 'congPhongAn'
  | 'cayCoThu'
  | 'suongDoc';

export interface ToaDo {
  x: number;
  y: number;
}

export interface ChuongNgaiInfo {
  id: string;
  loai: LoaiChuongNgai;
  ten: string;
  moTaNgan: string;
  thuTu: number;
}

export interface BanDoVuotAi {
  chieuRong: number;
  chieuCao: number;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  batDau: ToaDo;
  dich: ToaDo;
  luoi: LoaiO[][];
  chuongNgai: Record<string, ChuongNgaiInfo>;
  tongLinhThach: number;
  toaDoTieuNon: ToaDo;
  loiNhacTieuNon: string;
}

export type HuongDi = 'len' | 'xuong' | 'trai' | 'phai';

export function khoaToaDo(x: number, y: number): string {
  return `${x},${y}`;
}

/**
 * Bo sinh so gia ngau nhien xac dinh theo seed (FNV-1a + Mulberry32).
 */
export function taoBoSinhNgauNhien(seedChuoi: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedChuoi.length; i++) {
    h ^= seedChuoi.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let trangThai = h >>> 0;
  return () => {
    trangThai = (trangThai + 0x6d2b79f5) | 0;
    let t = Math.imul(trangThai ^ (trangThai >>> 15), 1 | trangThai);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const THONG_TIN_CHUONG_NGAI: Record<
  LoaiChuongNgai,
  { ten: string; moTaNgan: string }
> = {
  daTang: {
    ten: 'Đá Tảng Chắn Đường',
    moTaNgan: 'Giải đúng phép toán để tụ kiếm khí chém vỡ tảng đá!',
  },
  congPhongAn: {
    ten: 'Cổng Phong Ấn Cổ',
    moTaNgan: 'Tìm đúng khóa số lượng giác để mở ấn ký!',
  },
  cayCoThu: {
    ten: 'Cây Cổ Thụ Bịt Lối',
    moTaNgan: 'Tính đúng tỷ lệ cạnh – góc để cành cổ thụ tự rẽ lối!',
  },
  suongDoc: {
    ten: 'Đám Sương Độc Mê Hoặc',
    moTaNgan: 'Vận dụng hệ thức lượng để xua tan sương độc!',
  },
};

const LOI_NHAC_TIEU_NON: Record<MaCanhGioi, string> = {
  luyenKhi:
    'Tiểu Nón mách nhỏ: Trên nửa đường tròn đơn vị, tung độ y₀ là sin α còn hoành độ x₀ là cos α đó!',
  trucCo:
    'Tiểu Nón nhắc: Hai góc bù nhau thì sin bằng nhau, còn cos, tan, cot đổi dấu nhé!',
  kimDan:
    'Tiểu Nón thì thầm: Nhớ công thức a² = b² + c² − 2bc·cos A và cẩn thận dấu khi góc tù!',
  nguyenAnh:
    'Tiểu Nón reo lên: Tỉ số cạnh trên sin góc đối diện luôn bằng đúng đường kính 2R ngoại tiếp!',
  hoaThan:
    'Tiểu Nón gợi ý: Đừng quên nửa chu vi p = (a+b+c)/2 khi áp dụng công thức Hê-rông và S = p·r!',
  doKiep:
    'Tiểu Nón cổ vũ: Bình tĩnh chọn đúng định lí côsin hay sin tùy dữ kiện đề bài cho!',
};

/**
 * Tao ban do Vuot Ai 9x14 xac dinh theo canhGioi + giaiDoan.
 * Bat dau tai (4, 13) -> Cong Thien Mon tai (4, 0), co 5 chuong ngai bat buoc, 1-2 ho nho nhay qua,
 * 3-5 linh thach, 1 ruong bau, 1 vi tri Tieu Non tro giup.
 */
export function taoBanDoVuotAi(
  canhGioi: MaCanhGioi,
  giaiDoan: MaGiaiDoan
): BanDoVuotAi {
  const chieuRong = 9;
  const chieuCao = 14;
  const rng = taoBoSinhNgauNhien(`vuotAi_${canhGioi}_${giaiDoan}_v2`);

  // Khoi tao toan bo la tuongNui / hoNuoc trang tri
  const luoi: LoaiO[][] = Array.from({ length: chieuCao }, (_, y) =>
    Array.from({ length: chieuRong }, (_, x) => {
      if (x === 0 || x === chieuRong - 1) return 'tuongNui';
      return rng() < 0.16 && y > 1 && y < 12 ? 'hoNuoc' : 'tuongNui';
    })
  );

  // Xay dung tuyen duong chinh ngoan ngoeo tu (4, 13) len (4, 0)
  // Cac diem moc hang y di chuyen qua cot 1..7 tao duong don 1 o rong -> dam bao 5 chuong ngai khong the di vong
  const cacCotMoc = [
    4,
    rng() < 0.5 ? 2 : 6,
    rng() < 0.5 ? 6 : 2,
    rng() < 0.5 ? 3 : 5,
    rng() < 0.5 ? 6 : 2,
    4,
  ];
  const hangMoc = [13, 10, 7, 5, 2, 0];

  const duongChinh: ToaDo[] = [];
  const themO = (x: number, y: number) => {
    if (
      duongChinh.length === 0 ||
      duongChinh[duongChinh.length - 1].x !== x ||
      duongChinh[duongChinh.length - 1].y !== y
    ) {
      duongChinh.push({ x, y });
    }
    luoi[y][x] = 'duongDi';
  };

  let curX = cacCotMoc[0];
  let curY = hangMoc[0];
  themO(curX, curY);

  for (let i = 1; i < hangMoc.length; i++) {
    const targetY = hangMoc[i];
    const targetX = cacCotMoc[i];
    // Di len 1 buoc truoc khi re ngang de duong tach bach
    if (curY > targetY) {
      curY -= 1;
      themO(curX, curY);
    }
    while (curX !== targetX) {
      curX += targetX > curX ? 1 : -1;
      themO(curX, curY);
    }
    while (curY > targetY) {
      curY -= 1;
      themO(curX, curY);
    }
  }

  // Dat Cong Thien Mon o (4, 0)
  luoi[0][4] = 'congThienMon';

  // 1. Dat 1-2 hoNho co the nhay qua tren doan thang truoc, giu lai 2 o dap canh
  const chiSoGiuChoHo = new Set<number>();
  let soHo = 0;
  let chiSoHoGanNhat = -10;
  const thuDatHo = (idx: number): boolean => {
    if (idx - chiSoHoGanNhat < 4) return false;
    const truoc = duongChinh[idx - 1];
    const giua = duongChinh[idx];
    const sau = duongChinh[idx + 1];
    if (!truoc || !giua || !sau) return false;
    const thangHang =
      (truoc.x === giua.x && giua.x === sau.x) ||
      (truoc.y === giua.y && giua.y === sau.y);
    if (
      thangHang &&
      luoi[truoc.y][truoc.x] === 'duongDi' &&
      luoi[giua.y][giua.x] === 'duongDi' &&
      luoi[sau.y][sau.x] === 'duongDi'
    ) {
      luoi[giua.y][giua.x] = 'hoNho';
      chiSoGiuChoHo.add(idx - 1);
      chiSoGiuChoHo.add(idx);
      chiSoGiuChoHo.add(idx + 1);
      chiSoHoGanNhat = idx;
      soHo++;
      return true;
    }
    return false;
  };

  for (let idx = 2; idx < duongChinh.length - 3 && soHo < 2; idx++) {
    if (idx % 6 === 2) {
      thuDatHo(idx);
    }
  }
  if (soHo === 0) {
    for (let idx = 2; idx < duongChinh.length - 3 && soHo < 1; idx++) {
      thuDatHo(idx);
    }
  }

  // 2. Dat 5 chuong ngai bat buoc cach deu tren cac o duongDi con lai (bo qua o dau, o dich va o hoNho/dap ho)
  const danhSachLoaiCn: LoaiChuongNgai[] = [
    'daTang',
    'congPhongAn',
    'cayCoThu',
    'suongDoc',
    'congPhongAn',
  ];
  const chuongNgai: Record<string, ChuongNgaiInfo> = {};
  const ungVienCn: number[] = [];
  for (let idx = 2; idx < duongChinh.length - 1; idx++) {
    const o = duongChinh[idx];
    if (!chiSoGiuChoHo.has(idx) && luoi[o.y][o.x] === 'duongDi') {
      ungVienCn.push(idx);
    }
  }

  const tongUngVien = ungVienCn.length;
  for (let i = 0; i < 5 && i < tongUngVien; i++) {
    const pos = Math.min(
      tongUngVien - 1,
      Math.floor(((i + 0.5) * tongUngVien) / 5)
    );
    const idx = ungVienCn[pos];
    const o = duongChinh[idx];
    const loaiCn =
      danhSachLoaiCn[(i + (giaiDoan === 'trungKy' ? 1 : giaiDoan === 'hauKy' ? 2 : 0)) % danhSachLoaiCn.length];
    luoi[o.y][o.x] = 'chuongNgai';
    chuongNgai[khoaToaDo(o.x, o.y)] = {
      id: `cn_${i + 1}`,
      loai: loaiCn,
      ten: THONG_TIN_CHUONG_NGAI[loaiCn].ten,
      moTaNgan: THONG_TIN_CHUONG_NGAI[loaiCn].moTaNgan,
      thuTu: i + 1,
    };
  }

  // Dat Tieu Non ben canh duong gan diem xuat phat (o ke ben o thu 1 hoac 2)
  let toaDoTieuNon: ToaDo = { x: 3, y: 12 };
  const ungVienTn = [
    { x: 3, y: 12 },
    { x: 5, y: 12 },
    { x: 3, y: 13 },
    { x: 5, y: 13 },
  ];
  for (const uv of ungVienTn) {
    if (luoi[uv.y]?.[uv.x] === 'tuongNui' || luoi[uv.y]?.[uv.x] === 'hoNuoc') {
      luoi[uv.y][uv.x] = 'tieuNon';
      toaDoTieuNon = uv;
      break;
    }
  }
  // Cho phep di toi Tieu Non de tro chuyen (neu o Tieu Non dung ke duongDi)
  if (luoi[12][4] !== 'duongDi') {
    luoi[12][4] = 'duongDi';
  }

  // Mo 1 ngach phu chua Ruong Bau (chi 1-2 o re tu doan giua, khong noi vong qua chuong ngai)
  const oRe = duongChinh[Math.min(duongChinh.length - 4, Math.floor(duongChinh.length * 0.45))];
  let daDatRuong = false;
  for (const [dx, dy] of [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = oRe.x + dx;
    const ny = oRe.y + dy;
    if (
      nx > 0 &&
      nx < chieuRong - 1 &&
      ny > 1 &&
      ny < chieuCao - 1 &&
      luoi[ny][nx] !== 'duongDi' &&
      luoi[ny][nx] !== 'chuongNgai' &&
      luoi[ny][nx] !== 'hoNho' &&
      luoi[ny][nx] !== 'tieuNon'
    ) {
      // Kiem tra o nay khong cham vao o duong khac ngoai oRe de tranh di tat qua chuong ngai
      let soLanChamDuong = 0;
      for (const [cx, cy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const tx = nx + cx;
        const ty = ny + cy;
        const loai = luoi[ty]?.[tx];
        if (
          loai === 'duongDi' ||
          loai === 'chuongNgai' ||
          loai === 'hoNho' ||
          loai === 'congThienMon'
        ) {
          soLanChamDuong++;
        }
      }
      if (soLanChamDuong === 1) {
        luoi[ny][nx] = 'ruongBau';
        daDatRuong = true;
        break;
      }
    }
  }
  if (!daDatRuong) {
    // Fallback dat ruong o o gan cuoi truoc cong
    for (let y = 1; y <= 3 && !daDatRuong; y++) {
      for (let x = 1; x <= 7 && !daDatRuong; x++) {
        if (luoi[y][x] === 'tuongNui') {
          const keDuong =
            luoi[y]?.[x - 1] === 'duongDi' || luoi[y]?.[x + 1] === 'duongDi';
          if (keDuong) {
            luoi[y][x] = 'ruongBau';
            daDatRuong = true;
          }
        }
      }
    }
  }

  // Dat 4 vien Linh Thach tren cac o duongDi trong
  let tongLinhThach = 0;
  for (let idx = 1; idx < duongChinh.length - 1 && tongLinhThach < 4; idx++) {
    const o = duongChinh[idx];
    if (luoi[o.y][o.x] === 'duongDi' && idx % 3 === 1) {
      luoi[o.y][o.x] = 'linhThach';
      tongLinhThach++;
    }
  }

  return {
    chieuRong,
    chieuCao,
    canhGioi,
    giaiDoan,
    batDau: { x: 4, y: 13 },
    dich: { x: 4, y: 0 },
    luoi,
    chuongNgai,
    tongLinhThach,
    toaDoTieuNon,
    loiNhacTieuNon: LOI_NHAC_TIEU_NON[canhGioi],
  };
}

export function oCoTheBuocVao(
  loai: LoaiO,
  x: number,
  y: number,
  daPhaSet: Set<string>
): boolean {
  if (loai === 'tuongNui' || loai === 'hoNuoc' || loai === 'hoNho') return false;
  if (loai === 'chuongNgai') {
    return daPhaSet.has(khoaToaDo(x, y));
  }
  return true;
}

export function vectorHuong(huong: HuongDi): ToaDo {
  switch (huong) {
    case 'len':
      return { x: 0, y: -1 };
    case 'xuong':
      return { x: 0, y: 1 };
    case 'trai':
      return { x: -1, y: 0 };
    case 'phai':
      return { x: 1, y: 0 };
  }
}

export function tinhBuocDiChuyen(
  banDo: BanDoVuotAi,
  hienTai: ToaDo,
  huong: HuongDi,
  daPhaSet: Set<string>
): {
  viTriMoi: ToaDo;
  daChuyen: boolean;
  gapChuongNgai: ChuongNgaiInfo | null;
  viTriChuongNgai: ToaDo | null;
  gapHoNho: boolean;
  gapTieuNon: boolean;
} {
  const d = vectorHuong(huong);
  const nx = hienTai.x + d.x;
  const ny = hienTai.y + d.y;

  if (nx < 0 || nx >= banDo.chieuRong || ny < 0 || ny >= banDo.chieuCao) {
    return {
      viTriMoi: hienTai,
      daChuyen: false,
      gapChuongNgai: null,
      viTriChuongNgai: null,
      gapHoNho: false,
      gapTieuNon: false,
    };
  }

  const loai = banDo.luoi[ny][nx];
  if (loai === 'chuongNgai' && !daPhaSet.has(khoaToaDo(nx, ny))) {
    return {
      viTriMoi: hienTai,
      daChuyen: false,
      gapChuongNgai: banDo.chuongNgai[khoaToaDo(nx, ny)] || null,
      viTriChuongNgai: { x: nx, y: ny },
      gapHoNho: false,
      gapTieuNon: false,
    };
  }

  if (loai === 'hoNho') {
    return {
      viTriMoi: hienTai,
      daChuyen: false,
      gapChuongNgai: null,
      viTriChuongNgai: null,
      gapHoNho: true,
      gapTieuNon: false,
    };
  }

  if (loai === 'tieuNon') {
    return {
      viTriMoi: hienTai,
      daChuyen: false,
      gapChuongNgai: null,
      viTriChuongNgai: null,
      gapHoNho: false,
      gapTieuNon: true,
    };
  }

  if (!oCoTheBuocVao(loai, nx, ny, daPhaSet)) {
    return {
      viTriMoi: hienTai,
      daChuyen: false,
      gapChuongNgai: null,
      viTriChuongNgai: null,
      gapHoNho: false,
      gapTieuNon: false,
    };
  }

  return {
    viTriMoi: { x: nx, y: ny },
    daChuyen: true,
    gapChuongNgai: null,
    viTriChuongNgai: null,
    gapHoNho: false,
    gapTieuNon: false,
  };
}

export function tinhNhayQuaHo(
  banDo: BanDoVuotAi,
  hienTai: ToaDo,
  huong: HuongDi,
  daPhaSet: Set<string>
): { thanhCong: boolean; viTriMoi: ToaDo; quaHoNho: boolean } {
  const d = vectorHuong(huong);
  const oGiuaX = hienTai.x + d.x;
  const oGiuaY = hienTai.y + d.y;
  const oDichX = hienTai.x + d.x * 2;
  const oDichY = hienTai.y + d.y * 2;

  const loaiGiua = banDo.luoi[oGiuaY]?.[oGiuaX];
  const loaiDich = banDo.luoi[oDichY]?.[oDichX];

  if (
    loaiGiua === 'hoNho' &&
    loaiDich &&
    oCoTheBuocVao(loaiDich, oDichX, oDichY, daPhaSet)
  ) {
    return {
      thanhCong: true,
      viTriMoi: { x: oDichX, y: oDichY },
      quaHoNho: true,
    };
  }

  // Neu khong co ho nho truoc mat, nhay tai cho / buoc 1 o neu trong
  if (loaiGiua && oCoTheBuocVao(loaiGiua, oGiuaX, oGiuaY, daPhaSet)) {
    return {
      thanhCong: true,
      viTriMoi: { x: oGiuaX, y: oGiuaY },
      quaHoNho: false,
    };
  }

  return { thanhCong: false, viTriMoi: hienTai, quaHoNho: false };
}

/**
 * Tim duong ngan nhat bang BFS (co tinh kha nang nhay qua hoNho).
 */
export function timDuongNganNhat(
  banDo: BanDoVuotAi,
  tu: ToaDo,
  den: ToaDo,
  daPhaSet?: Set<string>
): ToaDo[] {
  const xemNhuDaPha = daPhaSet === undefined;
  const hangDoi: ToaDo[] = [tu];
  const daTham = new Set<string>([khoaToaDo(tu.x, tu.y)]);
  const cha = new Map<string, ToaDo>();

  const laOQuaDuoc = (x: number, y: number): boolean => {
    const loai = banDo.luoi[y]?.[x];
    if (!loai) return false;
    if (loai === 'tuongNui' || loai === 'hoNuoc' || loai === 'tieuNon') return false;
    if (loai === 'hoNho') return false;
    if (loai === 'chuongNgai' && !xemNhuDaPha && !daPhaSet!.has(khoaToaDo(x, y))) {
      return true; // Cho phep bua chi duong chi xuyen qua chuong ngai de nguoi choi biet huong di
    }
    return true;
  };

  while (hangDoi.length > 0) {
    const cur = hangDoi.shift()!;
    if (cur.x === den.x && cur.y === den.y) {
      const kq: ToaDo[] = [];
      let p: ToaDo | undefined = cur;
      while (p) {
        kq.unshift(p);
        p = cha.get(khoaToaDo(p.x, p.y));
      }
      return kq;
    }

    for (const [dx, dy] of [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ]) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (nx < 0 || nx >= banDo.chieuRong || ny < 0 || ny >= banDo.chieuCao) continue;

      if (banDo.luoi[ny][nx] === 'hoNho') {
        const jx = cur.x + dx * 2;
        const jy = cur.y + dy * 2;
        if (
          jx >= 0 &&
          jx < banDo.chieuRong &&
          jy >= 0 &&
          jy < banDo.chieuCao &&
          laOQuaDuoc(jx, jy)
        ) {
          const kj = khoaToaDo(jx, jy);
          if (!daTham.has(kj)) {
            daTham.add(kj);
            cha.set(kj, cur);
            hangDoi.push({ x: jx, y: jy });
          }
        }
        continue;
      }

      if (laOQuaDuoc(nx, ny)) {
        const k = khoaToaDo(nx, ny);
        if (!daTham.has(k)) {
          daTham.add(k);
          cha.set(k, cur);
          hangDoi.push({ x: nx, y: ny });
        }
      }
    }
  }

  return [];
}

export function kiemTraDuongDiHopLe(banDo: BanDoVuotAi): boolean {
  const duong = timDuongNganNhat(banDo, banDo.batDau, banDo.dich);
  return (
    duong.length > 0 &&
    duong[duong.length - 1].x === banDo.dich.x &&
    duong[duong.length - 1].y === banDo.dich.y
  );
}

export function tinhSaoVuotAi(soPhaLanDauDung: number, tongChuongNgai = 5): number {
  if (soPhaLanDauDung >= tongChuongNgai) return 3;
  if (soPhaLanDauDung >= tongChuongNgai - 1) return 2;
  return 1;
}
