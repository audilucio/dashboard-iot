"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightData {
  id: number;
  weight: number;
  createdAt: string;
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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Dashboard IoT
        </h1>

        {latest && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <p className="text-gray-500 text-xl">
              Peso Atual
            </p>

            <h2 className="text-7xl font-bold text-blue-600 mt-4">
              {latest.weight} kg
            </h2>

            <p className="text-gray-400 mt-4">
              Última atualização:
            </p>

            <p className="text-gray-600">
              {new Date(
                latest.createdAt
              ).toLocaleString()}
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Histórico em Tempo Real
          </h2>

          <div className="w-full h-[400px]">
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
