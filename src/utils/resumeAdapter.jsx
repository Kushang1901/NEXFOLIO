export const normalizeResumeData = (raw) => {
    return {
        basics: {
            name: raw.fullName || "",
            role: raw.role || "",
            email: raw.email || "",
            phone: raw.phone || "",
            photo: raw.profilePhoto
                ? (raw.profilePhoto.startsWith("http")
                    ? `/api/image-proxy?url=${encodeURIComponent(raw.profilePhoto)}`
                    : raw.profilePhoto)
                : "",
            links: {
                portfolio: raw.portfolio || "",
                linkedin: raw.linkedin || "",
                github: raw.github || ""
            }
        },

        summary: raw.professionalSummary || "",

        education: [
            raw.graduation
                ? {
                    level: "Graduation",
                    course: raw.graduation.course,
                    start: [raw.graduation.startMonth, raw.graduation.startYear].filter(Boolean).join(" "),
                    end: [raw.graduation.endMonth, raw.graduation.endYear].filter(Boolean).join(" ")
                }
                : null,

            raw.hasPostGraduation
                ? {
                    level: "Post Graduation",
                    course: raw.postGraduation.course,
                    start: [raw.postGraduation.startMonth, raw.postGraduation.startYear].filter(Boolean).join(" "),
                    end: [raw.postGraduation.endMonth, raw.postGraduation.endYear].filter(Boolean).join(" ")
                }
                : null,

            raw.hasPhd
                ? {
                    level: "PhD",
                    course: raw.phd.course,
                    start: [raw.phd.startMonth, raw.phd.startYear].filter(Boolean).join(" "),
                    end: [raw.phd.endMonth, raw.phd.endYear].filter(Boolean).join(" ")
                }
                : null
        ].filter(Boolean),

        experience: raw.hasExperience && raw.experience
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
            : (typeof raw.experience === "string" ? raw.experience : null),

        internship: raw.hasInternship && raw.internship
            ? {
                field: raw.internship.field || "",
                company: raw.internship.company || "",
                ongoing: raw.internship.ongoing || false,
                start: [raw.internship.startMonth, raw.internship.startYear].filter(Boolean).join(" "),
                end: raw.internship.ongoing ? "Present" : [raw.internship.endMonth, raw.internship.endYear].filter(Boolean).join(" ")
            }
            : null,

        projects: raw.projects || "",
        achievements: raw.achievements || "",

        skills: raw.skills
            ? raw.skills.split(",").map((s) => s.trim())
            : []
    };
};
