function Landing() {
  return <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-semibold mb-3">Welcome Page</h1>
        <button onClick={() => window.location.replace("/signin")} className="bg-gray-600 hover:bg-gray-800 cursor-pointer text-white px-4 py-2 rounded">Sign In</button>
  </div>;
}
export default Landing;