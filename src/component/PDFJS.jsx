import React, { useEffect, useState } from "react";
import { pdfjsLib, pdfjsViewer } from "./utils/worker";
import 'pdfjs-dist/web/pdf_viewer.css';
import './PDFJS.css';
import { PanelLeftInactive, ChevronUp, ChevronDown, Minus, Plus } from 'lucide-react';

const PdfViewerComponent = () => {
  const [pdfViewer, setPdfViewer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const initPdfViewer = async () => {
      if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
        alert("Please build the pdfjs-dist library using `gulp dist-install`");
        return;
      }

      const DEFAULT_URL = "horus.pdf";
      const ENABLE_XFA = true;
      // const SEARCH_FOR = "";

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

      /* Descomentar para estandarizar tamaño PDF's */
      // eventBus.on("pagesinit", function () {
      //   viewer.currentScaleValue = "page-width";
      //   if (SEARCH_FOR) {
      //     eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
      //   }
      // });

      eventBus.on('pagechanging', function pagechange(evt) {
        // console.log(evt)
        console.log('Página cambiada a ' + evt.pageNumber)
        setCurrentPage(evt.pageNumber);

      });
      // Loading document.
      const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        enableXfa: ENABLE_XFA,
      });

      const pdfDocument = await loadingTask.promise;
      setTotalPages(pdfDocument.numPages);
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
  const handleZoomIn = () => {
    if (pdfViewer) {
      const newScale = pdfViewer.currentScale + 0.1;
      if (newScale <= 2) { // Limit zoom in to 200%
        pdfViewer.currentScale = newScale;
      }
    }
  };

  const handleZoomOut = () => {
    if (pdfViewer) {
      const newScale = pdfViewer.currentScale - 0.1;
      if (newScale >= 0.75) { // Limit zoom out to 75%
        pdfViewer.currentScale = newScale;
      }
    }
  };

  const handlePageInputChange = (e) => {
    const inputText = e.target.value.replace(/[^0-9]/g, '');
    const pageNumber = inputText === '' ? '' : parseInt(inputText, 10);
    setCurrentPage(pageNumber);
  };
  
  
  const handlePageInputBlur = () => {
    if (pdfViewer) {
      pdfViewer.currentPageNumber = currentPage;
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter' && pdfViewer) {
      pdfViewer.currentPageNumber = currentPage;
    }
  };

  return (
    <div id="viewerContainer">
      <div id="viewer" className="pdfViewer"></div>

      <div className="toolbar">
        <div className="toolbarContainer">
          <div id="toolbarViewer">

            <div id="toolbarViewerLeft">
            <button className="normalized-btn">
            <PanelLeftInactive />
            </button>
            <div className="toolbarButtonSpacer"></div>
            <button onClick={handlePreviousPage} className="normalized-btn">
            <ChevronUp />
            </button>
            <div className="splitToolbarButtonSeparator"></div>
            <button onClick={handleNextPage} className="normalized-btn">
            <ChevronDown />
            </button>

          <input
                id="pageNumber"
                className="toolbarField"
                title="Página"
                pattern="[0-9]"
                type="number"
                value={currentPage}
                max={totalPages}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
              />

            <span id="numPages" className="toolbarLabel" >de 307</span>
            </div>

            <div id="toolbarViewerMiddle">
              
            <button id="zoomOut" className="toolbarButton normalized-btn" title="Alejar" tabIndex="21" onClick={handleZoomOut}>
            <Minus />
                    <span data-l10n-id="pdfjs-zoom-out-button-label">Alejar</span>
                  </button>
                  <div className="splitToolbarButtonSeparator"></div>
                  <button id="zoomIn" className="toolbarButton normalized-btn" title="Acercar" tabIndex="22" onClick={handleZoomIn}>
                    <span data-l10n-id="pdfjs-zoom-in-button-label">Acercar</span>
                    <Plus />
                   </button>
                
            </div>

            <div id="toolbarViewerRight">
              c
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerComponent;
