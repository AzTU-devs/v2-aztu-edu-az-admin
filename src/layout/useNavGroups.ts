import { useMemo } from "react";
import usePermissions from "../hooks/usePermissions";
import { NavGroup, filterNavByPermission, navGroups } from "./navConfig";

export const useNavGroups = (): NavGroup[] => {
  const { can, permissions, isSuperAdmin } = usePermissions();

  return useMemo(
    () => filterNavByPermission(navGroups, can),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, isSuperAdmin]
  );
};

export default useNavGroups;
