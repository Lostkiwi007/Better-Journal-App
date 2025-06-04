 import React from "react";
-import { useNavigate } from "react-router-dom";
+import { Link } from "react-router-dom";

 export default function PerformancePage() {
-  const navigate = useNavigate();
   return (
     <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: 24 }}>
       <h1 style={{ color: "#34d399" }}>Performance Summary</h1>
-      <button onClick={() => navigate("/")} style={{ marginBottom: 16, color: "#60a5fa" }}>
-        Back to Journal
-      </button>
+      <Link to="/" style={{
+        display: "inline-block",
+        marginBottom: 16,
+        padding: "8px 12px",
+        backgroundColor: "#60a5fa",
+        color: "white",
+        borderRadius: 4,
+        textDecoration: "none",
+      }}>
+        Back to Journal
+      </Link>
       <p>Performance metrics and charts will go here.</p>
     </div>
   );
 }