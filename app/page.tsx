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

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
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

          <div className="flex items-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition">
              Histórico
            </button>

            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl font-medium transition">
              Gráfico
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto p-6">

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

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
              Status
            </p>

            <div className="flex items-center gap-2 mt-5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>

              <span className="text-green-600 font-semibold">
                Online
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <p className="text-gray-500">
              Leituras
            </p>

            <h2 className="text-5xl font-bold text-gray-800 mt-3">
              {weights.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <p className="text-gray-500">
              Última Atualização
            </p>

            <p className="text-lg font-medium text-gray-700 mt-4">
              {latest
                ? new Date(
                    latest.createdAt
                  ).toLocaleTimeString()
                : "--"}
            </p>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="bg-white rounded-3xl shadow p-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Histórico de Pesagem
            </h2>

            <button
              onClick={loadWeights}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            >
              Atualizar
            </button>
          </div>

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

        {/* HISTÓRICO */}
        <div className="bg-white rounded-3xl shadow p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Histórico Recente
          </h2>

          <div className="space-y-4">
            {weights
              .slice(-10)
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.weight} kg
                    </p>

                    <p className="text-gray-500 text-sm">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Registrado
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
