import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAY3MrKCl39WxCTAoK5bxNS_nlM4CVjNvw",
    authDomain: typeof window !== "undefined" && window.location.hostname !== "localhost" ? window.location.hostname : "resumecraft-e16fe.firebaseapp.com",
    projectId: "resumecraft-e16fe",
    storageBucket: "resumecraft-e16fe.firebasestorage.app",
    messagingSenderId: "432729463832",
    appId: "1:432729463832:web:c9ca90009cb8d5291c776d",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
