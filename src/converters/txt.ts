export async function convertTxt(file: File): Promise<string> {
  const text = await file.text();
  return text;
}
