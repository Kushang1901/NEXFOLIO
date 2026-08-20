"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  Loader2,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileDown,
  Images,
  Plus,
  Layers,
  Settings2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";

export default function ImageToPdfClient() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState("fit"); // fit, a4, letter
  const [orientation, setOrientation] = useState("portrait"); // portrait, landscape
  const [margin, setMargin] = useState("none"); // none, thin, standard
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

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
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/bmp",
      "image/svg+xml",
    ];
    const validFiles = files.filter(
      (file) =>
        validImageTypes.includes(file.type) ||
        /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      setError("Please upload valid images (JPG, PNG, WebP, GIF).");
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
    if (addMoreInputRef.current) addMoreInputRef.current.value = "";
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

        // Convert to high-quality JPEG (0.95 quality)
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
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
      link.download = `CVGrid_Images_${images.length}_pages.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 85,
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
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-space-grotesk text-white flex items-center justify-center md:justify-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Images className="w-5.5 h-5.5" />
            </span>
            Multiple Images to PDF Converter
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Stack and combine multiple PNG, JPG, WebP, or GIF images into a clean, formatted PDF document. Reorder pages, select standard paper sizes (A4, Letter, Fit), and set custom margins.
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => addMoreInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
            >
              <Plus size={15} /> Add Images
            </button>
            <input
              ref={addMoreInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={reset}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Clear all images"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
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
            <Upload className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-space-grotesk">
            Drop your images here
          </h2>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Supports multiple JPG, PNG, WebP, and GIF files. Stack certificates, resumes, portfolio photos, or screenshots in one PDF.
          </p>
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            Select Multiple Images
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Configuration Bar */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Page Size */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Page Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["fit", "a4", "letter"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className={`py-2 text-xs font-medium rounded-lg capitalize border transition-all duration-200 ${
                      pageSize === size
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {size === "fit" ? "Fit Image" : size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["portrait", "landscape"].map((orient) => (
                  <button
                    key={orient}
                    onClick={() => setOrientation(orient)}
                    disabled={pageSize === "fit"}
                    className={`py-2 text-xs font-medium rounded-lg capitalize border transition-all duration-200 ${
                      pageSize === "fit"
                        ? "opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-gray-500"
                        : orientation === orient
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {orient}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Margins
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["none", "thin", "standard"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargin(m)}
                    className={`py-2 text-xs font-medium rounded-lg capitalize border transition-all duration-200 ${
                      margin === m
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Images Grid / Sort List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group rounded-xl border border-white/5 bg-white/[0.02] p-2 flex flex-col hover:border-emerald-500/30 transition-all duration-200"
              >
                {/* Page Number Badge */}
                <div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  {index + 1}
                </div>

                {/* Actions Overlay */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {index > 0 && (
                    <button
                      onClick={() => moveImage(index, -1)}
                      className="w-7 h-7 rounded-lg bg-black/70 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => moveImage(index, 1)}
                      className="w-7 h-7 rounded-lg bg-black/70 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="w-7 h-7 rounded-lg bg-red-500/80 border border-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail Image */}
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-black/40 mb-2 flex items-center justify-center">
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* File info */}
                <div className="px-1 mt-auto">
                  <p className="text-xs text-gray-300 truncate font-medium">
                    {img.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {(img.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={generatePdf}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Compiling {images.length} Pages...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Convert {images.length} Images to PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
