import React, { ReactNode } from "react";
import { useAuth } from "@/api/useAuth";

interface AuthorizedProps {
  roles: string[];
  children: ReactNode;
}
const AuthorizedComponent: React.FC<AuthorizedProps> = ({
  roles,
  children,
}) => {
  const { currentUser, currentRole } = useAuth();
  if (!currentUser || !currentRole || !roles.includes(currentRole)) {
    return <></>;
  }
  return <>{children}</>;
};

export default AuthorizedComponent;
