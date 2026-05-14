import {
    FiGithub,
    FiInstagram,
    FiTwitter,
    FiLinkedin,
    FiCodepen,
} from "react-icons/fi";

export default function SocialSideBar() {
    const socials = [
        {
            href: "https://github.com/jihunp",
            label: "GitHub",
            icon: <FiGithub size={20} />,
        },
        // {
        //     href: "https://instagram.com/yourusername",
        //     label: "Instagram",
        //     icon: <FiInstagram size={20} />,
        // },
        // {
        //     href: "https://twitter.com/yourusername",
        //     label: "Twitter",
        //     icon: <FiTwitter size={20} />,
        // },
        {
            href: "https://www.linkedin.com/in/edward-jihun-park/",
            label: "LinkedIn",
            icon: <FiLinkedin size={20} />,
        },
        // {
        //     href: "https://codepen.io/yourusername",
        //     label: "CodePen",
        //     icon: <FiCodepen size={20} />,
        // },
    ];

    return (
        <div className="fixed bottom-20 left-10 flex flex-col items-center gap-8 z-20 hidden lg:flex">
            {socials.map(({href, label, icon}) => (
                <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--muted)] hover:text-[var(--accent)] hover:-translate-y-1 transition-all duration-200">
                    {icon}
                </a>
            ))}
        </div>
    );
}
