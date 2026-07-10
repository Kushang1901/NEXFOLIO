import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

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
