"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Loader2,
  Trash2,
  ArrowLeft,
  Scissors,
  Download,
  Info,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [rangeText, setRangeText] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Dynamic import of pdfjs-dist for preview thumbnail rendering
  const pdfjsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist")
        .then((pdfjs) => {
          pdfjsRef.current = pdfjs;
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        })
        .catch((err) => console.error("Error loading PDF.js:", err));
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      processFile(droppedFile);
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      processFile(selectedFile);
    } else if (selectedFile) {
      setError("Please select a valid PDF file.");
    }
  };

  const processFile = (pdfFile) => {
    setFile(pdfFile);
    setError("");
    setPages([]);
    setSelectedPages(new Set());
    setRangeText("");
    renderThumbnails(pdfFile);
  };

  const renderThumbnails = async (pdfFile) => {
    if (!pdfjsRef.current) {
      setError("PDF engine is initializing. Please try again in a second.");
      return;
    }

    setLoading(true);
    setLoadingProgress(0);

    try {
      const pdfjsLib = pdfjsRef.current;
      const arrayBuffer = await pdfFile.arrayBuffer();
      const typedarray = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: typedarray });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const renderedPages = [];

      for (let i = 1; i <= numPages; i++) {
        setLoadingProgress(Math.round(((i - 1) / numPages) * 100));
        const page = await pdf.getPage(i);

        // Low scale (0.5) is enough for thumbnails, rendering is very fast
        const scale = 0.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        renderedPages.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL("image/jpeg", 0.7),
        });
      }

      setPages(renderedPages);
      setLoadingProgress(100);
    } catch (err) {
      console.error("Thumbnail render error:", err);
      setError("Failed to read PDF pages. Make sure the file is not protected.");
    } finally {
      setLoading(false);
    }
  };

  // Convert set of page numbers (1-indexed) to range text
  const updateRangeTextFromSet = (set) => {
    if (set.size === 0) {
      setRangeText("");
      return;
    }

    const sortedPages = Array.from(set).sort((a, b) => a - b);
    const ranges = [];
    let start = sortedPages[0];
    let end = start;

    for (let i = 1; i < sortedPages.length; i++) {
      if (sortedPages[i] === end + 1) {
        end = sortedPages[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sortedPages[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    setRangeText(ranges.join(", "));
  };

  // Parse range text and update selected pages set
  const handleRangeTextChange = (text) => {
    setRangeText(text);
    if (!text.trim()) {
      setSelectedPages(new Set());
      return;
    }

    const newSelected = new Set();
    const parts = text.split(/[\s,]+/);

    for (const part of parts) {
      if (!part) continue;
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= pages.length) {
              newSelected.add(i);
            }
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page >= 1 && page <= pages.length) {
          newSelected.add(page);
        }
      }
    }

    setSelectedPages(newSelected);
  };

  const handlePageSelect = (pageNumber) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNumber)) {
      updated.delete(pageNumber);
    } else {
      updated.add(pageNumber);
    }
    setSelectedPages(updated);
    updateRangeTextFromSet(updated);
  };

  const selectAll = () => {
    const all = new Set(pages.map((p) => p.pageNumber));
    setSelectedPages(all);
    updateRangeTextFromSet(all);
  };

  const selectNone = () => {
    setSelectedPages(new Set());
    setRangeText("");
  };

  const splitPdf = async () => {
    if (selectedPages.size === 0) {
      setError("Please select at least one page to extract.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);
      const splitPdf = await PDFDocument.create();

      // Convert 1-indexed page selections to 0-indexed indices for pdf-lib
      const indicesToCopy = Array.from(selectedPages)
        .sort((a, b) => a - b)
        .map((p) => p - 1);

      const copiedPages = await splitPdf.copyPages(srcPdf, indicesToCopy);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const pdfBytes = await splitPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.replace(/\.[^/.]+$/, "")}_extracted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("Split compilation error:", err);
      setError("Failed to extract pages from PDF.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setSelectedPages(new Set());
    setRangeText("");
    setError("");
  };

  return (
    <div className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 decoration-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold font-space-grotesk text-white flex items-center justify-center md:justify-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Scissors className="w-5.5 h-5.5" />
          </span>
          Split PDF Pages
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl">
          Extract specific pages or page ranges from a PDF document. Select pages visually by clicking thumbnails or by writing range values.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Workspace Area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 hover:border-amber-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-8 group text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">
            Drag &amp; drop your PDF file here
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Select a PDF document. Processing is 100% private.
          </p>
        </div>
      ) : loading && pages.length === 0 ? (
        <div className="flex-grow min-h-[350px] glass-panel rounded-2xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold font-space-grotesk text-white mb-2">
            Reading PDF Pages...
          </h3>
          <div className="w-48 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 mt-2">{loadingProgress}% completed</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Main visually selected thumbnails */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 font-medium">
                  {selectedPages.size} of {pages.length} pages selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={selectNone}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  Select None
                </button>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {pages.map((p) => {
                const isSelected = selectedPages.has(p.pageNumber);
                return (
                  <div
                    key={p.pageNumber}
                    onClick={() => handlePageSelect(p.pageNumber)}
                    className={`glass-panel rounded-xl overflow-hidden border transition-all duration-250 cursor-pointer flex flex-col relative group ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    {/* Visual Check Indicator */}
                    <div
                      className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-200 z-10 ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-white scale-110 shadow-md"
                          : "bg-black/40 border-white/20 text-transparent"
                      }`}
                    >
                      ✓
                    </div>

                    <div className="aspect-[3/4] bg-white/[0.01] p-3 flex items-center justify-center relative">
                      <img
                        src={p.dataUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="max-h-full max-w-full object-contain rounded shadow transition-transform group-hover:scale-102"
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-bold text-white">
                        Page {p.pageNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar configuration */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 sticky top-24">
              <h3 className="text-base font-bold font-space-grotesk text-white">
                Split Settings
              </h3>

              {/* Range input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  Page Ranges <Info className="w-3.5 h-3.5 text-gray-500" title="Example: 1, 3-5, 8" />
                </label>
                <input
                  type="text"
                  value={rangeText}
                  onChange={(e) => handleRangeTextChange(e.target.value)}
                  placeholder="e.g. 1, 3-5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                  Type ranges (like `1-3`) or click thumbnails to build selection.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
                <button
                  onClick={splitPdf}
                  disabled={loading || selectedPages.size === 0}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 hover:scale-102 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Splitting PDF...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4.5 h-4.5" />
                      Split PDF
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-300 text-sm font-semibold transition-all duration-200"
                >
                  Clear Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
