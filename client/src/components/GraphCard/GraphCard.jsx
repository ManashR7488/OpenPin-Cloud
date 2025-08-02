import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraphCard({ feature, data }) {
  const [chartType, setChartType] = useState("line");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  // ✅ useEffect now only runs when `data` changes
  useEffect(() => {
    if (typeof data === "number") {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        value: data,
      };

      // Avoid direct mutation and use a function form of setState
      setHistory((prev) => {
        const updated = [...prev, newPoint].slice(-50);
        historyRef.current = updated;
        return updated;
      });
    }
  }, [data]);

  const renderChart = () => {
    const chartData = history;

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[min || "auto", max || "auto"]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
      default:
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[min || "auto", max || "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-md">
      <div className="flex justify-between mb-2">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="border p-1 w-16 rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="border p-1 w-16 rounded"
          />
        </div>
      </div>
      {renderChart()}
    </div>
  );
}
