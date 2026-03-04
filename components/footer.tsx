import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-40 border-t border-white/5 bg-white/[0.01] py-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold tracking-tighter mb-6">zee.build</h3>
            <p className="text-muted-foreground/80 max-w-sm leading-relaxed text-sm">
              An independent build lab dedicated to the intersection of 
              software engineering and precision product design. 
              Built in public, shipped with care.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-6">Index</h4>
            <div className="flex flex-col gap-4">
              <Link href="/builds" className="text-sm hover:text-primary transition-colors">Builds</Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
              <Link href="/nutrinest" className="text-sm hover:text-primary transition-colors">NutriNest</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-6">Connectivity</h4>
            <div className="flex flex-col gap-4 text-sm">
              <Link href="https://linkedin.com/in/ziyanbinanoos" className="hover:text-primary transition-colors">LinkedIn</Link>
              <Link href="https://github.com" className="hover:text-primary transition-colors">GitHub</Link>
              <Link href="mailto:contact@zee.build" className="hover:text-primary transition-colors">Email</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
            <span>© {currentYear} Ziyan Bin Anoos Hilal</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>Operational System OK</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-mono text-primary/40 uppercase tracking-widest">
            LOC: 25.2048° N, 55.2708° E
          </div>
        </div>
      </div>
    </footer>
  );
}
