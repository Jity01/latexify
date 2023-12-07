'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
// import { getTexCode } from './model-actions';
 
const FormSchema = z.object({
  id: z.any(),
  customerId: z.any(),
  amount: z.any(),
  status: z.any(),
  date: z.any(),
});
 
const getLinkFromCloudinary = async (dataURI: string) => {
  const fd = new URLSearchParams();
  fd.append("file", dataURI);
  fd.append("cloud_name", process.env.CLOUDINARY_NAME || "");
  fd.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "");
  const response = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
    method: 'POST',
    body: fd,
  });
  const output = await response.json();
  const res = { link: output?.secure_url  };
  return res;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const date = new Date().toISOString().split('T')[0];
  try {
    const final = "\\documentclass[tikz,border=3mm]{standalone}\\begin{document}\\begin{tikzpicture}\\draw (2.0202421890903888,2.4827324431809585) circle (0.9718553931256253); \\draw[->] (1.9355999898403429,3.783321319641365) --(0.7160987493899766,2.436885453830463); \\draw (0.5636756887994077,0.5010126827248811) – (1.5116084083144479,1.8194925119364802) -- (1.2367379933506633,1.9655709520753062) -- cycle;\\draw (0.6202951386386653,1.3679678638308825) -- (1.4596634965202573,0.9442854309054267) -- (1.797676575935987,0.2014024161367316) -- cycle;\\draw (2.1580983497607966,2.320211700771045) circle (0.4089554990322346);\\draw (2.2213466795731707,2.260676817076252) circle (0.12455917604309041);\\end{tikzpicture}\\end{document}";
    const initial = "https://asset.cloudinary.com/dhwtmxkgq/0564ee2686f2c5f1def710360e08b30f"
    const email = amount
    const name = customerId
    const em = 'em'
    await sql`INSERT INTO customers (name, email, image_url) VALUES (${name}, ${email}, ${em})`;
    const customer_id = (await sql`SELECT id FROM customers WHERE name = ${name}`).rows[0].id;
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customer_id}, ${0}, ${'pending'}, ${date})
    `;
    await sql`
    INSERT INTO diagrams (initial, final, name) VALUES (${initial as string}, ${final}, ${name})`
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;

 try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialsSignin';
    }
    throw error;
  }
}
