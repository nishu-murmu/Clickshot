import { invoke } from "@tauri-apps/api/core";
import { useAtomValue } from "jotai";
import atoms from "../atoms";

const useShortcuts = () => {

  const isRegionActive = useAtomValue(atoms.isRegionActiveAtom);
  const bgImage = useAtomValue(atoms.bgImageAtom);

  const escapeShortcut = (e: KeyboardEvent, window?: string) => {
    if (e.key === "Escape") {
      if (window == "edit") {
        invoke("close_edit_window_command");
      }
      invoke("close_overlay_window_command");
    }
  }

  const enterShortcut = () => {
    if (!isRegionActive) {
      invoke("save_full_screenshot_command", { base_64_str: bgImage })
    }
  }

  return {
    escapeShortcut,
    enterShortcut
  }
}

export default useShortcuts;
