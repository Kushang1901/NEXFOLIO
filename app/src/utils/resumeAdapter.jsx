export const normalizeResumeData = (raw) => {
    if (!raw) return {};

    const basics = raw.basics || {};
    const links = basics.links || {};

    return {
        basics: {
            name: raw.fullName || basics.name || "",
            role: raw.role || basics.role || "",
            email: raw.email || basics.email || "",
            phone: raw.phone || basics.phone || "",
            photo: (raw.profilePhoto || basics.photo)
                ? ((raw.profilePhoto || basics.photo).startsWith("http")
                    ? `/api/image-proxy?url=${encodeURIComponent(raw.profilePhoto || basics.photo)}`
                    : (raw.profilePhoto || basics.photo))
                : "",
            links: {
                portfolio: raw.portfolio || links.portfolio || "",
                linkedin: raw.linkedin || links.linkedin || "",
                github: raw.github || links.github || ""
            }
        },

        summary: raw.professionalSummary || raw.summary || "",

        education: [
            (raw.graduation && typeof raw.graduation === "object")
                ? {
                    level: "Graduation",
                    course: raw.graduation.course || "",
                    start: [raw.graduation.startMonth, raw.graduation.startYear].filter(Boolean).join(" "),
                    end: [raw.graduation.endMonth, raw.graduation.endYear].filter(Boolean).join(" ")
                }
                : (typeof raw.graduation === "string" ? { level: "Graduation", course: raw.graduation, start: "", end: "" } : null),

            (raw.hasPostGraduation && raw.postGraduation && typeof raw.postGraduation === "object")
                ? {
                    level: "Post Graduation",
                    course: raw.postGraduation.course || "",
                    start: [raw.postGraduation.startMonth, raw.postGraduation.startYear].filter(Boolean).join(" "),
                    end: [raw.postGraduation.endMonth, raw.postGraduation.endYear].filter(Boolean).join(" ")
                }
                : (typeof raw.postGraduation === "string" ? { level: "Post Graduation", course: raw.postGraduation, start: "", end: "" } : null),

            (raw.hasPhd && raw.phd && typeof raw.phd === "object")
                ? {
                    level: "PhD",
                    course: raw.phd.course || "",
                    start: [raw.phd.startMonth, raw.phd.startYear].filter(Boolean).join(" "),
                    end: [raw.phd.endMonth, raw.phd.endYear].filter(Boolean).join(" ")
                }
                : (typeof raw.phd === "string" ? { level: "PhD", course: raw.phd, start: "", end: "" } : null)
        ].filter(Boolean),

        experience: (raw.hasExperience && raw.experience && typeof raw.experience === "object")
            ? {
                company: raw.experience.company || "",
                location: raw.experience.location || "",
                role: raw.experience.role || "",
                salary: raw.experience.salary || "",
                ongoing: raw.experience.ongoing || false,
                start: [raw.experience.startMonth, raw.experience.startYear].filter(Boolean).join(" "),
                end: raw.experience.ongoing ? "Present" : [raw.experience.endMonth, raw.experience.endYear].filter(Boolean).join(" "),
                description: raw.experience.description || ""
            }
            : (typeof raw.experience === "string" ? raw.experience : (Array.isArray(raw.experience) ? raw.experience : null)),

        internship: (raw.hasInternship && raw.internship && typeof raw.internship === "object")
            ? {
                field: raw.internship.field || "",
                company: raw.internship.company || "",
                ongoing: raw.internship.ongoing || false,
                start: [raw.internship.startMonth, raw.internship.startYear].filter(Boolean).join(" "),
                end: raw.internship.ongoing ? "Present" : [raw.internship.endMonth, raw.internship.endYear].filter(Boolean).join(" ")
            }
            : (typeof raw.internship === "string" ? raw.internship : null),

        projects: raw.projects || "",
        achievements: raw.achievements || "",

        skills: raw.skills
            ? (typeof raw.skills === "string"
                ? raw.skills.split(",").map((s) => s.trim()).filter(Boolean)
                : (Array.isArray(raw.skills) ? raw.skills : []))
            : []
    };
};
