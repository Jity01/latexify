import { lusitana } from '@/app/ui/fonts';

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      code?: string;
  };
}) {
  const code = searchParams?.code || '';
  return (
    <div className={lusitana.className} style={{maxWidth: "700px"}}>
      <code style={{
        backgroundColor: "#f4f4f4",
        padding: "0.25em 0.5em",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#333"
      }}>
        {/* { code ? code : "Sorry, code couldn\'t be processed." } */}
        ""
      </code>
    </div>
  );
}