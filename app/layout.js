// app/layout.js
export default function ChatLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Manu Live</title>
      </head>
      <body>
        <h1>Manchester United VS Crystal Palace</h1>
        {children}
      </body>
    </html>
  );
}
