import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IChart {
	data: { name: string; Temperature: number; }[],
	children: React.ReactNode
}

export const Chart = ({data, children}: IChart) => {
	return (
		<ResponsiveContainer height={300}>
			<LineChart
				data={data}
			>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
				{children}
			</LineChart>
		</ResponsiveContainer>
	)
}

Chart.line = Line