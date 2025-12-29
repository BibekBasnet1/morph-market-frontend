const useCookieStorage = () => {
    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
    };

    const setCookie = (name: string, value: string, seconds?: number) => {
        let expires = "";
        if (seconds) {
            const date = new Date();
            date.setTime(date.getTime() + seconds * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }

        const isHttps = window.location.protocol === "https:";

        document.cookie = `${name}=${value}${expires}; path=/; SameSite=Strict${isHttps ? "; Secure" : ""}`;
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
    };

    return { getCookie, setCookie, deleteCookie };
};

export default useCookieStorage;
