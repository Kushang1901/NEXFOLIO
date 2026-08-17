"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileImage,
  Download,
  ArrowLeft,
  Loader2,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import JSZip from "jszip";
import confetti from "canvas-confetti";

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Dynamic import of pdfjs-dist for SSR safety
  const pdfjsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamic import
      import("pdfjs-dist")
        .then((pdfjs) => {
          pdfjsRef.current = pdfjs;
          // Set worker
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
    renderPdfPages(pdfFile);
  };

  const renderPdfPages = async (pdfFile) => {
    if (!pdfjsRef.current) {
      setError("PDF engine is initializing, please try again in a second.");
      return;
    }

    setLoading(true);
    setLoadingProgress(0);

    try {
      const pdfjsLib = pdfjsRef.current;
      const fileReader = new FileReader();

      fileReader.onload = async function () {
        try {
          const typedarray = new Uint8Array(this.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          const renderedPages = [];

          for (let i = 1; i <= numPages; i++) {
            setLoadingProgress(Math.round(((i - 1) / numPages) * 100));
            const page = await pdf.getPage(i);

            // Set high scale for high resolution output
            const scale = 2.0;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;

            const dataUrl = canvas.toDataURL("image/png");
            renderedPages.push({
              pageNumber: i,
              dataUrl,
              fileName: `${pdfFile.name.replace(/\.[^/.]+$/, "")}_page_${i}.png`,
            });
          }

          setPages(renderedPages);
          setLoadingProgress(100);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch (err) {
          console.error("Inner render error:", err);
          setError("Error parsing PDF. The file might be corrupted or protected.");
        } finally {
          setLoading(false);
        }
      };

      fileReader.onerror = () => {
        setError("Error reading file.");
        setLoading(false);
      };

      fileReader.readAsArrayBuffer(pdfFile);
    } catch (err) {
      console.error("Outer render error:", err);
      setError("Failed to convert PDF. Please try a different document.");
      setLoading(false);
    }
  };

  const downloadPage = (page) => {
    const link = document.createElement("a");
    link.href = page.dataUrl;
    link.download = page.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (pages.length === 0) return;
    setLoading(true);

    try {
      const zip = new JSZip();
      const folderName = `${file.name.replace(/\.[^/.]+$/, "")}_images`;
      const imgFolder = zip.folder(folderName);

      pages.forEach((page) => {
        // Strip metadata from data URL
        const base64Data = page.dataUrl.split(",")[1];
        imgFolder.file(page.fileName, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("ZIP packaging error:", err);
      setError("Failed to create ZIP archive.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setError("");
    setLoadingProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col">
      {/* Back navigation */}
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
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ImageIcon className="w-5.5 h-5.5" />
          </span>
          PDF to PNG Converter
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl">
          Convert your PDF pages into high-resolution PNG images. Everything runs locally in your browser—completely secure and private.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Main Drag-Drop Workspace */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-8 group text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">
            Drag &amp; drop your PDF here
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            or click to browse from your computer. Max file size: Unlimited.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && pages.length === 0 && (
        <div className="flex-grow min-h-[350px] glass-panel rounded-2xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
          <h3 className="text-lg font-bold font-space-grotesk text-white mb-2">
            Processing PDF...
          </h3>
          <div className="w-48 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 mt-2">{loadingProgress}% completed</span>
        </div>
      )}

      {/* Results Workspace */}
      {pages.length > 0 && (
        <div className="flex flex-col gap-8 flex-grow">
          {/* File details panel */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileImage className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-grow sm:flex-grow-0">
                <h4 className="text-sm font-bold text-white truncate max-w-[250px] md:max-w-[400px]">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-400">
                  {pages.length} {pages.length === 1 ? "page" : "pages"} detected &bull; {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear File
              </button>
              <button
                onClick={downloadAllAsZip}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 hover:scale-102 transition-all duration-200"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Download All (ZIP)
              </button>
            </div>
          </div>

          {/* Grid list of converted pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[3/4] bg-white/[0.01] border-b border-white/5 flex items-center justify-center p-4">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="max-h-full max-w-full shadow-lg object-contain rounded"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white">
                    Page {page.pageNumber}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 flex items-center justify-between gap-4 mt-auto">
                  <span className="text-[11px] text-gray-400 truncate max-w-[130px]">
                    {page.fileName}
                  </span>
                  <button
                    onClick={() => downloadPage(page)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 text-gray-300 hover:text-indigo-200 transition-all duration-200"
                    title="Download page PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
