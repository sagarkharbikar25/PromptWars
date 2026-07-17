import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StadiumGenie — Smart Stadium & Operations Companion',
  description: 'AI-assisted Fan Assistant and Live Operations Dashboard for FIFA World Cup 2026 Stadiums.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(5, 8, 20, 0.6)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#030712',
              fontSize: '18px'
            }}>
              G
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                Stadium<span style={{ background: 'linear-gradient(to right, #00f2fe, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Genie</span>
              </h1>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '-2px' }}>
                FIFA World Cup 2026 Operations
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontWeight: 500
            }}>
              Live Telemetry: Connected
            </span>
          </div>
        </header>

        <main style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
