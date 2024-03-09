"use client";
import Image from "next/image";
import "./page.css";
import Accordion from "@components/Accordion";

export default function Faqs() {
  return (
    <div className="h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <div className="h-auto bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
        <div className="md:pt-20 pt-10 flex lg:w-8/12 w-11/12 justify-center items-center m-auto">
          <div className="flex flex-col lg:w-1/2 gap-6">
            <p className="text-white md:text-5xl text-4xl font-extrabold">
              FIND THE <span className="underline decoration-4">ANSWER</span> TO
              YOUR QUESTIONS
            </p>
            <p className="text-white font-poppins font-light leading-8">
              This list of frequently asked questions is designed to supplement
              the general rules provided below. If you have any questions,
              please don&apos;t hesitate to contact the organizing team. We will
              continually update this FAQ section with answers to the most
              common inquiries.
            </p>
          </div>
          <Image
            className="box hidden lg:block"
            src="/interrogacao.png"
            alt="Banner"
            width={300}
            height={300}
          />
        </div>

        <div className="lg:w-8/12 w-11/12 m-auto py-6 ">
          <Accordion />
        </div>
      </div>
    </div>
  );
}
