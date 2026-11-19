export async function xuatSvgThanhPng(
  svgEl: SVGSVGElement | null,
  tenTep: string,
  rong = 900,
  cao = 950
): Promise<boolean> {
  if (!svgEl || typeof window === 'undefined') return false;

  try {
    const banSao = svgEl.cloneNode(true) as SVGSVGElement;
    banSao.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    banSao.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    if (!banSao.getAttribute('viewBox')) {
      banSao.setAttribute('viewBox', '0 0 280 296');
    }
    banSao.setAttribute('width', String(rong));
    banSao.setAttribute('height', String(cao));

    const chuoiSvg = new XMLSerializer().serializeToString(banSao);
    const blobSvg = new Blob([chuoiSvg], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const urlSvg = URL.createObjectURL(blobSvg);

    const hinh = new Image();
    const taiXong = await new Promise<boolean>((resolve) => {
      hinh.onload = () => resolve(true);
      hinh.onerror = () => resolve(false);
      hinh.src = urlSvg;
    });

    if (!taiXong) {
      URL.revokeObjectURL(urlSvg);
      return false;
    }

    const canvas = document.createElement('canvas');
    canvas.width = rong;
    canvas.height = cao;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(urlSvg);
      return false;
    }

    // Nen xanh dem thanh nha de anh tai xuong sac net, khong bi trong suot mat chi tiet sang
    const nen = ctx.createLinearGradient(0, 0, 0, cao);
    nen.addColorStop(0, '#0B1426');
    nen.addColorStop(1, '#162544');
    ctx.fillStyle = nen;
    ctx.fillRect(0, 0, rong, cao);

    ctx.drawImage(hinh, 0, 0, rong, cao);
    URL.revokeObjectURL(urlSvg);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = tenTep.endsWith('.png') ? tenTep : `${tenTep}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    return false;
  }
}
