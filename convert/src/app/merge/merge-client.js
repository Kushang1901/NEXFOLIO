"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Loader2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  FileStack,
  FolderOpen,
  CheckCircle,
  FileCode,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handlePdfFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handlePdfFiles(selectedFiles);
  };

  const handlePdfFiles = async (selectedFiles) => {
    setError("");
    const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }

    setLoading(true);
    try {
      const newFiles = [];

      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        const arrayBuffer = await file.arrayBuffer();

        // Load document to get details (page count, if encrypted, etc.)
        let pageCount = 0;
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } catch (err) {
          console.error("Error reading pdf metadata:", err);
          // If password protected, it will throw here
        }

        newFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          pageCount: pageCount || "?",
          arrayBuffer,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
    } catch (err) {
      console.error(err);
      setError("Error reading PDF files. Ensure they are not password protected.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const moveFile = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;

    const updatedFiles = [...files];
    const temp = updatedFiles[index];
    updatedFiles[index] = updatedFiles[newIndex];
    updatedFiles[newIndex] = temp;
    setFiles(updatedFiles);
  };

  const deleteFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        const srcPdf = await PDFDocument.load(fileObj.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          srcPdf,
          srcPdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("PDF merge error:", err);
      setError("Failed to merge PDF files. Some files might be encrypted or corrupted.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
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
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
            <FileStack className="w-5.5 h-5.5" />
          </span>
          Merge PDF Documents
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl">
          Combine multiple PDF files in any order you choose. Instantly merge Cover Letters, Portfolios, and CVs on your device.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Workspace Area */}
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-8 group text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            multiple
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">
            Drag &amp; drop your PDF files here
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Select 2 or more PDF documents. Processing is 100% private.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* File list pane */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">
                {files.length} {files.length === 1 ? "file" : "files"} listed
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 text-gray-300 hover:text-purple-300 text-xs font-semibold transition-all duration-200"
              >
                + Add More PDFs
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                multiple
                className="hidden"
              />
            </div>

            {/* List of files with drag/sort controls */}
            <div className="flex flex-col gap-4">
              {files.map((fileObj, idx) => (
                <div
                  key={fileObj.id}
                  className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <FileText className="w-5.5 h-5.5" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className="text-sm font-bold text-white truncate max-w-[250px] md:max-w-[450px]">
                        {fileObj.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fileObj.pageCount} {fileObj.pageCount === 1 ? "page" : "pages"} &bull; {(fileObj.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {/* Actions & Sorting */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-1.5 border-r border-white/5 pr-3.5">
                      <button
                        onClick={() => moveFile(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 1)}
                        disabled={idx === files.length - 1}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => deleteFile(fileObj.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge PDF sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="text-base font-bold font-space-grotesk text-white">
                Merge Summary
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Files</span>
                  <span className="font-semibold text-white">{files.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Pages</span>
                  <span className="font-semibold text-white">
                    {files.reduce((acc, f) => acc + (typeof f.pageCount === "number" ? f.pageCount : 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Size</span>
                  <span className="font-semibold text-white">
                    {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
                <button
                  onClick={mergePdfs}
                  disabled={loading || files.length < 2}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 hover:scale-102 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <FileStack className="w-4.5 h-4.5" />
                      Merge Files
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-300 text-sm font-semibold transition-all duration-200"
                >
                  Reset Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
