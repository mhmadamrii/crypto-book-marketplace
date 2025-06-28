export default async function BookById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Book by ID {id}</div>;
}
