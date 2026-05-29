import logo from "@/assets/rapsor-logo.png";

export function StreamerCard() {
  return (
    <section className="mt-10 flex items-center justify-center">
      <img
        src={logo}
        alt="Logo de Rapsor"
        width={768}
        height={512}
        loading="lazy"
        className="h-80 sm:h-[28rem] w-auto drop-shadow-[0_0_60px_oklch(0.55_0.25_290_/_0.7)]"
      />
    </section>
  );
}
