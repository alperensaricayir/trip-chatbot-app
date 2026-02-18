"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const storedKey = localStorage.getItem("hf_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setStatusMsg("API Anahtarı boş olamaz.");
      return;
    }
    localStorage.setItem("hf_api_key", apiKey.trim());
    setIsSaved(true);
    setStatusMsg("API Anahtarı başarıyla kaydedildi.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleRemove = () => {
    localStorage.removeItem("hf_api_key");
    setApiKey("");
    setIsSaved(false);
    setStatusMsg("API Anahtarı silindi.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900/50 p-8 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Paneli</h1>
          <p className="mt-2 text-sm text-zinc-400">Hugging Face API Entegrasyonu</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-300">
              Hugging Face API Key
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="block w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="hf_..."
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Bu anahtar tarayıcınızda (localStorage) saklanır ve sunucuya sadece istekler sırasında gönderilir.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Kaydet
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 rounded-lg bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Sil
            </button>
          </div>

          {statusMsg && (
            <div className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium ${isSaved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {statusMsg}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-6">
          <Link
            href="/"
            className="block w-full rounded-lg bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/10"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
