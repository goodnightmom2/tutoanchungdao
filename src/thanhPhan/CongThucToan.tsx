import katex from 'katex';
import React from 'react';

interface ThuocTinhCongThuc {
  noiDung: string;
  className?: string;
}

/**
 * Hien thi chuoi van ban tieng Viet ket hop cong thuc LaTeX ($...$ va $$...$$) bang KaTeX.
 */
export const CongThucToan: React.FC<ThuocTinhCongThuc> = ({
  noiDung,
  className = '',
}) => {
  const tachPhan = (vanBan: string) => {
    const ketQua: { loai: 'chu' | 'noiDong' | 'khoi'; giaTri: string }[] = [];
    const regex = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
    let cuoi = 0;
    let khop: RegExpExecArray | null;

    while ((khop = regex.exec(vanBan)) !== null) {
      if (khop.index > cuoi) {
        ketQua.push({ loai: 'chu', giaTri: vanBan.slice(cuoi, khop.index) });
      }
      if (khop[1] !== undefined) {
        ketQua.push({ loai: 'khoi', giaTri: khop[1] });
      } else if (khop[2] !== undefined) {
        ketQua.push({ loai: 'noiDong', giaTri: khop[2] });
      }
      cuoi = regex.lastIndex;
    }

    if (cuoi < vanBan.length) {
      ketQua.push({ loai: 'chu', giaTri: vanBan.slice(cuoi) });
    }
    return ketQua;
  };

  const cacPhan = tachPhan(noiDung);

  return (
    <span className={`leading-relaxed break-words ${className}`}>
      {cacPhan.map((phan, idx) => {
        if (phan.loai === 'chu') {
          return <React.Fragment key={idx}>{phan.giaTri}</React.Fragment>;
        }
        try {
          const html = katex.renderToString(phan.giaTri, {
            displayMode: phan.loai === 'khoi',
            throwOnError: false,
            strict: false,
            trust: false,
            maxExpand: 500,
            maxSize: 100,
          });
          return (
            <span
              key={idx}
              className={
                phan.loai === 'khoi'
                  ? 'block my-2 overflow-x-auto text-center'
                  : 'inline mx-0.5'
              }
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={idx}>{phan.giaTri}</code>;
        }
      })}
    </span>
  );
};
