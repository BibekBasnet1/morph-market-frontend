type User = {
    id: string;
    email: string;
    name: string;
    permissions: Permissions[],
    roles : Role[]
};

type Role = Array<string> | string ;
type Permissions = Array<string> | [];

type AuthToken = {
    accessToken: string;
};

type UserContextType = {
    user: User | null;
    token: AuthToken | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (userData: User, tokenData: AuthToken, rememberMe?: boolean) => void;
    logout: () => void;
    refreshToken: () => Promise<void>;
    isUserAuthenticated: () => boolean;
};

export type { User, AuthToken, UserContextType };
