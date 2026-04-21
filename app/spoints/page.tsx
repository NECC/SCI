"use client";
import Image from "next/image";
import "./page.css";

const tiers = [
  { name: "EMERALD", pts: "200 P", color: "#50fa7b" },
  { name: "DIAMOND", pts: "100 P", color: "#8be9fd" },
  { name: "GOLD",    pts: "50 P",  color: "#f1fa8c" },
  { name: "SILVER",  pts: "20 P",  color: "#d0d0d0" },
  { name: "BRONZE",  pts: "10 P",  color: "#ffb86c" },
];

export default function PointsAndRewards() {
  return (
    <div className="min-h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <div className="md:pt-20 pt-10 pb-16 flex lg:w-8/12 w-11/12 justify-center items-start m-auto">

        {/* Left column */}
        <div className="flex flex-col lg:w-1/2 gap-8 w-full">

          {/* Heading */}
          <p className="text-white md:text-5xl text-4xl font-extrabold uppercase leading-tight">
            <span className="underline decoration-4">POINTS</span> AND REWARDS SYSTEM
          </p>

          {/* Intro */}
          <p className="text-white font-light leading-7 text-sm md:text-base">
            The points and rewards system aims to bring students and sponsoring companies
            closer together through gamification. This encourages participation with
            achievements and rewards.
          </p>

          {/* How it works */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-extrabold text-xl uppercase">
              How does it work?
            </p>
            <p className="text-white font-light leading-7 text-sm md:text-base">
              Each activity completed by participants awards achievements with different
              point values. These achievements can be earned through participation in
              workshops, lectures, and interactions with companies.
            </p>

            {/* Tier rows */}
            <div className="flex flex-col gap-2">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-between px-5 py-3 rounded-lg border border-white/30 bg-white/10"
                >
                  <span
                    className="font-extrabold text-sm tracking-widest uppercase"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </span>
                  <span className="text-white font-bold text-sm">{tier.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Golden tip */}
          {/* <div className="rounded-lg border-l-4 border-yellow-400 bg-white/10 px-5 py-4">
            <p className="text-yellow-300 font-bold text-sm uppercase tracking-wide mb-1">
              ⚡ Golden Tip
            </p>
            <p className="text-white font-light leading-7 text-sm md:text-base">
              During{" "}
              <span className="font-semibold text-yellow-300">Golden Hours</span>,
              achievements automatically go up one level — increasing the points awarded
              and encouraging greater interaction with companies.
            </p>
          </div> */}

          {/* Rewards */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-extrabold text-xl uppercase">
              What are the rewards?
            </p>

            <div className="rounded-lg border border-white/30 bg-white/10 px-5 py-4 flex flex-col gap-1">
              <p className="text-white font-bold text-sm uppercase tracking-wide">
                🏆 General Prizes
              </p>
              <p className="text-white font-light leading-7 text-sm">
                Result from accumulation of points through active participation in
                lectures, workshops, and talks. The top three participants are awarded
                1st, 2nd, and 3rd place.
              </p>
            </div>

            <div className="rounded-lg border border-white/30 bg-white/10 px-5 py-4 flex flex-col gap-1">
              <p className="text-white font-bold text-sm uppercase tracking-wide">
                🎯 Company Prizes
              </p>
              <p className="text-white font-light leading-7 text-sm">
                The winner is selected through a weighted draw among participants who
                complete at least{" "}
                <span className="font-semibold">60%</span> of the company achievements.
              </p>
            </div>
          </div>

        </div>

        {/* Right column — decorative image */}
        <div className="hidden lg:flex lg:w-1/2 justify-center items-center pt-4">
          <Image
            className="box"
            src="/betterFAQ.png"
            alt="Points and Rewards Banner"
            width={300}
            height={300}
          />
        </div>

      </div>
    </div>
  );
}