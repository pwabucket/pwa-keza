import { memo, useCallback } from "react";

import useSession from "../../hooks/useSession";
import { walletModules, walletModulesById } from "../../wallets/registry";
import { cn } from "../../lib/utils";

/** Value of the option for backups that match no module */
const UNKNOWN = "";

/** Shows the detected wallet type of a backup and lets the user change it */
export default memo(function ModulePicker() {
  const moduleId = useSession((state) => state.module?.id) ?? UNKNOWN;
  const setModule = useSession((state) => state.setModule);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setModule(walletModulesById.get(event.target.value) ?? null),
    [setModule],
  );

  return (
    <label className="flex flex-wrap items-center gap-2">
      <span className="font-bold shrink-0">Wallet type</span>
      <select
        value={moduleId}
        onChange={handleChange}
        className={cn(
          "grow min-w-0 bg-neutral-700 px-4 py-2 rounded-lg",
          "focus:outline-hidden focus:ring-3 focus:ring-yellow-300",
        )}
      >
        <option value={UNKNOWN}>Unknown</option>
        {walletModules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.title}
          </option>
        ))}
      </select>
    </label>
  );
});
