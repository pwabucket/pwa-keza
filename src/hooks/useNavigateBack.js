import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useNavigateBack() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = useCallback(
    /**
     *
     * @param {import("react-router").NavigateOptions} options
     * @returns
     */
    (options) => {
      return location.key !== "default" ? navigate(-1) : navigate("/", options);
    },
    [location, navigate]
  );

  return navigateBack;
}
