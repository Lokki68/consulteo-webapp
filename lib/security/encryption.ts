import CryptoJS from "crypto-js";

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

export const encryptData = (data: any): string => {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
};

export const decryptData = <T>(encryptedData: string): T | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString) as T;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

// Stockage sécurisé dans localStorage
export const secureStorage = {
    setItem: (key: string, value: any) => {
        const encrypted = encryptData(value);
        localStorage.setItem(key, encrypted);
    },

    getItem: <T>(key: string): T | null => {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return decryptData<T>(encrypted);
    },

    removeItem: (key: string) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};