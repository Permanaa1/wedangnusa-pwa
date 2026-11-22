import { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function PwaStatusBar() {
  const isOnline = useOnlineStatus();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-stone-900 px-4 py-2 text-center text-xs font-medium text-amber-200 shadow-sm">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>
            Mode Offline — Tampilan tetap aktif. Data terbaru akan dimuat saat
            kembali online.
          </span>
        </div>
      )}

      {installPrompt && !dismissed && (
        <div className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-full bg-amber-900 py-2 pr-2.5 pl-4 text-xs font-semibold text-amber-50 shadow-lg ring-1 ring-amber-400/30 md:right-6 md:bottom-6">
          <button
            type="button"
            onClick={triggerInstall}
            className="flex cursor-pointer items-center gap-2"
          >
            <Download className="h-4 w-4 text-amber-300" />
            <span>Install WedangNusa</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Tutup banner install"
            className="cursor-pointer rounded-full p-1 text-amber-200 hover:bg-amber-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}