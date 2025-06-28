import { BookDetail } from './book-detail';

export default async function BookById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookDetail id={id} />;
}
