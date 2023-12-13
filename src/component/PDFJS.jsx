import React, { useEffect, useState } from "react";
import { pdfjsLib, pdfjsViewer } from "./utils/worker";
import './PDFJS.css';
import 'pdfjs-dist/web/pdf_viewer.css';

const PdfViewerComponent = () => {
  const [pdfViewer, setPdfViewer] = useState(null);

  useEffect(() => {
    const initPdfViewer = async () => {
      if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
        alert("Please build the pdfjs-dist library using `gulp dist-install`");
        return;
      }

      const DEFAULT_URL = "horus.pdf";
      const ENABLE_XFA = true;
      const SEARCH_FOR = "";

      const container = document.getElementById("viewerContainer");

      const eventBus = new pdfjsViewer.EventBus();
      const pdfLinkService = new pdfjsViewer.PDFLinkService({ eventBus });
      const pdfFindController = new pdfjsViewer.PDFFindController({
        eventBus,
        linkService: pdfLinkService,
      });
      const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
        eventBus,
      });

      const viewer = new pdfjsViewer.PDFViewer({
        container,
        eventBus,
        linkService: pdfLinkService,
        findController: pdfFindController,
        scriptingManager: pdfScriptingManager,
      });

      pdfLinkService.setViewer(viewer);
      pdfScriptingManager.setViewer(viewer);

      eventBus.on("pagesinit", function () {
        viewer.currentScaleValue = "page-width";
        if (SEARCH_FOR) {
          eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
        }
      });

      eventBus.on('pagechanging', function pagechange(evt) { 
        console.log(evt)
        console.log('Página cambiada a ' + evt.pageNumber)
     });
      // Loading document.
      const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        enableXfa: ENABLE_XFA,
      });

      const pdfDocument = await loadingTask.promise;
      viewer.setDocument(pdfDocument);

      pdfLinkService.setDocument(pdfDocument, null);
      setPdfViewer(viewer);
    };

    initPdfViewer();
  }, []);

  const handlePreviousPage = () => {
    if (pdfViewer) {
      pdfViewer.currentPageNumber -= 1;
    }
  };

  const handleNextPage = () => {
    if (pdfViewer) {
      pdfViewer.currentPageNumber += 1;
    }
  };

  return (
    <div id="viewerContainer">
      <div id="viewer" className="pdfViewer"></div>
      <div className="navigation-buttons">
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default PdfViewerComponent;
