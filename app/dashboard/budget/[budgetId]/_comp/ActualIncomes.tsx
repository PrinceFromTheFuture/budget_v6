"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Budget, Category, Transaction } from "@/db/schema";
import formatCurrency from "@/lib/formatCurrency";
import dayjs, { Dayjs } from "dayjs";

interface ChartConfigItem {
  [key: string]: { label: string; color: string };
}
const colors = ["#cc7a7a", "#ccab7a", "#bccc7a", "#8bcc7a", "#7acc9b", "#7acccc", "#7a9bcc", "#8b7acc", "#bc7acc", "#cc7aab"];

export function ActualIncomes({ categories, budget, transactions }: { categories: Category[]; budget: Budget; transactions: Transaction[] }) {
  const chartConfig: ChartConfigItem = {} satisfies ChartConfig;
  const budgetCategoriesLength = budget.budgetCategories.length;

  for (let i = 0; i < budgetCategoriesLength; i++) {
    const category = budget.budgetCategories[i];
    const cat = categories.find((cat) => cat.id === category.budgetCategoryId)!;
    chartConfig[cat.name] = { label: cat.name, color: "hsl(var(--chart-5))" };
  }

  const chartData = transactions
    .filter((transaction) => transaction.type === "income")
    .map((transaction, i) => {
      const cat = categories.find((cat) => cat.id === transaction.categoryId)!;
      return { browser: cat.name, visitors: Number(transaction.amount), fill: colors[i] };
    });
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex  m-0 w-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Actual Incomes</CardTitle>
        <CardDescription>
          {dayjs(budget.startDate).format("DD/MM/YYYY")} - {dayjs(budget.endDate).format("DD/MM/YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent mode={"money"} hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={1}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {formatCurrency(totalVisitors).toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Incomes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2  leading-none text-lg font-semibold">
          {formatCurrency(totalVisitors / dayjs(budget.endDate).diff(dayjs(budget.startDate), "days"))} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">How much you can spend a day</div>
      </CardFooter>
    </Card>
  );
}
