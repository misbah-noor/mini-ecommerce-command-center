import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AdminDashboard = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.get("/api/admin/analytics");
      setData(res.data);
    };
    fetchAnalytics();
  }, []);

  if (!data) {
    return (
      <div className="text-gray-400 pt-45 text-center text-xl">
        Loading analytics...
      </div>
    );
  }

  return (
  <div className="space-y-12">

    <div>
      <h2 className="text-xl font-semibold md:text-3xl text-center py-5 text-[var(--color-primary)] mb-6">
        Welcome Back, Misbah
      </h2>
    </div>
    {/* ===== Metrics Section ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Total Sales */}
      <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg hover:shadow-2xl transition">

        <h3 className="text-xl font-semibold text-[var(--color-muted)] mb-6">
          Total Sales
        </h3>

        <div className="w-40 h-40 mx-auto">
          <CircularProgressbar
            value={(data.totalSales / 90000) * 100}
            text={`$${data.totalSales}`}
            strokeWidth={16}
            styles={buildStyles({
              textColor: "var(--color-text)",
              pathColor: "var(--color-success)",
              trailColor: "var(--color-border)",
              textSize: "16px"
            })}
          />
        </div>
      </div>

      {/* Total Orders */}
      <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg hover:shadow-2xl transition">

        <h3 className="text-lg font-semibold text-[var(--color-muted)] mb-6">
          Total Orders
        </h3>

        <div className="w-40 h-40 mx-auto">
          <CircularProgressbar
            value={(data.totalOrders / 300) * 100}
            text={`${data.totalOrders}`}
            strokeWidth={18}
            styles={buildStyles({
              textColor: "var(--color-text)",
              pathColor: "var(--color-primary)",
              trailColor: "var(--color-border)",
              textSize: "18px"
            })}
          />
        </div>
      </div>

    </div>


    {/* ===== Stock Chart ===== */}
    <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg hover:shadow-2xl transition">

      <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">
        Stock Overview
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data.stockData}>
          <CartesianGrid strokeDasharray= "3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-muted)" />
          <YAxis stroke="var(--color-muted)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px"
            }}
          />
          <Bar
            dataKey="stock"
            radius={[8, 8, 0, 0]}
            fill="var(--color-primary)"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>


    {/* ===== Low Stock Section ===== */}
    <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition">

      <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
        Low Stock Alerts
      </h2>

      {data.stockData.filter(item => item.stock < 8).length === 0 ? (
        <p className="text-[var(--color-muted)] text-lg text-center py-6">
          All products are sufficiently stocked ✅
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-sm text-[var(--color-muted)]">
                <th className="py-3">Product</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.stockData
                .filter(item => item.stock < 8)
                .map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition"
                  >
                    <td className="py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="py-4">
                      {item.stock}
                    </td>

                    <td className="py-4">
                      <span className={`px-3 py-1 text-md rounded-full font-semibold
                        ${item.stock <= 3 
                          ? "bg-red-600 text-red-100 dark:bg-red-100 dark:text-red-600"
                          : "bg-yellow-600 text-yellow-100 dark:bg-yellow-100 dark:text-yellow-500"
                        }`}>
                        {item.stock <= 15 ? "Critical" : "Low"}
                      </span>
                    </td>

                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      )}
    </div>

  </div>
);

};

export default AdminDashboard;