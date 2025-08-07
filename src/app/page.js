// src/app/page.js

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const categories = [
  { key: "performance", label: "Performance" },
  { key: "transactional", label: "Transactional" },
  { key: "picos", label: "PICOS" },
];

const placeholderData = {
  performance: {
    summary: {
      "GMV (฿)": "-",
      "รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)": "-",
      สินค้าที่ขายได้: "-",
      ลูกค้า: "-",
      คำสั่งซื้อ: "-",
      อัตราคอนเวอร์ชั่น: "-",
    },
    daily: Array(7)
      .fill(null)
      .map((_, i) => ({
        สรุปข้อมูล: `Day ${i + 1}`,
        "GMV (฿)": "-",
        "รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)": "-",
        สินค้าที่ขายได้: "-",
        ลูกค้า: "-",
        คำสั่งซื้อ: "-",
        อัตราคอนเวอร์ชั่น: "-",
      })),
  },
  transactional: {
    summary: {
      "All Orders": "-",
      "Completed Orders": "-",
      "Settlement Report": "-",
    },
    daily: Array(7)
      .fill(null)
      .map((_, i) => ({
        วันที่: `Day ${i + 1}`,
        "All Orders": "-",
        "Completed Orders": "-",
        "Settlement Report": "-",
      })),
  },
  picos: {
    summary: {
      "Product Reviews": "-",
      Stock: "-",
      "Assortment & Pricing": "-",
    },
    daily: Array(7)
      .fill(null)
      .map((_, i) => ({
        วันที่: `Day ${i + 1}`,
        "Product Reviews": "-",
        Stock: "-",
        "Assortment & Pricing": "-",
      })),
  },
};

