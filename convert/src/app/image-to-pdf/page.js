"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileImage,
  ArrowLeft,
  Loader2,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileDown,
  Images,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState("fit"); // fit, a4, letter
  const [orientation, setOrientation] = useState("portrait"); // portrait, landscape
  const [margin, setMargin] = useState("none"); // none, thin, standard
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleImageFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleImageFiles(selectedFiles);
  };

  const handleImageFiles = (files) => {
    setError("");
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const validFiles = files.filter((file) => validImageTypes.includes(file.type));

    if (validFiles.length === 0) {
      setError("Please upload valid images (JPG, PNG, WebP).");
      return;
    }

    const newImages = validFiles.map((file) => {
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      };
    });

    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    const temp = updatedImages[index];
    updatedImages[index] = updatedImages[newIndex];
    updatedImages[newIndex] = temp;
    setImages(updatedImages);
  };

  const deleteImage = (id) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.previewUrl);
    }
    setImages(images.filter((img) => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const imgObj = images[i];

        // Draw image onto a canvas to convert it into a standard JPEG format
        // This resolves any cross-format support issues (like WebP) in pdf-lib
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const imagePromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
          img.src = imgObj.previewUrl;
        });

        const img = await imagePromise;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // Convert to high-quality JPEG
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const base64Data = jpegDataUrl.split(",")[1];
        const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        // Embed the image in PDF
        const embeddedImage = await pdfDoc.embedJpg(bytes);
        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = imgWidth;
        let pageHeight = imgHeight;

        // Apply margins
        let marginSize = 0;
        if (margin === "thin") marginSize = 20;
        if (margin === "standard") marginSize = 40;

        // Custom page size scaling
        if (pageSize === "a4") {
          pageWidth = orientation === "portrait" ? 595.28 : 841.89;
          pageHeight = orientation === "portrait" ? 841.89 : 595.28;
        } else if (pageSize === "letter") {
          pageWidth = orientation === "portrait" ? 612 : 792;
          pageHeight = orientation === "portrait" ? 792 : 612;
        } else {
          // Fit image size
          pageWidth = imgWidth + marginSize * 2;
          pageHeight = imgHeight + marginSize * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate size to draw
        let drawWidth = pageWidth - marginSize * 2;
        let drawHeight = pageHeight - marginSize * 2;

        const imgRatio = imgWidth / imgHeight;
        const pageRatio = drawWidth / drawHeight;

        if (pageSize !== "fit") {
          // Scale to fit constraints maintaining aspect ratio
          if (imgRatio > pageRatio) {
            drawHeight = drawWidth / imgRatio;
          } else {
            drawWidth = drawHeight * imgRatio;
          }
        }

        // Center the image on the page
        const xOffset = marginSize + (pageWidth - marginSize * 2 - drawWidth) / 2;
        const yOffset = marginSize + (pageHeight - marginSize * 2 - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x: xOffset,
          y: yOffset,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `converted_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Make sure none of the files are corrupted.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
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
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Images className="w-5.5 h-5.5" />
          </span>
          PNG to PDF Converter
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl">
          Convert and combine PNG, JPG, or WebP images into a single high-quality PDF document. Customize layout sizes and order on the fly.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Workspace Area */}
      {images.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow min-h-[350px] rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-8 group text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">
            Drag &amp; drop your images here
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Supports PNG, JPG, WebP, and GIF. Select multiple files at once.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Main workspace (image list) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">
                {images.length} {images.length === 1 ? "image" : "images"} uploaded
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-gray-300 hover:text-emerald-300 text-xs font-semibold transition-all duration-200"
              >
                + Add More Images
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
              />
            </div>

            {/* Grid of uploaded images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-black/20 flex items-center justify-center p-4">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="max-h-full max-w-full object-contain rounded shadow"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white">
                      Page {idx + 1}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <span className="text-xs text-gray-300 truncate" title={img.name}>
                      {img.name}
                    </span>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveImage(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move up / left"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(idx, 1)}
                          disabled={idx === images.length - 1}
                          className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move down / right"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="text-base font-bold font-space-grotesk text-white">
                Layout Settings
              </h3>

              {/* Page size settings */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="fit">Fit to Image Size</option>
                  <option value="a4">A4 Size</option>
                  <option value="letter">US Letter Size</option>
                </select>
              </div>

              {/* Page orientation setting (conditional) */}
              {pageSize !== "fit" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              )}

              {/* Page margin setting */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Margins
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">No Margin (0px)</option>
                  <option value="thin">Thin Margin (20px)</option>
                  <option value="standard">Standard Margin (40px)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
                <button
                  onClick={generatePdf}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 hover:scale-102 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4.5 h-4.5" />
                      Generate PDF
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
