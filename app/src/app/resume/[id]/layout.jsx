export const metadata = {
    title: "Web Resume | CVGrid",
    description: "View this professional resume built using CVGrid.",
    robots: {
        index: false, // Prevent Google from indexing personal resumes containing emails/phones
        follow: false,
    }
};

export default function PublicResumeLayout({ children }) {
    return <>{children}</>;
}
