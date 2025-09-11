import GridShape from "@/components/auth/GridShape";
import ThemeTogglerTwo from "@/utils/ThemeTogglerTwo";
import TypeEffect from "@/utils/TypeEffect";
import Link from "next/link";


export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <div className="relative z-1 p-6 sm:p-0 ">
            <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row ">
                {children}
                <div
                    className="bg-brand-950 relative hidden h-full w-full items-center overflow-hidden bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms] lg:grid lg:w-1/2 dark:bg-white/5"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(68,68,68,.2) 50%, transparent 75%, transparent 100%)',
                        backgroundSize: '250% 250%, 100% 100%',
                        backgroundRepeat: 'no-repeat',
                        animation: 'shineMove 2s linear infinite',
                        backgroundPosition: '-100% 0, 0 0',
                    }}
                >
                    <style>{`
                            @keyframes shineMove {
                                0% {
                                    background-position:
                                        -100% 0,
                                        0 0;
                                }
                                100% {
                                    background-position:
                                        200% 0,
                                        0 0;
                                }
                            }
                        `}</style>
                    <div className="relative z-1 flex items-center justify-center">
                        {/* <!-- ===== Common Grid Shape Start ===== --> */}
                        <GridShape />
                        <div className="flex max-w-full flex-col items-center">
                            <Link href="/" className="mb-4 block">
                                <img width={231} height={48} src="/logo/logo-ua.png" alt="Logo" />
                            </Link>
                            <TypeEffect text="Kemahasiswaan Universitas Annuqayah" delay={150} />
                        </div>
                    </div>
                </div>
                <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
                    <ThemeTogglerTwo />
                </div>
            </div>
        </div>
    );
}