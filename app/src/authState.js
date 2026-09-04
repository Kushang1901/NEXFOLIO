import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Global client-side Fetch interceptor to automatically inject Authorization token
if (typeof window !== "undefined" && !window.__fetchInterceptorAttached) {
    window.__fetchInterceptorAttached = true;
    const originalFetch = window.fetch;
    window.fetch = async function (url, options = {}) {
        const urlStr = url.toString();
        const isTargetApi = urlStr.includes("/api/resumes") || urlStr.includes("/api/user") || urlStr.includes("/api/payments") || urlStr.includes("/api/cover-letters") || urlStr.includes("/api/ai/") || urlStr.includes("/api/resume-sharing");
        
        if (isTargetApi) {
            let tokenToInject = null;
            try {
                // 1. Check if mock user is logged in
                const mockUserStr = localStorage.getItem("mock_user");
                if (mockUserStr) {
                    const mockUser = JSON.parse(mockUserStr);
                    if (mockUser.token) {
                        tokenToInject = mockUser.token;
                    }
                }
                
                // 2. If no mock token, check if Firebase user is logged in
                if (!tokenToInject && auth?.currentUser) {
                    tokenToInject = await auth.currentUser.getIdToken();
                }
            } catch (err) {
                console.warn("Fetch auth interceptor error:", err);
            }

            if (tokenToInject) {
                if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                    options.headers.set("Authorization", `Bearer ${tokenToInject}`);
                } else {
                    options.headers = options.headers || {};
                    options.headers["Authorization"] = `Bearer ${tokenToInject}`;
                }
            }
        }
        return originalFetch(url, options);
    };
}

export function subscribeToAuthChanges(callback) {
    const checkMockUser = () => {
        if (typeof window !== "undefined") {
            try {
                const params = new URLSearchParams(window.location.search);
                const autoEmail = params.get("autologin_email");
                const autoName = params.get("autologin_name") || "App User";
                
                if (autoEmail) {
                    const mockUser = {
                        uid: "mock_user_12345",
                        email: autoEmail,
                        displayName: autoName,
                        photoURL: null,
                        emailVerified: true
                    };
                    localStorage.setItem("mock_user", JSON.stringify(mockUser));
                    
                    // Remove autologin params from the URL cleanly
                    const url = new URL(window.location.href);
                    url.searchParams.delete("autologin_email");
                    url.searchParams.delete("autologin_name");
                    window.history.replaceState({}, document.title, url.pathname + url.search);
                }
            } catch (e) {
                console.error("Autologin check failed:", e);
            }

            const localUserJson = localStorage.getItem("mock_user");
            if (localUserJson) {
                try {
                    const localUser = JSON.parse(localUserJson);
                    callback(localUser);
                    return true;
                } catch (e) {
                    console.error("Failed to parse mock_user:", e);
                }
            }
        }
        return false;
    };

    // 1. Initial check
    checkMockUser();

    // 2. Listen to custom auth changes (for reactive mock updates)
    let handleCustomAuthChange;
    if (typeof window !== "undefined") {
        handleCustomAuthChange = () => {
            const currentMock = checkMockUser();
            if (!currentMock) {
                // If mock user was removed, and there is no Firebase user, callback null
                if (!auth.currentUser) {
                    callback(null);
                }
            }
        };
        window.addEventListener("auth-state-change", handleCustomAuthChange);
    }

    // 3. Listen to standard Firebase Auth changes
    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
        if (user) {
            // A real Firebase user is authenticated. Clear any stale mock session.
            if (typeof window !== "undefined") {
                localStorage.removeItem("mock_user");
            }
            callback(user);
        } else {
            // Only emit null if there's no mock user active
            if (typeof window !== "undefined" && !localStorage.getItem("mock_user")) {
                callback(null);
            }
        }
    });

    // Return a unified unsubscribe function
    return () => {
        unsubscribeFirebase();
        if (typeof window !== "undefined" && handleCustomAuthChange) {
            window.removeEventListener("auth-state-change", handleCustomAuthChange);
        }
    };
}
