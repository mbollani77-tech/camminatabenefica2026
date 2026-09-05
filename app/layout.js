import './globals.css';

export const metadata = {
  title: 'Camminata Benefica - Iscrizioni',
  description: 'Iscriviti alla camminata benefica del 4 ottobre 2026',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        {children}
      </body>
    </html>
  );
}
