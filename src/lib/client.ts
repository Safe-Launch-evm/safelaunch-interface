import { toast } from "sonner";

type DataProps = {
  token?: string | undefined;
  formData?: any;
  tag?: string;
};

export default async function client(url: string, data: DataProps) {
  const { token, formData, tag } = data;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const origin = process.env.NEXT_PUBLIC_APP_CLIENT ?? '';

  const res = await fetch(`${BASE_URL}${url}`, {
    // cache: 'no-store',
    method: formData ? 'POST' : 'GET',
    next: { tags: [`${tag}`] },
    headers: {
      accept: 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  // console.log({ res: await res.json() })
  // const result = await res.json()

  // if (String(result.data).includes("E_INVALID_API_TOKEN")) {
  //   console.log('mamam')
  //   toast.error('Opps!', { description: 'Please connect your wallet.' });
  //   return;
  // }

  return res.json();
}
