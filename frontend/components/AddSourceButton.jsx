export default function AddSourceButton({ func, text }) {
  return (
    <button
      onClick={func}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-200 flex items-center cursor-pointer shadow-md"
    >
      <span className="mr-2">+</span>
      {text}
    </button>
  );
}
