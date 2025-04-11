import { Provider } from "../components/ui/provider";

export default function RootLayout({ children }) {
  return (
    <html suppressContentEditableWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
