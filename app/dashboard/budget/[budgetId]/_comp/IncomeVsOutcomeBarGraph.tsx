"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Budget, Transaction } from "@/db/schema";
import dayjs from "dayjs";

export function IncomeVsOutcomeBarGraph({ transactions, budget }: { transactions: Transaction[]; budget: Budget }) {
  const daysInBudget = Math.abs(dayjs(budget.endDate).diff(dayjs(budget.startDate), "days"));

  const firstBudgetDay = dayjs(budget.startDate);
  const chartData = Array.from({ length: daysInBudget }).map((_, i) => {
    const day = firstBudgetDay.add(i, "days");
    const transactionsMadeInThisDay = transactions.filter((transaction) => dayjs(transaction.date).isSame(day, "day"));
    const getTotalAmountInDay = (type: "expens" | "income", transactions: Transaction[]) =>
      transactions.filter((tra) => tra.type === type).reduce((a, b) => a + b.amount, 0);
    return {
      date: day.format("YYYY/MM/DD"),
      expense: getTotalAmountInDay('expens',transactions),
      income: getTotalAmountInDay('income',transactions),
    };
  });

  const chartConfig = {
    views: {
      label: "Page Views",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-1))",
    },
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("expense");

  const total = React.useMemo(
    () => ({
      expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
      income: chartData.reduce((acc, curr) => acc + curr.income, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {["expense", "income"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">{total[key as keyof typeof total].toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  mode="money"
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
