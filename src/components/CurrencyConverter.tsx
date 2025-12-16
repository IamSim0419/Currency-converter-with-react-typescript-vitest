import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import CopyToolkit from "./ToasterCopyKit";

type RatesResponse = {
  rates: Record<string, number>;
  base_code: string;
  result: "success" | "error";
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("PHP");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [round, setRound] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);

  // Fetch rates when base changes
  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        const data: RatesResponse = await res.json();
        // console.log(data);

        if (data.result !== "success") {
          throw new Error("API error");
        }

        setRates(data.rates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [base]);

  // Derived value (NO useEffect, NO setState)
  const rate = rates[target] ?? 0; // rates[target] results is example 58.96 for PHP if base is USD
  const result = rate === 0 ? 0 : Number((amount * rate).toFixed(round));

  function copyResult() {
    navigator.clipboard.writeText(result.toString());
    setCopy(true);
    setTimeout(() => setCopy(false), 1000);
  }

  function saveToHistory() {
    const entry = `${amount} ${base} → ${result} ${target}`;
    setHistory((prev) => [entry, ...prev]);
  }

  return (
    <div className="p-6 max-w-xl mx-auto my-10 space-y-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-center">💱 Currency Converter</h1>
      {loading && <p className="text-center text-sm">Loading…</p>}
      <input
        type="number"
        className="w-full border p-2 rounded"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        className="w-full border p-2 rounded"
        value={base}
        onChange={(e) => setBase(e.target.value)}
      >
        {Object.keys(rates).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className="w-full border p-2 rounded"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      >
        {Object.keys(rates).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className="w-full border p-2 rounded"
        value={round}
        onChange={(e) => setRound(Number(e.target.value))}
      >
        <option value={0}>0 decimals</option>
        <option value={2}>2 decimals</option>
        <option value={4}>4 decimals</option>
      </select>

      {/* Result and Copy Button */}
      <div className="relative flex justify-between items-center p-4 border rounded bg-gray-100">
        <span className="text-xl font-bold">
          {result} {target}
        </span>

        <button
          onClick={copyResult}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 active:bg-blue-700"
        >
          <FiCopy /> Copy
        </button>
        <CopyToolkit copy={copy} />
      </div>

      {/* Save to History Button */}
      <button
        onClick={saveToHistory}
        className="w-full py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 active:bg-green-700"
      >
        Save to History
      </button>
      <ul className="space-y-2 text-sm">
        {history.map((h, i) => (
          <li key={i} className="p-2 border rounded bg-gray-100">
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
