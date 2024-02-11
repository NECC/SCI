import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
export default function accordion() {

    const where = " SCI takes place from June 5th to June 7th, at Universidade do Minho in Braga.";
    const free = "Yes, it’s free to all attendees!";
    const participate = "Of course! SCI is open to everyone, regardless if you’re a student or not. Everyone is welcome to participate in our workshops and our talks.";
    const register = "You can participate by registering in this year’s edition through the link below.";
    const contact = " You can email us at join.di.uminho@gmail.com or send us a message through our social media accounts.";
    return (
        <Accordion
            variant="splitted"
            className="dark:text-white text-black "

            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        height: "auto",
                        transition: {
                            height: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                duration: 1,
                            },
                            opacity: {
                                easings: "ease",
                                duration: 1,
                            },
                        },
                    },
                    exit: {
                        y: -10,
                        opacity: 0,
                        height: 0,
                        transition: {
                            height: {
                                easings: "ease",
                                duration: 0.25,
                            },
                            opacity: {
                                easings: "ease",
                                duration: 0.3,
                            },
                        },
                    },
                },
            }}
        >
            <AccordionItem key="1" aria-label="Accordion 1" title="When and where does SCI take place?" indicator={<MdOutlineArrowBackIosNew size={25} />}>
                {where}
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Is SCI free?" className="mt-4" indicator={<MdOutlineArrowBackIosNew size={25} />}>
                {free}
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Can I participate, even if I’m not a student?" className="mt-4" indicator={<MdOutlineArrowBackIosNew size={25} />}>
                {participate}
            </AccordionItem>
            <AccordionItem key="4" aria-label="Accordion 4" title="Where can I register to participate?" className="mt-4" indicator={<MdOutlineArrowBackIosNew size={25} />}>
                {register}
            </AccordionItem>
            <AccordionItem key="5" aria-label="Accordion 5" title="How can I contact SCI’s team?" className="mt-4" indicator={<MdOutlineArrowBackIosNew size={25} />}>
                {contact}
            </AccordionItem>

        </Accordion>
    );
}
