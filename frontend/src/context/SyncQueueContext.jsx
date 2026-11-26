import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WedangApi } from "../services/api";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const QUEUE_STORAGE_KEY = "wedangnusa_pending_drinks_v1";
const MAX_AUTO_RETRIES = 5;

const SyncQueueContext = createContext(null);

function loadQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      status: item.status === "syncing" ? "pending" : item.status || "pending",
      retryCount: Number(item.retryCount) || 0,
      nextRetryAt: Number(item.nextRetryAt) || 0,
      errorMessage: item.errorMessage || "",
    }));
  } catch {
    return [];
  }
}

function getBackoffMs(retryCount) {
  const delays = [5000, 15000, 30000, 60000];
  return delays[Math.min(retryCount, delays.length - 1)];
}

export function SyncQueueProvider({ children }) {
  const isOnline = useOnlineStatus();
  const [queue, setQueue] = useState(loadQueue);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncInfo, setLastSyncInfo] = useState(null);

  const queueRef = useRef(queue);
  queueRef.current = queue;
  const syncingRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch {
      // Abaikan jika penyimpanan browser penuh
    }
  }, [queue]);

  const syncPendingDrinks = useCallback(async ({ force = false } = {}) => {
    if (syncingRef.current) return;
    if (!force && !navigator.onLine) return;

    const now = Date.now();
    const candidates = queueRef.current.filter((item) => {
      if (item.status === "pending") return true;
      if (item.status === "failed") {
        if (!force && item.retryCount >= MAX_AUTO_RETRIES) return false;
        return force || now >= (item.nextRetryAt || 0);
      }
      return false;
    });

    if (candidates.length === 0) return;

    syncingRef.current = true;
    setIsSyncing(true);

    const syncedIds = new Set();
    const updates = new Map();

    for (const item of candidates) {
      try {
        await WedangApi.createDrink(item.payload);
        syncedIds.add(item.localId);
      } catch (err) {
        const nextRetryCount = (item.retryCount || 0) + 1;
        const isOfflineErr = !navigator.onLine || Boolean(err?.isOffline);
        updates.set(item.localId, {
          status: isOfflineErr ? "pending" : "failed",
          retryCount: nextRetryCount,
          nextRetryAt: Date.now() + getBackoffMs(nextRetryCount),
          lastAttempt: new Date().toISOString(),
          errorMessage:
            err?.message || "Gagal mengirim data ke server.",
        });
      }
    }

    if (syncedIds.size > 0 || updates.size > 0) {
      setQueue((prev) =>
        prev
          .filter((item) => !syncedIds.has(item.localId))
          .map((item) =>
            updates.has(item.localId)
              ? { ...item, ...updates.get(item.localId) }
              : item
          )
      );
    }

    if (syncedIds.size > 0) {
      setLastSyncInfo({
        count: syncedIds.size,
        at: new Date().toISOString(),
      });
    }

    syncingRef.current = false;
    setIsSyncing(false);
  }, []);

  // Auto-sync saat kembali online, saat tab kembali aktif, atau jeda berkala ringan
  useEffect(() => {
    if (!isOnline) return;

    syncPendingDrinks();

    const handleVisibilityOrFocus = () => {
      if (
        document.visibilityState === "visible" &&
        navigator.onLine
      ) {
        syncPendingDrinks();
      }
    };

    const interval = setInterval(() => {
      if (navigator.onLine && !syncingRef.current) {
        syncPendingDrinks();
      }
    }, 10000);

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [isOnline, syncPendingDrinks]);

  const submitDrinkProposal = async (payload) => {
    const newEntry = {
      localId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      payload,
      status: "pending",
      retryCount: 0,
      nextRetryAt: 0,
      createdAt: new Date().toISOString(),
      lastAttempt: null,
      errorMessage: "",
    };

    if (!navigator.onLine) {
      setQueue((prev) => [newEntry, ...prev]);
      return {
        queued: true,
        status: "pending",
        message:
          "Anda sedang offline. Usulan minuman disimpan dengan status Pending dan akan otomatis diunggah saat koneksi internet kembali aktif.",
      };
    }

    try {
      const created = await WedangApi.createDrink(payload);
      setLastSyncInfo({
        count: 1,
        at: new Date().toISOString(),
      });
      return {
        queued: false,
        status: "synced",
        data: created,
        message: "Minuman tradisional berhasil diunggah langsung ke database.",
      };
    } catch (err) {
      const failedEntry = {
        ...newEntry,
        status: navigator.onLine ? "failed" : "pending",
        retryCount: 1,
        nextRetryAt: Date.now() + getBackoffMs(1),
        lastAttempt: new Date().toISOString(),
        errorMessage:
          err?.message || "Gagal terhubung ke server saat mengirim data.",
      };
      setQueue((prev) => [failedEntry, ...prev]);
      return {
        queued: true,
        status: failedEntry.status,
        message: `${failedEntry.errorMessage} Data disimpan ke antrean dan akan dicoba sinkronisasi otomatis.`,
      };
    }
  };

  const retryNow = () => syncPendingDrinks({ force: true });

  const removeQueuedItem = (localId) => {
    setQueue((prev) => prev.filter((item) => item.localId !== localId));
  };

  const pendingCount = queue.length;

  return (
    <SyncQueueContext.Provider
      value={{
        queue,
        pendingCount,
        isSyncing,
        lastSyncInfo,
        submitDrinkProposal,
        syncPendingDrinks,
        retryNow,
        removeQueuedItem,
      }}
    >
      {children}
    </SyncQueueContext.Provider>
  );
}

export function useSyncQueue() {
  const ctx = useContext(SyncQueueContext);
  if (!ctx) {
    throw new Error("useSyncQueue harus dipakai di dalam SyncQueueProvider");
  }
  return ctx;
}