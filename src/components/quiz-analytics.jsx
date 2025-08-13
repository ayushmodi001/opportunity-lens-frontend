"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function QuizAnalytics({ score, correctCount, totalQuestions, timeUsed, violations }) {
    const wrongCount = totalQuestions - correctCount;
    const timeUsedMinutes = Math.floor(timeUsed / 60);
    const timeUsedSeconds = timeUsed % 60;

    const answerData = [
        { name: 'Correct', value: correctCount },
        { name: 'Wrong', value: wrongCount },
    ];

    const scoreData = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const COLORS = ['#4CAF50', '#F44336'];
    const SCORE_COLORS = ['#2196F3', '#E0E0E0'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Final Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <p className="text-6xl font-bold text-primary">{score.toFixed(2)}%</p>
                    {violations > 0 && (
                        <p className="text-destructive mt-2 text-sm">
                            ({violations} violation{violations > 1 ? 's' : ''} resulted in a penalty)
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Time Used Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Time Used</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <p className="text-5xl font-semibold">
                        {timeUsedMinutes}:{timeUsedSeconds < 10 ? `0${timeUsedSeconds}` : timeUsedSeconds}
                    </p>
                </CardContent>
            </Card>

            {/* Correct vs Wrong Answers */}
            <Card>
                <CardHeader>
                    <CardTitle>Answer Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={answerData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {answerData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
