export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ pets: [] });
  const { results } = await env.DB.prepare("SELECT id,name,species,breed,age_label,sex,size_label,location,description,image_url,status FROM pets WHERE status='available' ORDER BY created_at DESC").all();
  return Response.json({ pets: results || [] }, { headers: { "Cache-Control": "public, max-age=60" } });
}
