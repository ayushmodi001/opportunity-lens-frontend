"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Label, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock data - replace with real data from your backend
const mockQuizzes = [
  { id: 1, topic: "Mathematics", score: 8, totalQuestions: 10, date: "2024-01-20" },
  { id: 2, topic: "Physics", score: 7, totalQuestions: 10, date: "2024-01-21" },
  { id: 3, topic: "Chemistry", score: 9, totalQuestions: 10, date: "2024-01-22" },
  { id: 4, topic: "Biology", score: 6, totalQuestions: 10, date: "2024-01-23" },
  { id: 5, topic: "Mathematics", score: 9, totalQuestions: 10, date: "2024-01-24" },
]

const COLORS = [
  '#D1345B',  // Primary color from your theme
  '#34D1BF',  // Secondary teal color from your theme
  '#7C3AED',  // Vibrant purple
  '#F59E0B',  // Warm amber
  '#10B981',  // Fresh green
]

// Calculate total scores per topic for the chart
const getTopicScores = (quizzes) => {
  const topicScores = {}
  const topicTotal = {}

  quizzes.forEach((quiz) => {
    if (!topicScores[quiz.topic]) {
      topicScores[quiz.topic] = 0
      topicTotal[quiz.topic] = 0
    }
    topicScores[quiz.topic] += quiz.score
    topicTotal[quiz.topic] += quiz.totalQuestions
  })

  return Object.keys(topicScores).map((topic, index) => ({
    topic,
    score: topicScores[topic],
    total: topicTotal[topic],
    percentage: Math.round((topicScores[topic] / topicTotal[topic]) * 100),
    fill: COLORS[index % COLORS.length]
  }))
}

const CustomTooltip = ({ children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1">
          {children.props.tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function QuizStats() {
  const chartData = getTopicScores(mockQuizzes)
  const totalQuizzes = mockQuizzes.length

  const CustomLabel = ({ viewBox, value }) => {
    const { cx, cy } = viewBox;
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
      >
        <tspan x={cx} y={cy - 10} className="text-xl font-bold">
          {totalQuizzes}
        </tspan>
        <tspan x={cx} y={cy + 10} className="text-sm">
          Total Quizzes
        </tspan>
      </text>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Quizzes List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
          <CardDescription>Your latest assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-2 border rounded hover:bg-accent"
              >
                <div>
                  <div className="font-medium">{quiz.topic}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(quiz.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-lg font-bold">
                  {quiz.score}/{quiz.totalQuestions}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Score distribution across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="score"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <CustomTooltip key={`tooltip-${index}`}>
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill} 
                          stroke={entry.fill}
                          tooltipContent={
                            <>
                              <div className="font-medium">{entry.topic}</div>
                              <div className="text-sm text-muted-foreground">
                                Score: {entry.score}/{entry.total}
                              </div>
                              <div className="text-sm font-medium text-primary">
                                {entry.percentage}% Success Rate
                              </div>
                            </>
                          }
                        />
                      </CustomTooltip>
                    ))}
                    <Label content={<CustomLabel />} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {chartData.map((entry, index) => (
                <div key={entry.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span>{entry.topic}</span>
                  </div>
                  <span className="font-medium">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Detailed performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="topic" 
                    tick={{ fill: 'var(--foreground)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--foreground)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <Bar
                    dataKey="percentage"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <CustomTooltip key={`tooltip-${index}`}>
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill}
                          tooltipContent={
                            <>
                              <div className="font-medium">{entry.topic}</div>
                              <div className="text-sm text-muted-foreground">
                                Average Score: {entry.percentage}%
                              </div>
                            </>
                          }
                        />
                      </CustomTooltip>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
