import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function exportToMarkdown(title: string, content: string) {
  const blob = new Blob([`# ${title}\n\n${content}`], {
    type: 'text/markdown',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToHTML(title: string, content: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${content}
</body>
</html>
  `.trim();

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(
  title: string,
  element: HTMLElement
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  let imgY = 10;

  pdf.text(title, pdfWidth / 2, 10, { align: 'center' });
  imgY = 20;

  pdf.addImage(
    imgData,
    'PNG',
    imgX,
    imgY,
    imgWidth * ratio,
    imgHeight * ratio
  );

  pdf.save(`${sanitizeFilename(title)}.pdf`);
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/gi, '_').substring(0, 100);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
