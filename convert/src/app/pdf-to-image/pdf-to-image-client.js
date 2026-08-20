"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Download,
  ArrowLeft,
  Loader2,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Plus,
  RefreshCw,
  FolderArchive,
  Layers,
} from "lucide-react";
import JSZip from "jszip";
import confetti from "canvas-confetti";

export default function PdfToImageClient() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("image/png"); // image/png or image/jpeg
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

  // Dynamic import of pdfjs-dist for SSR safety
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
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (files.length > 0) {
      processFiles(files);
    } else {
      setError("Please drop valid PDF files.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (files.length > 0) {
      processFiles(files);
    } else if (e.target.files.length > 0) {
      setError("Please select valid PDF files.");
    }
    if (e.target) e.target.value = "";
  };

  const processFiles = async (newFiles) => {
    if (!pdfjsRef.current) {
      setError("PDF engine is initializing, please try again in a moment.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const pdfjsLib = pdfjsRef.current;
      const processedDocs = [];
      const totalDocs = newFiles.length;

      for (let docIdx = 0; docIdx < totalDocs; docIdx++) {
        const file = newFiles[docIdx];
        const docId = Math.random().toString(36).substring(2, 9);
        setProgressText(`Processing PDF ${docIdx + 1} of ${totalDocs}: ${file.name}`);

        const fileBuffer = await file.arrayBuffer();
        const typedarray = new Uint8Array(fileBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const renderedPages = [];

        for (let i = 1; i <= numPages; i++) {
          const overallProgress = Math.round(
            ((docIdx + (i / numPages)) / totalDocs) * 100
          );
          setProgressPercent(overallProgress);
          setProgressText(`Rendering ${file.name} (page ${i}/${numPages})...`);

          const page = await pdf.getPage(i);
          // High resolution scale (2.0x)
          const scale = 2.0;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          const ext = outputFormat === "image/jpeg" ? "jpg" : "png";
          const dataUrl = canvas.toDataURL(outputFormat, 0.95);
          const baseName = file.name.replace(/\.[^/.]+$/, "");

          renderedPages.push({
            pageNumber: i,
            dataUrl,
            fileName: `${baseName}_page_${i}.${ext}`,
          });
        }

        processedDocs.push({
          id: docId,
          name: file.name,
          size: file.size,
          pageCount: numPages,
          pages: renderedPages,
        });
      }

      setPdfFiles((prev) => {
        const updated = [...prev, ...processedDocs];
        if (!selectedDocId && updated.length > 0) {
          setSelectedDocId(updated[0].id);
        }
        return updated;
      });

      setProgressPercent(100);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("PDF Render Error:", err);
      setError("Error processing one or more PDF files. Protected or corrupted PDFs cannot be converted.");
    } finally {
      setLoading(false);
      setProgressText("");
    }
  };

  const removeDoc = (id) => {
    setPdfFiles((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (selectedDocId === id) {
        setSelectedDocId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const clearAll = () => {
    setPdfFiles([]);
    setSelectedDocId(null);
    setError("");
  };

  const downloadSinglePage = (page) => {
    const link = document.createElement("a");
    link.href = page.dataUrl;
    link.download = page.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDocZip = async (doc) => {
    const zip = new JSZip();
    const folderName = doc.name.replace(/\.[^/.]+$/, "");
    const ext = outputFormat === "image/jpeg" ? "jpg" : "png";

    doc.pages.forEach((page) => {
      const base64Data = page.dataUrl.split(",")[1];
      zip.file(page.fileName, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}_images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const downloadAllZip = async () => {
    if (pdfFiles.length === 0) return;
    const zip = new JSZip();

    pdfFiles.forEach((doc) => {
      const docFolder = doc.name.replace(/\.[^/.]+$/, "");
      doc.pages.forEach((page) => {
        const base64Data = page.dataUrl.split(",")[1];
        if (pdfFiles.length === 1) {
          zip.file(page.fileName, base64Data, { base64: true });
        } else {
          zip.folder(docFolder).file(page.fileName, base64Data, { base64: true });
        }
      });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `CVGrid_Converted_PDF_Images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const totalPagesCount = pdfFiles.reduce((acc, d) => acc + d.pages.length, 0);
  const activeDoc = pdfFiles.find((d) => d.id === selectedDocId) || pdfFiles[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex-grow w-full">
      {/* Header / Back Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to All PDF Tools
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-space-grotesk text-white">
              Multiple PDF to Image Converter
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Convert single or multiple PDF documents into high-resolution PNG or JPG images. 100% private, local client-side processing.
            </p>
          </div>

          {pdfFiles.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => addMoreInputRef.current?.click()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
              >
                <Plus size={15} /> Add More PDFs
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={downloadAllZip}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all"
              >
                <FolderArchive size={16} /> Download All ({totalPagesCount} Images)
              </button>
              <button
                onClick={clearAll}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Clear all files"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Zone when no files */}
      {pdfFiles.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-white/[0.02] hover:bg-indigo-500/[0.02] rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden max-w-3xl mx-auto my-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
            Drop your PDF files here
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
            Select one or multiple PDF documents. Convert resume pages, portfolios, contracts, or certificates into high-quality images.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/25">
            <Layers size={16} /> Browse Multiple PDFs
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✓ Batch upload enabled</span>
            <span>✓ 100% Private (0 upload)</span>
            <span>✓ High-res 2x scaling</span>
          </div>
        </div>
      )}

      {/* Progress & Error indicators */}
      {loading && (
        <div className="max-w-2xl mx-auto my-8 p-6 glass-panel rounded-2xl border border-blue-500/20 text-center">
          <Loader2 className="animate-spin text-blue-400 mx-auto mb-3" size={32} />
          <p className="text-white font-medium text-sm mb-2">{progressText || "Processing PDF pages..."}</p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{progressPercent}% complete</span>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto my-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Processed Documents View */}
      {pdfFiles.length > 0 && !loading && (
        <div className="space-y-8 mt-6">
          {/* Document Tabs selector if multiple PDFs */}
          {pdfFiles.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
              {pdfFiles.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    selectedDocId === doc.id
                      ? "bg-blue-500/20 border border-blue-500/30 text-blue-300 shadow-md shadow-blue-500/10"
                      : "bg-white/5 hover:bg-white/10 text-gray-400 border border-transparent"
                  }`}
                >
                  <FileText size={15} />
                  <span className="max-w-[160px] truncate">{doc.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {doc.pages.length}p
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Active Document Details & Page Grid */}
          {activeDoc && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText size={18} className="text-blue-400" />
                    {activeDoc.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activeDoc.pages.length} total pages rendered · {(activeDoc.size / (1024 * 1024)).toFixed(2)} MB source
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadDocZip(activeDoc)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-gray-200 transition-colors"
                  >
                    <Download size={14} /> Download {activeDoc.pages.length} Pages (ZIP)
                  </button>
                  <button
                    onClick={() => removeDoc(activeDoc.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Remove this PDF"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Grid of rendered pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeDoc.pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="group relative rounded-xl border border-white/10 bg-black/40 p-3 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-white/5 flex items-center justify-center mb-3">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber} of ${activeDoc.name}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          onClick={() => downloadSinglePage(page)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 shadow-md"
                        >
                          <Download size={12} /> Save Image
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-medium text-gray-300">Page {page.pageNumber}</span>
                      <button
                        onClick={() => downloadSinglePage(page)}
                        className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                      >
                        <Download size={12} /> PNG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
