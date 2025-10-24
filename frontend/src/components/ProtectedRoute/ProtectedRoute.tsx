import type React from "react";
import { Navigate } from "react-router-dom";

interface Props {
    isAllowed: boolean | null;
    children: React.ReactNode;
}

const ProtectedRoute = ({ isAllowed, children }: Props) => {
    if (!isAllowed) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
