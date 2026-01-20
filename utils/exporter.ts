import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export React Flow canvas as PNG image
 */
export const exportAsImage = async (elementId: string, filename: string = 'docker-compose-viz.png'): Promise<void> => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (!element) {
    throw new Error('Could not find React Flow element');
  }

  const isDark = document.documentElement.classList.contains('dark');
  const canvas = await html2canvas(element, {
    backgroundColor: isDark ? '#020617' : '#f8fafc',
    scale: 2,
    logging: false,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Export React Flow canvas as SVG
 */
export const exportAsSVG = (elementId: string, filename: string = 'docker-compose-viz.svg'): void => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (!element) {
    throw new Error('Could not find React Flow element');
  }

  // Get SVG from React Flow
  const svgElement = element.querySelector('svg');
  if (!svgElement) {
    throw new Error('Could not find SVG element');
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = svgUrl;
  link.click();

  URL.revokeObjectURL(svgUrl);
};

/**
 * Export visualization and YAML as PDF
 */
export const exportAsPDF = async (
  yamlContent: string,
  elementId: string,
  filename: string = 'docker-compose-viz.pdf'
): Promise<void> => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (!element) {
    throw new Error('Could not find React Flow element');
  }

  const isDark = document.documentElement.classList.contains('dark');
  const canvas = await html2canvas(element, {
    backgroundColor: isDark ? '#020617' : '#f8fafc',
    scale: 2,
    logging: false,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgScaledWidth = imgWidth * ratio;
  const imgScaledHeight = imgHeight * ratio;
  const xOffset = (pdfWidth - imgScaledWidth) / 2;
  const yOffset = (pdfHeight - imgScaledHeight) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
  
  // Add YAML content on a new page
  pdf.addPage();
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(yamlContent, pdfWidth - 20);
  pdf.text(lines, 10, 10);

  pdf.save(filename);
};
