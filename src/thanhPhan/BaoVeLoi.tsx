import React from 'react';

interface TrangThaiBaoVeLoi {
  coLoi: boolean;
  thongDiep: string;
}

export class BaoVeLoi extends React.Component<
  { children: React.ReactNode },
  TrangThaiBaoVeLoi
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { coLoi: false, thongDiep: '' };
  }

  static getDerivedStateFromError(error: unknown): TrangThaiBaoVeLoi {
    const msg =
      error instanceof Error ? error.message : 'Đã xảy ra sự cố không mong muốn.';
    return { coLoi: true, thongDiep: msg };
  }

  componentDidCatch(error: unknown) {
    console.error('Lỗi giao diện:', error);
  }

  render() {
    if (this.state.coLoi) {
      return (
        <div className="min-h-[100dvh] bg-[#070B14] text-[#DCE6EA] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-[#E4BC5A]/50 bg-[#0D1424] p-6 text-center space-y-4 shadow-2xl">
            <div className="dau-an-trang-tri text-xs uppercase text-[#F28A80] font-bold">
              Cảnh Báo Linh Mạch
            </div>
            <h1 className="tieu-de-vang text-2xl font-bold">
              Trận Pháp Gặp Trục Trặc
            </h1>
            <p className="text-sm text-[#DCE6EA]/85 leading-relaxed">
              Ứng dụng vừa gặp lỗi ngoài dự kiến. Dữ liệu tu luyện của bạn vẫn được bảo vệ an toàn.
            </p>
            {this.state.thongDiep && (
              <div className="rounded-lg border border-[#1F2A4D] bg-[#070B14] p-2.5 text-xs text-[#9BA8BE] break-words">
                {this.state.thongDiep}
              </div>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="lenh-bai-vat min-h-[44px] px-6 py-2.5 bg-[#1E7F6B] border border-[#62D1B5] text-[#F8F6EE] text-sm font-semibold cursor-pointer"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