function KpiCard({ label, value, color }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    teal: "text-teal-600",
    gray: "text-gray-600",
  };
  return (
    <div className="bg-white p-3 rounded shadow text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-bold ${colorMap[color] || colorMap.gray}`}>
        {value}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("performance");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/getData");
        if (
          response.data &&
          typeof response.data.summary === "object" &&
          Array.isArray(response.data.daily)
        ) {
          const filteredDailyData = response.data.daily.filter(
            (row) =>
              row["สรุปข้อมูล"] && row["สรุปข้อมูล"].toLowerCase() !== "วันที่"
          );
          if (!ignore) {
            setData({
              summary: response.data.summary,
              daily: filteredDailyData,
            });
            setError(null);
          }
        } else {
          throw new Error("โครงสร้างข้อมูลที่ได้รับจาก API ไม่ถูกต้อง");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            "ไม่สามารถดึงข้อมูลได้: " +
              (err.response?.data?.error || err.message)
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  // Map KPI fields and colors for each tab
  const kpiConfig = {
    performance: [
      { label: "GMV (฿)", key: "GMV (฿)", color: "blue" },
      {
        label: "รายได้รวม (฿)",
        key: "รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)",
        color: "green",
      },
      { label: "สินค้าที่ขายได้", key: "สินค้าที่ขายได้", color: "purple" },
      { label: "ลูกค้า", key: "ลูกค้า", color: "orange" },
      { label: "คำสั่งซื้อ", key: "คำสั่งซื้อ", color: "red" },
      { label: "อัตราคอนเวอร์ชั่น", key: "อัตราคอนเวอร์ชั่น", color: "teal" },
    ],
    transactional: [
      { label: "All Orders", key: "All Orders", color: "blue" },
      { label: "Completed Orders", key: "Completed Orders", color: "green" },
      { label: "Settlement Report", key: "Settlement Report", color: "purple" },
    ],
    picos: [
      { label: "Product Reviews", key: "Product Reviews", color: "blue" },
      { label: "Stock", key: "Stock", color: "green" },
      {
        label: "Assortment & Pricing",
        key: "Assortment & Pricing",
        color: "purple",
      },
    ],
  };

  // เลือกข้อมูลที่จะแสดงตาม tab
  let displayData;
  if (activeTab === "performance" && data) {
    displayData = {
      summary: {
        "GMV (฿)": data.summary["GMV (฿)"] ?? "-",
        "รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)":
          data.summary["รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)"] ??
          "-",
        สินค้าที่ขายได้: data.summary["สินค้าที่ขายได้"] ?? "-",
        ลูกค้า: data.summary["ลูกค้า"] ?? "-",
        คำสั่งซื้อ: data.summary["คำสั่งซื้อ"] ?? "-",
        อัตราคอนเวอร์ชั่น: data.summary["อัตราคอนเวอร์ชั่น"] ?? "-",
      },
      daily:
        Array.isArray(data.daily) && data.daily.length > 0
          ? data.daily
          : placeholderData.performance.daily,
    };
  } else if (activeTab === "transactional") {
    displayData = placeholderData.transactional;
  } else if (activeTab === "picos") {
    displayData = placeholderData.picos;
  } else {
    displayData = placeholderData.performance;
  }

  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen">
        🌀 กำลังโหลด...
      </main>
    );
  if (error)
    return (
      <main className="flex items-center justify-center min-h-screen">
        ❌ {error}
      </main>
    );
  if (!displayData || !displayData.summary || !displayData.daily) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        🤔 ไม่พบข้อมูล
      </main>
    );
  }

  // เตรียมข้อมูลกราฟ (เฉพาะ performance)
  let chartArea = null;
  if (
    activeTab === "performance" &&
    displayData &&
    displayData.daily &&
    displayData.daily.length > 0
  ) {
    const chartLabels = displayData.daily.map((d) => d["สรุปข้อมูล"] || `Day`);
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: "GMV (฿)",
          data: displayData.daily.map((d) => {
            const val = d["GMV (฿)"];
            const num =
              typeof val === "string"
                ? parseFloat(val.replace(/,/g, ""))
                : Number(val);
            return isNaN(num) ? 0 : num;
          }),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "รายได้รวม (฿)",
          data: displayData.daily.map((d) => {
            const val = d["รายได้รวม (พร้อมเงินสนับสนุนสินค้าจากแพลตฟอร์ม)"];
            const num =
              typeof val === "string"
                ? parseFloat(val.replace(/,/g, ""))
                : Number(val);
            return isNaN(num) ? 0 : num;
          }),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "ภาพรวมข้อมูล 7 วันล่าสุด",
          font: { size: 16, weight: "bold" },
          color: "#333",
        },
      },
      scales: { y: { beginAtZero: true } },
    };
    chartArea = <Line options={chartOptions} data={chartData} />;
  } else {
    chartArea = (
      <span className="text-gray-400 text-sm">[Chart Placeholder]</span>
    );
  }

  return (
    <main className="max-w-md mx-auto p-2 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">
        Data Analytics Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`flex-1 py-2 text-sm ${
              activeTab === cat.key
                ? "border-b-2 border-blue-500 font-bold bg-white"
                : "text-gray-500 bg-gray-100"
            }`}
            onClick={() => setActiveTab(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-2 gap-2 mb-4`}>
        {kpiConfig[activeTab].map((kpi) => (
          <KpiCard
            key={kpi.key}
            label={kpi.label}
            value={displayData.summary[kpi.key]}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Chart Area (Line Chart for performance) */}
      <div className="bg-white p-2 rounded shadow mb-4 min-h-[120px] flex items-center justify-center">
        {chartArea}
      </div>

      {/* Daily Data Accordion/List */}
      <div>
        {displayData.daily.map((row, idx) => (
          <details key={idx} className="mb-2 bg-white rounded shadow">
            <summary className="px-4 py-2 cursor-pointer font-medium">
              {row["สรุปข้อมูล"] || row["วันที่"] || `Day ${idx + 1}`}
            </summary>
            <div className="px-4 py-2 text-sm text-gray-700">
              {Object.entries(row).map(([k, v]) =>
                k !== "สรุปข้อมูล" && k !== "วันที่" ? (
                  <div
                    key={k}
                    className="flex justify-between border-b last:border-b-0 py-1"
                  >
                    <span className="text-gray-500">{k}</span>
                    <span>{v}</span>
                  </div>
                ) : null
              )}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
