import './globals.css';

export const metadata = {
  title: 'Camminata Benefica - Iscrizioni',
  description: 'Iscriviti alla camminata benefica del 20 settembre 2026',
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
