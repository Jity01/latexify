import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices, fetchDiagrams } from '@/app/lib/data';
import Link from 'next/link';
import { DiagramsTable } from '@/app/lib/definitions';

interface DiagramsByName {
  [key: string]: DiagramsTable;
}

interface LinkList {
  [key: string]: string;
}

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  const diagrams = await fetchDiagrams();
  const diagramsByName: DiagramsByName = {}
  const initialLinks: LinkList = {}
  const finalLinks: LinkList = {}
  for (let diagram of diagrams) {
    const name = diagram.name
    diagramsByName[name] = diagram
  }
  for (let name in diagramsByName) {
    initialLinks[name] = diagramsByName[name].initial
  }
  for (let name in diagramsByName) {
    finalLinks[name] = String(diagramsByName[name].final)
  }
  const generateLink = (code: string) => {
    const data = code?.toString().trim().replaceAll(/%[^]*?\n/g, '').replaceAll('\\n', '').replaceAll(/\\\\/g, '\\')
    if (!data) return ''
    const bin = Buffer.from(data).toString('base64');
    const bin_uri = "data:text/plain;base64," + bin;
    const final_uri = "https://www.overleaf.com/docs?snip_uri=" + bin_uri;
    return final_uri
  };
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  File Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Initial Diagram
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Final Render
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={initialLinks[invoice.name] || "hi :0"} style={{color: "blue"}}>{invoice.name.slice(0, 3)}.initial_render</Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  <Link
                    href={generateLink(finalLinks[invoice.name]) || "hi :0"}
                    style={{color: "blue"}}
                  >
                    {invoice.name.slice(3, 7)}.final_render
                  </Link>
                  
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
