import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { tinhBieuThucDo } from '../logic/toanHoc';
import { NutLenhBai } from './KhungGiaoDien';

interface ThuocTinhToanBan {
  mo: boolean;
  dong: () => void;
  coTheChenKetQua?: boolean;
  khiChenKetQua?: (giaTri: string) => void;
}

export const ThienCoToanBan: React.FC<ThuocTinhToanBan> = ({
  mo,
  dong,
  coTheChenKetQua = false,
  khiChenKetQua,
}) => {
  const [bieuThuc, setBieuThuc] = useState('');
  const [ketQua, setKetQua] = useState<string>('');
  const [loi, setLoi] = useState<string>('');

  if (!mo) return null;

  const themKyTu = (kt: string) => {
    boPhatAmThanh.phatAmNhanNut();
    setLoi('');
    setBieuThuc((cu) => cu + kt);
  };

  const tinhNgay = () => {
    boPhatAmThanh.phatAmNhanNut();
    const kq = tinhBieuThucDo(bieuThuc);
    if (kq === null) {
      setLoi('Biểu thức chưa hợp lệ');
      setKetQua('');
      return;
    }
    const lamTron = Number(kq.toFixed(6));
    setKetQua(String(lamTron).replace('.', ','));
    setLoi('');
  };

  const xoaHet = () => {
    boPhatAmThanh.phatAmNhanNut();
    setBieuThuc('');
    setKetQua('');
    setLoi('');
  };

  const luiLai = () => {
    boPhatAmThanh.phatAmNhanNut();
    setBieuThuc((cu) => cu.slice(0, -1));
  };

  const hangNut: {
    nhan: string;
    giaTri?: string;
    hanhDong?: () => void;
    dacBiet?: boolean;
  }[][] = [
    [
      { nhan: 'sin', giaTri: 'sin(' },
      { nhan: 'cos', giaTri: 'cos(' },
      { nhan: 'tan', giaTri: 'tan(' },
      { nhan: '√', giaTri: 'sqrt(' },
      { nhan: '(', giaTri: '(' },
    ],
    [
      { nhan: 'sin⁻¹', giaTri: 'asin(' },
      { nhan: 'cos⁻¹', giaTri: 'acos(' },
      { nhan: 'tan⁻¹', giaTri: 'atan(' },
      { nhan: 'x²', giaTri: '^2' },
      { nhan: ')', giaTri: ')' },
    ],
    [
      { nhan: '7', giaTri: '7' },
      { nhan: '8', giaTri: '8' },
      { nhan: '9', giaTri: '9' },
      { nhan: '÷', giaTri: '÷' },
      { nhan: 'π', giaTri: 'π' },
    ],
    [
      { nhan: '4', giaTri: '4' },
      { nhan: '5', giaTri: '5' },
      { nhan: '6', giaTri: '6' },
      { nhan: '×', giaTri: '×' },
      { nhan: 'Lùi', hanhDong: luiLai },
    ],
    [
      { nhan: '1', giaTri: '1' },
      { nhan: '2', giaTri: '2' },
      { nhan: '3', giaTri: '3' },
      { nhan: '−', giaTri: '-' },
      { nhan: 'Xóa', hanhDong: xoaHet },
    ],
    [
      { nhan: '0', giaTri: '0' },
      { nhan: ',', giaTri: ',' },
      { nhan: '+', giaTri: '+' },
      { nhan: '=', hanhDong: tinhNgay, dacBiet: true },
    ],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Thiên Cơ Toán Bàn"
    >
      <div className="khung-ngoc-gian w-full max-w-sm rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-[#E4BC5A]/25 pb-2.5 mb-3">
          <div>
            <h3 className="tieu-de-vang text-lg font-bold">Thiên Cơ Toán Bàn</h3>
            <p className="text-xs text-[#9BA8BE]">Chế độ góc: Độ (°)</p>
          </div>
          <button
            type="button"
            onClick={dong}
            className="min-h-[40px] px-3 rounded border border-[#E4BC5A]/30 text-sm text-[#DCE6EA] hover:bg-[#1F2A4D] cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Man hinh nhap va ket qua */}
        <div className="rounded-lg border border-[#3FB59A]/40 bg-[#070B14] p-3 mb-3">
          <input
            type="text"
            value={bieuThuc}
            onChange={(e) => setBieuThuc(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') tinhNgay();
            }}
            placeholder="Ví dụ: sin(30) + sqrt(3)/2"
            aria-label="Biểu thức cần tính"
            className="w-full bg-transparent text-right text-base text-[#DCE6EA] focus:outline-none chu-so-bang"
          />
          <div className="mt-1.5 min-h-[28px] text-right text-xl font-bold text-[#F2D88B] chu-so-bang">
            {loi ? (
              <span className="text-sm text-[#F28A80] font-normal">{loi}</span>
            ) : ketQua ? (
              `= ${ketQua}`
            ) : (
              '0'
            )}
          </div>
        </div>

        {/* Ban phim */}
        <div className="space-y-1.5">
          {hangNut.map((hang, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-1.5">
              {hang.map((nut, nIdx) => (
                <button
                  key={nIdx}
                  type="button"
                  onClick={() =>
                    nut.hanhDong ? nut.hanhDong() : themKyTu(nut.giaTri || '')
                  }
                  className={`min-h-[42px] rounded text-sm font-semibold transition-colors cursor-pointer ${
                    nut.dacBiet
                      ? 'col-span-2 bg-[#1E7F6B] text-[#F8F6EE] hover:bg-[#2A947D] border border-[#62D1B5]/50'
                      : 'bg-[#141D33] text-[#DCE6EA] hover:bg-[#1F2A4D] border border-[#E4BC5A]/20'
                  }`}
                >
                  {nut.nhan}
                </button>
              ))}
            </div>
          ))}
        </div>

        {coTheChenKetQua && ketQua && khiChenKetQua && (
          <div className="mt-3 pt-3 border-t border-[#E4BC5A]/20">
            <NutLenhBai
              type="button"
              kieu="vang"
              className="w-full text-sm"
              onClick={() => {
                khiChenKetQua(ketQua);
                dong();
              }}
            >
              Chèn kết quả ({ketQua}) vào đáp án
            </NutLenhBai>
          </div>
        )}
      </div>
    </div>
  );
};
