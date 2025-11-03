import axios from "axios";
import React, { useState } from "react";
import type toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { workspacestate } from "@/state";
import Button from "@/components/button";
import type { Session, user } from "@/utils/database";
import { useRouter } from "next/router";
import { IconChevronRight, IconSpeakerphone } from '@tabler/icons-react'
import { getThumbnail } from "@/utils/userinfoEngine";

const Sessions: React.FC = () => {
	const [activeSessions, setActiveSessions] = useState<(Session & { owner: user })[]>([]);
	const router = useRouter();

	React.useEffect(() => {
		axios.get(`/api/workspace/${router.query.id}/home/activeSessions`).then(res => {
			if (res.status === 200) {
				setActiveSessions(res.data.sessions);
				console.log(res.data.sessions);
			}
		});
	}, []);

	const goToSessions = () => {
		router.push(`/workspace/${router.query.id}/sessions`);
	};

	return (
		<div className="flex flex-col gap-5">
			{activeSessions.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
					<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 backdrop-blur-md">
						<IconSpeakerphone className="w-8 h-8 text-primary" />
					</div>
					<p className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">No active sessions</p>
					<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">There are no ongoing sessions right now</p>
					<button
						onClick={goToSessions}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
					>
						View Sessions
						<IconChevronRight className="w-4 h-4" />
					</button>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{activeSessions.map(session => (
						console.log(session),
						<div
							key={session.id}
							className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 shadow-md hover:shadow-lg transition-all duration-300"
						>
							<div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />
							<div className="p-4 flex items-start gap-3 relative z-10">
								<img
									src={session.owner.picture ?? ''}
									alt={`${session.owner.username}'s avatar`}
									className="rounded-xl h-11 w-11 bg-white/20 ring-1 ring-white/20 object-cover"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-base font-semibold text-white tracking-tight">
										Session
									</p>
									<p className="text-sm text-white/80 mt-0.5">
										Hosted by {session.owner.username}
									</p>
								</div>
							</div>
						</div>
					))}
					<button
						onClick={goToSessions}
						className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all"
					>
						View all sessions
						<IconChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
};

export default Sessions;