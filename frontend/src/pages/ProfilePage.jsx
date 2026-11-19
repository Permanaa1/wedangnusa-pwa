import { useEffect, useState } from "react";
import {
  Coffee,
  User,
  GraduationCap,
  Hash,
  Server,
  Smartphone,
  CheckCircle2,
  XCircle,
  Layers,
} from "lucide-react";
import { WedangApi } from "../services/api";

export default function ProfilePage() {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    WedangApi.getDrinks()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-24">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 px-5 pt-8 pb-7 text-center text-amber-50 shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 ring-1 ring-amber-400/40">
          <Coffee className="h-8 w-8 text-amber-300" />
        </div>
        <h1 className="mt-3 text-2xl font-bold">WedangNusa</h1>
        <p className="mt-1 text-xs text-amber-200/90">
          Panduan Minuman Rempah Tradisional & Bahan Herbal
        </p>
        <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-amber-100">
          Progressive Web App • v1.0.0
        </span>
      </header>

      <main className="space-y-4 px-5 pt-5">
        {/* Identitas Pengembang */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <h2 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
            Profil Pengembang
          </h2>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400">Nama Praktikan</p>
                <p className="text-sm font-bold text-stone-800">
                  Razzaq Permana
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400">NIM</p>
                <p className="font-mono text-sm font-semibold text-stone-800">
                  21120123120016
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400">Program Studi</p>
                <p className="text-sm font-semibold text-stone-800">
                  Teknik Komputer — Universitas Diponegoro
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tentang Aplikasi */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-amber-800" />
            <h2 className="text-sm font-bold text-stone-800">
              Tentang Aplikasi
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            WedangNusa adalah aplikasi Progressive Web App (PWA) yang dirancang
            untuk memenuhi Tugas Akhir Praktikum Pemrograman Perangkat Bergerak
            (PPB). Aplikasi ini mendokumentasikan kekayaan minuman rempah
            tradisional Indonesia lengkap dengan takaran racikan, cara
            penyeduhan, serta ensiklopedia bahan herbal penyusunnya.
          </p>
        </section>

        {/* Arsitektur & Status REST API */}
        <section className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-amber-800" />
              <h2 className="text-sm font-bold text-stone-800">
                Status Web Service
              </h2>
            </div>
            {apiOnline === true ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung
              </span>
            ) : apiOnline === false ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                <XCircle className="h-3.5 w-3.5" /> Offline
              </span>
            ) : (
              <span className="text-[11px] text-stone-400">Memeriksa...</span>
            )}
          </div>

          <div className="mt-3 space-y-2 text-xs text-stone-600">
            <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
              <span className="text-stone-400">Endpoint API</span>
              <span className="max-w-[190px] truncate font-mono font-medium text-stone-700">
                {WedangApi.baseUrl}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
              <span className="flex items-center gap-1 text-stone-400">
                <Layers className="h-3.5 w-3.5" /> Stack
              </span>
              <span className="font-medium text-stone-700">
                React + Vite PWA • Express • Supabase
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}