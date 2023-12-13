import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer"

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs';

export { 
    pdfjsLib, pdfjsViewer
}
