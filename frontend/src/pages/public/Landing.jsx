import  preview  from "../../assets/preview.png";
import Logo from "../../assets/qq.svg"

import { Link} from "react-router-dom";
import video from "../../assets/video.mp4";
export default function Landing() {

  return (
    <div className="bg-slate-950 text-slate-200">
      <Hero />
      <BrandSection/>
      <VideoSection/>
      <HowItWorks />
      <Categories />
      <Trust />
      
      <CTA />
    </div>
  );
}
function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* subtle tricolor glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-72 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm bg-white/10 text-slate-200">
            🇮🇳 Built for India
          </span>

          <h1 className="text-6xl md:text-6xl font-extrabold leading-tight">
            The future isn’t guessed.{" "}
            <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              It’s predicted.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-xl">
            Predict real-world events like cricket, politics, markets, and
            current affairs. Earn tokens directly in your wallet.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/app" className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition">
              Start Predicting
            </Link>
            {/* <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition">
              Explore Markets
            </button> */}
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
            <span>🔒 Safe</span>
            <span>⚡ Fast</span>
            <span>👛 Wallet-based</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-green-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <img
              src={preview}
              alt="INDIABOL App Preview"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Step
            title="Choose a Market"
            text="Pick events you care about across multiple categories."
          />
          <Step
            title="Predict YES or NO"
            text="Stake tokens on the outcome you believe in."
          />
          <Step
            title="Win Rewards"
            text="Earn rewards when your prediction is correct."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ title, text }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
function Categories() {
  const cats = [
    "Cricket",
    "Bollywood",
    "Politics",
    "Current Affairs",
    "Gold & Economy",
    "Space",
    "Crypto",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Markets Across Categories
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {cats.map((c) => (
            <span
              key={c}
              className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
function Trust() {
  return (
    <section className="py-24 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Built for Transparency
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-sm">
          <TrustItem text="On-chain markets" />
          <TrustItem text="Non-custodial funds" />
          <TrustItem text="Transparent pools" />
          <TrustItem text="Admin-controlled resolution" />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ text }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400">
      {text}
    </div>
  );
}
function CTA() {
  return (
    <section className="py-32 px-6 text-center">
      <h2 className="text-4xl font-bold">
        Ready to predict the future?
      </h2>

      <div className="mt-8">
        <a
          href="/app"
          className="px-10 py-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          Launch App
        </a>
      </div>
    </section>
  );
}



function BrandSection() {
  return (
    <section className="relative bg-white dark:bg-slate-950 pb-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-lg bg-white dark:bg-slate-900">
            <img
              src={Logo}
              alt="INDIABol Logo"
              className="w-24 h-24"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          INDIA<span className="text-green-500">Bol</span>
        </h2>

        {/* Tagline */}
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          India’s prediction platform where insight meets rewards.
          <br />
          Predict real-world events and earn directly in your wallet.
        </p>

        {/* Accent line */}
        <div className="mt-10 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 via-white to-green-400" />
        </div>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
   <section className="py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

       
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
          <video
            src={video}
            loop
            controls
            playsInline
            className="w-full h-[320px] md:h-[780px] object-cover"
          />
        </div>

        {/* RIGHT : Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
            One man predicted everything.
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              Now the power is yours.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Predict real-world events like cricket, politics, markets and
            breaking news. Earn rewards directly in your wallet — safe, simple
            and transparent.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/app"
              className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Start Predicting
            </Link>

            {/* <button className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition">
              Learn More
            </button> */}
          </div>
        </div>

      </div>
    </section>

  );
}
