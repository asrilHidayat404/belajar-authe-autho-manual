"use client";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center bg-black">
                <div className="rocket-wrapper">
                    <div className="rocket">🚀</div>
                    <div className="flame"></div>
                </div>

                <style jsx>{`
         .rocket-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fly 5s ease-in-out infinite; /* durasi lebih lama */
}

.rocket {
  font-size: 4rem;
  transform: rotate(315deg);
}

.flame {
  width: 12px;
  height: 20px;
  background: radial-gradient(circle, orange 40%, red 70%, transparent 100%);
  border-radius: 50%;
  margin-top: -5px;
  animation: flame 0.6s infinite alternate; /* lebih lambat dari sebelumnya */
}

@keyframes fly {
  0% {
    transform: translateY(100px);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-80px);
    opacity: 1;
  }
  100% {
    transform: translateY(100px);
    opacity: 0.5;
  }
}

@keyframes flame {
  0% {
    transform: scaleY(1);
    opacity: 0.9;
  }
  100% {
    transform: scaleY(1.6);
    opacity: 0.4;
  }
}
        `}</style>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-2xl">
            <p>Selamat datang 🚀</p>
            <p>{user?.full_name}</p>
        </div>
    );
}
