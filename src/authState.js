import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export function subscribeToAuthChanges(callback) {
    const checkMockUser = () => {
        if (typeof window !== "undefined") {
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
