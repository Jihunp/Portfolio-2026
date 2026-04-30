export default function EmailSideBar() {

    return (
        <div className="fixed bottom-20 right-10 flex flex-col items-center gap-8 z-20">
                <a
                    href="hello"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--muted)] [writing-mode:vertical-rl] hover:text-[var(--accent)] hover:-translate-y-1 transition-all duration-200 hidden lg:flex">
                        jihunparked@gmail.com
                </a>
        </div>
    );
}
