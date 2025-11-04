"use client"

import type React from "react"
import type { pageWithLayout } from "@/layoutTypes"
import { loginState, workspacestate } from "@/state"
import Workspace from "@/layouts/workspace"
import Sessions from "@/components/home/sessions"
import Docs from "@/components/home/docs"
import wall from "@/components/home/wall"
import StickyNoteAnnouncement from "@/components/sticky-note-announcement"
import Birthdays from "@/components/birthdays"
import NewToTeam from "@/components/newmembers"
import randomText from "@/utils/randomText"
import { useRecoilState } from "recoil"
import { useMemo, useEffect, useState } from "react"
import clsx from "clsx"

const Home: pageWithLayout = () => {
  const [login] = useRecoilState(loginState)
  const [workspace] = useRecoilState(workspacestate)
  const text = useMemo(() => randomText(login.displayname), [login.displayname])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (workspace && workspace.settings && Array.isArray(workspace.settings.widgets)) {
      setLoading(false)
    }
  }, [workspace])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-500">
        Loading your workspace...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-zinc-900 dark:text-white antialiased overflow-x-hidden selection:bg-blue-500/40">
      {/* Ambient glows */}
      <div className="absolute top-[-10rem] left-[-5rem] w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-8rem] right-[-6rem] w-[24rem] h-[24rem] bg-gradient-to-br from-pink-500/20 via-amber-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

      <main className="relative max-w-[90rem] mx-auto px-6 py-20 space-y-20 animate-fadeUp">
        {/* Hero */}
        <section className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-4">
            Your Glass Workspace
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
            A clean, immersive dashboard designed to keep your team in focus.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
              onClick={() => window.location.reload()}
            >
              Refresh Data
            </button>
            <button
              onClick={() => (window.location.href = `/workspace/${workspace.groupId}/settings`)}
              className="px-6 py-2.5 rounded-full bg-white/70 dark:bg-zinc-800/60 text-zinc-800 dark:text-white text-sm font-medium border border-white/20 hover:shadow-lg transition"
            >
              Configure
            </button>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-20">
          {/* Left Column */}
          <div className="lg:col-span-3 flex flex-col gap-10 translate-y-4">
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-200/60 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Sessions</h2>
              </div>
              <Sessions />
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-200/60 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Documents</h2>
              </div>
              <Docs />
            </div>
          </div>

          {/* Center Focus (Wall) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-10 -left-10 w-[15rem] h-[15rem] bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="glass rounded-[2rem] p-10 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-200/60 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M9 3v2m6-2v2M4 7h16v13H4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Wall</h2>
              </div>
              <wall />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 flex flex-col gap-10 -translate-y-4">
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-200/60 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  🎂
                </div>
                <h2 className="text-lg font-semibold">Birthdays</h2>
              </div>
              <Birthdays />
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-200/60 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  👋
                </div>
                <h2 className="text-lg font-semibold">New to the Team</h2>
              </div>
              <NewToTeam />
            </div>
          </div>
        </section>

        {/* Announcement */}
        <section className="glass rounded-[2rem] p-10 relative overflow-hidden mt-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/10 via-transparent to-transparent"></div>
          <div className="relative">
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300 flex justify-center items-center gap-2">
              <span className="text-2xl">📢</span> Announcement
            </h3>
            <StickyNoteAnnouncement />
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass {
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 0 0.5px rgba(255, 255, 255, 0.4);
          transition: all 0.4s ease;
        }
        .dark .glass {
          background: rgba(20, 20, 20, 0.5);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 0 0.5px rgba(255, 255, 255, 0.1);
        }
        .glass:hover {
          transform: translateY(-4px);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.12),
            inset 0 0 0.5px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

Home.layout = Workspace
export default Home