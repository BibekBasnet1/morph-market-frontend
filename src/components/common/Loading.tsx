const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring - The "Snake" Body */}
        <div className="w-24 h-24 border-8 border-emerald-100 rounded-full absolute"></div>
        <div className="w-24 h-24 border-8 border-t-emerald-500 border-r-emerald-400 rounded-full animate-spin"></div>
        
        {/* Center Icon - Use a reptile/scale icon if you have one */}
        <div className="absolute animate-bounce text-3xl">
          🦎
        </div>
      </div>
      
      {/* Engaging Text */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Incubating Results...</h2>
        <p className="text-slate-500 text-sm animate-pulse">Checking the heat mats</p>
      </div>
    </div>
  );
};

export default Loading;