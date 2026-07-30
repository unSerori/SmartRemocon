import type { EnvLog } from "@/types/envLog";
import { type FC, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import useSWR from "swr";

type Props = {
	socket: Socket;
};

const Component: FC<Props> = ({ socket }) => {
	const { data, error, isLoading } = useSWR<EnvLog[]>("/env-logs?limit=28");
	const [latest, setLatest] = useState<EnvLog | null>(null);
	const [pastData, setPastData] = useState<EnvLog[]>([]);

	useEffect(() => {
		if (data && data.length > 0) {
			setLatest(data[0]);
			setPastData(data.slice(1));
		}
	}, [data]);

	useEffect(() => {
		socket.on("env_log_update", (newData: EnvLog) => {
			if (latest) {
				setPastData((prevPastData) => [latest, ...prevPastData]);
			}
			setLatest(newData);
		});

		return () => {
			socket.off("env_log_update");
		};
	}, [socket, latest]);

	// useEffect(() => {
	// 	socket.emit("message", {name: "NestJS"}, (response: unknown) => {
	// 		console.log("[try] message ack", response);
	// 	});
	// }, [socket])

	const formatTimestamp = (timestamp: string | Date) => {
		const date =
			typeof timestamp === "string" ? new Date(timestamp) : timestamp;

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};

	if (error) return <div className="text-red-500">Failed to load</div>;
	if (isLoading || !latest)
		return <div className="text-blue-500">Loading...</div>;

	return (
		<div className="bg-gradient-to-br from-[#F9FAFB] to-[#EEF1F5] text-gray-800 font-sans min-h-screen p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="col-span-12 bg-gradient-to-r from-blue-400 to-blue-800 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
					<h1 className="text-2xl font-bold mb-2">最新のデータ</h1>
					<div className="text-4xl font-semibold">
						{latest.temperatureSht}°C
					</div>
					<p className="text-lg">
						湿度: {latest.humidity}% ・ 気圧: {latest.pressure} Pa
					</p>
					<p className="text-sm text-gray-200 mt-2">
						更新: {formatTimestamp(latest.createdAt)}
					</p>
				</div>

				{/* 過去のデータ */}
				<div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
					{pastData.map((item) => (
						<div
							key={item.id}
							className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-400"
						>
							<p className="text-lg font-semibold text-gray-700">
								{item.temperatureSht}°C
							</p>
							<p className="text-sm text-gray-600">湿度: {item.humidity}%</p>
							<p className="text-sm text-gray-600">気圧: {item.pressure} Pa</p>
							<p className="text-xs text-gray-400 mt-2">
								<strong>受信時刻:</strong> {formatTimestamp(item.createdAt)}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Component;
