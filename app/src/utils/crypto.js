import crypto from "crypto";

export function hashPassword(password) {
    if (!password) return null;
    return crypto.createHash("sha256").update(password).digest("hex");
}
