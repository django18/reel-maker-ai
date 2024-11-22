import VideoUpload from "@/components/VideoUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            AI-Powered Reel Maker
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Transform your videos into engaging reels with the power of AI.
            Upload, edit, and share in minutes.
          </p>
          <div className="max-w-xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            <VideoUpload />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm
                         hover:bg-gray-800/50 transition-all duration-300
                         border border-gray-700/50"
            >
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: "📤",
    title: "Upload Your Video",
    description:
      "Start by uploading your video file. We support most popular formats.",
  },
  {
    icon: "🤖",
    title: "AI Processing",
    description:
      "Our AI analyzes your video and generates optimized content automatically.",
  },
  {
    icon: "✨",
    title: "Custom Templates",
    description: "Apply professional templates to make your reel stand out.",
  },
];
