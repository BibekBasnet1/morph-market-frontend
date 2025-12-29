
const useLocalStorage = () => {
    const setItem = <T>(key: string, value: T): void => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            // console.error('Error saving to localStorage:', error);
        }
    };

    const getItem = <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (error) {
            // console.error('Error reading from localStorage:', error);
            return null;
        }
    };

    const removeItem = (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            // console.error('Error removing from localStorage:', error);
        }
    };

    const clear = (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            // console.error('Error clearing localStorage:', error);
        }
    };

    return {
        setItem,
        getItem,
        removeItem,
        clear
    };
};

export default useLocalStorage;
