import { Navigate, Outlet, useLocation } from "react-router";
import usePermissions from "../../hooks/usePermissions";
import { permissionForPath } from "../../config/routePermissions";

type RequirePermissionProps = {
  perm?: string | string[];
  children?: React.ReactNode;
};

export default function RequirePermission({ perm, children }: RequirePermissionProps) {
  const { can, isAuditMode } = usePermissions();
  const location = useLocation();

  const required = perm ?? permissionForPath(location.pathname);

  if (!can(required)) {
    if (!isAuditMode) {
      return <Navigate to="/403" replace state={{ from: location.pathname, required }} />;
    }
    console.warn(
      `[rbac] audit mode: allowing ${location.pathname} despite missing permission`,
      required
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
