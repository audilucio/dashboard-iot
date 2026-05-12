"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface WeightData {
  id: number;
  weight: number;
  createdAt: string;
  time?: string;
}

export default function Home() {
  const [weights, setWeights] = useState<WeightData[]>([]);

  async function loadWeights() {
    try {
      const response = await axios.get(
        "http://localhost:3001/weight"
      );

      const formatted = response.data
        .reverse()
        .map((item: WeightData) => ({
          ...item,
          time: new Date(
            item.createdAt
          ).toLocaleTimeString(),
        }));

      setWeights(formatted);
    } catch (error) {
      console.error(error);
    }
  }

  async function clearHistory() {
    try {
      await axios.delete(
        "http://localhost:3001/weight"
      );

      setWeights([]);
    } catch (error) {
      console.error(error);
    }
  }

  function exportCSV() {
    const rows = [
      ["Peso", "Litros", "Data"],
      ...weights.map((item) => [
        item.weight,
        (item.weight / 1.03).toFixed(2),
        new Date(item.createdAt).toLocaleString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri =
      encodeURI(csvContent);

    const link =
      document.createElement("a");

    link.setAttribute(
      "href",
      encodedUri
    );

    link.setAttribute(
      "download",
      "historico.csv"
    );

    document.body.appendChild(link);

    link.click();
  }

  useEffect(() => {
    loadWeights();

    const interval = setInterval(() => {
      loadWeights();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const latest =
    weights.length > 0
      ? weights[weights.length - 1]
      : null;

  const litros = latest
    ? (latest.weight / 1.03).toFixed(2)
    : "--";

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Monitoramento Remoto
            </h1>

            <p className="text-gray-500 mt-1">
              Sistema Inteligente de Pesagem
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
            >
              Exportar Histórico
            </button>

            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
            >
              Limpar Histórico
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow p-6">
            <p className="text-gray-500">
              Peso Atual
            </p>

            <h2 className="text-5xl font-bold text-blue-600 mt-3">
              {latest?.weight ?? "--"} kg
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <p className="text-gray-500">
              Litros Estimados
            </p>

            <h2 className="text-5xl font-bold text-green-600 mt-3">
              {litros} L
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <p className="text-gray-500">
              Leituras
            </p>

            <h2 className="text-5xl font-bold text-gray-800 mt-3">
              {weights.length}
            </h2>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Histórico em Tempo Real
          </h2>

          <div className="w-full h-[450px]">
            <ResponsiveContainer>
              <LineChart data={weights}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="time" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2563eb"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
