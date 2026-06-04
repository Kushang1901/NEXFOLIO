"use client";

import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../authState";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            if (!user) {
                router.push("/signup");
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            {/* Hero Section */}
            <header className="bg-black py-5">
                <div className="container py-5">
                    <div className="row justify-content-center text-center py-5">
                        <div className="col-lg-8">
                            <h1
                                className="display-1 fw-bold mb-4"
                                style={{ letterSpacing: '-0.02em' }}
                            >
                                ResumeCraft AI
                            </h1>
                            <p className="lead fs-3 text-white-50 mb-5">
                                Create AI-crafted resumes instantly — smart, simple and professional.
                            </p>

                            <Link
                                href="/templates"
                                className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                                style={{
                                    fontSize: "1.1rem",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.4)"
                                }}
                            >
                                Build Resume
                            </Link>

                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-5 bg-dark">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h4 fw-bold mb-3">AI Generated Content</h3>
                                    <p className="text-white-50 mb-0">
                                        Leverage artificial intelligence to create compelling resume content tailored to your experience and skills.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h4 fw-bold mb-3">Fast Resume Builder</h3>
                                    <p className="text-white-50 mb-0">
                                        Build professional resumes in minutes with our intuitive interface and smart templates.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h4 fw-bold mb-3">Download as PDF</h3>
                                    <p className="text-white-50 mb-0">
                                        Export your polished resume as a high-quality PDF ready to send to employers instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-black">
                <div className="container py-5">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-4">
                                Your Dream Job Starts Here
                            </h2>
                            <button
                                className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                                style={{
                                    fontSize: "1.1rem",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.4)"
                                }}
                                onClick={() => router.push("/signup")}
                            >
                                Start Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black border-top border-secondary py-4">
                <div className="container">
                    <div className="text-center text-white-50">
                        <p className="mb-1">
                            &copy; 2025 ResumeCraft AI. All rights reserved.
                        </p>
                        <p className="mb-0">
                            Designed &amp; Developed by{" "}
                            <a
                                href="https://kushangacharya.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-info fw-semibold text-decoration-none"
                            >
                                Kushang Acharya
                            </a>
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
