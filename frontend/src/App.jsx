import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to HomeStudy API...");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/health"
        )
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        setMessage(data.message);
      } catch (error) {
        console.error("Connection error:", error);
        setMessage("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };
    checkBackend();
  }, []);
  return (
    <main>
      <h1>HomeStudy</h1>
      <h2>Frontend and Backend Connection Test</h2>
      <p>
        {loading ? "Checking connection..." : message}
      </p>
    </main>
  );
}
export default App;