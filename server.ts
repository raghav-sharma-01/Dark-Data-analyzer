import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- MOCK API ROUTES --- //
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Dark Data Analyzer Engine" });
  });

  // Mock ML Data Analysis Endpoint
  app.post("/api/analyze", (req, res) => {
    // Simulate processing delay
    setTimeout(() => {
      res.json({
        success: true,
        summary: {
          totalRows: 154203,
          features: 24,
          anomaliesDetected: 142,
          dataHealthScore: 88,
        },
        insights: [
          "Sales dropped 18% in North Region after inventory delays.",
          "Repeated failed transactions detected from Vendor Group B.",
          "Customer churn probability increased by 23% in the last 30 days.",
          "Unused operational data reveals $14K/month hidden cost leakage.",
          "Unexpected peak in cross-selling during late-night hours in EMEA.",
          "High cart abandonment correlated with multi-step authentication process.",
        ],
        recommendations: [
          "Audit Vendor Group B payment gateways immediately.",
          "Re-allocate marketing budget to North Region to combat sales drop.",
          "Implement automated retention emails for high-churn-risk segments.",
          "Streamline user authentication process during checkout phase.",
          "Launch targeted late-night promotions for the EMEA region.",
          "Review underutilized software licenses to recover $14K hidden costs."
        ],
        anomalies: [
          { feature: "TransactionAmount", value: 45000, expected: 1200, riskLevel: "Critical" },
          { feature: "LoginFrequency", value: 142, expected: 5, riskLevel: "High" },
          { feature: "RefundRate", value: 18.5, expected: 2.1, riskLevel: "Moderate" },
          { feature: "APIErrorRate", value: 4.8, expected: 0.1, riskLevel: "Critical" },
          { feature: "SessionDuration", value: 480, expected: 45, riskLevel: "Moderate" }
        ]
      });
    }, 2500); // 2.5s delay to simulate heavy ML workload
  });

  app.get("/api/dashboard/metrics", (req, res) => {
    res.json({
      kpis: {
        totalRevenue: 2450000,
        revenueGrowth: 14.2,
        activeUsers: 84200,
        userGrowth: -2.4,
        darkDataProcessed: "4.2 TB",
        insightsGenerated: 1245
      },
      revenueChart: [
        { name: "Jan", revenue: 4000, cost: 2400 },
        { name: "Feb", revenue: 3000, cost: 1398 },
        { name: "Mar", revenue: 2000, cost: 9800 },
        { name: "Apr", revenue: 2780, cost: 3908 },
        { name: "May", revenue: 1890, cost: 4800 },
        { name: "Jun", revenue: 2390, cost: 3800 },
        { name: "Jul", revenue: 3490, cost: 4300 }
      ],
      anomalyDistribution: [
        { name: "Payments", value: 400 },
        { name: "Logins", value: 300 },
        { name: "Inventory", value: 300 },
        { name: "Refunds", value: 200 }
      ],
      insights: [
         { time: "2m ago", text: "Sales dropped 18% in North Region after inventory delays.", type: "risk" },
         { time: "15m ago", text: "New up-sell pattern discovered in Enterprise segment.", type: "opp" },
         { time: "1h ago", text: "Unexpected peak in cross-selling during late-night hours in EMEA.", type: "opp" },
         { time: "2h ago", text: "Repeated failed transactions from Vendor Group B.", type: "alert" },
         { time: "3h ago", text: "Customer churn probability increased by 23%.", type: "risk" },
         { time: "5h ago", text: "Logistics overhead spike detected in Q3 projection.", type: "risk" }
      ]
    });
  });

  // --- VITE MIDDLEWARE --- //
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
