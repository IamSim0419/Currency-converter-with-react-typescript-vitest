export default function ToasterCopyKit({ copy }: { copy: boolean }) {
  return (
    <div
      className={`absolute -top-9 right-0 px-3 py-2 text-sm bg-gray-200 text-green-800 rounded transition-opacity duration-200 pointer-events-none ${
        copy ? "opacity-100" : "opacity-0"
      }`}
    >
      Copied!
    </div>
  );
}
