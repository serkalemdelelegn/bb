export default function Loader() {
  return (
    <div className="w-full h-screen bg-gray-100 bg-opacity-75 flex flex-col justify-center items-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      {/* Optional text */}
      <div className="text-blue-500 mt-4">Loading... Please wait</div>
    </div>
  );
}
