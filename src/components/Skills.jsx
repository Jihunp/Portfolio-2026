"use client";
import {motion} from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const skills = [
    "React",
    "Next.js",
    "JavaScript",
    "HTML & CSS",
    "Git",
    "Node.js",
    "Tailwind CSS",
    "WordPress",
    "REST APIs",
    "Framer Motion",
];

const container = {
    hidden: {},
    show: {transition: {staggerChildren: 0.055}},
};

const pill = {
    hidden: {opacity: 0, scale: 0.75},
    show: {
        opacity: 1,
        scale: 1,
        transition: {type: "spring", stiffness: 380, damping: 18},
    },
};

export default function Skills() {
    return (
        <section id="skills" className="py-24 px-6 max-w-4xl mx-auto">
            <ScrollReveal>
                <h2 className="text-3xl font-bold text-center mb-16">Skills</h2>
            </ScrollReveal>

            <motion.div
                className="flex flex-wrap gap-3 justify-center"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}>
                {skills.map((skill) => (
                    <motion.span
                        key={skill}
                        variants={pill}
                        whileHover={{scale: 1.1, y: -2}}
                        className="bg-gray-100 text-gray-700 px-4 py-2
              rounded-full text-sm font-medium cursor-default">
                        {skill}
                    </motion.span>
                ))}
            </motion.div>
        </section>
    );
}
