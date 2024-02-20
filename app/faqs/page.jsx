'use client';
import Image from 'next/image'
import './page.css';
import Accordion from "@components/Accordion";


export default function Faqs() {

    return (
        <div className='h-screen bg-custom-blue-3 '>
            <div className='md:pt-20 pt-10 flex lg:w-8/12 w-11/12 justify-center items-center m-auto'>
                <div className='flex flex-col lg:w-1/2 gap-6'>
                    <p className='text-white md:text-5xl text-4xl font-extrabold'>FIND THE <span className='underline decoration-4'>ANSWER</span> TO YOUR QUESTIONS</p>
                    <p className='text-white font-poppins font-light leading-8'>This list of frequently asked questions serves to complement the general rules that you can find below. Get in touch with the organizing team whenever a question arises and we will add answers to the most f</p>
                </div>
                <Image className="box hidden lg:block" src="/interrogacao.png" alt="Banner" width={300} height={300} />
            </div>

            <div className='lg:w-8/12 w-11/12 m-auto py-6 '>
                <Accordion />
            </div>
        </div>
    )
}