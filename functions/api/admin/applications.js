function authorized(request, env) {
  const expected = env.ADMIN_API_KEY;
  const supplied = request.headers.get("Authorization") || "";
  return !!expected && supplied === `Bearer ${expected}`;
}
export async function onRequestGet({ request, env }) {
  if (!authorized(request,env)) return Response.json({error:"Unauthorized"},{status:401});
  if (!env.DB) return Response.json({error:"Database is not configured"},{status:503});
  const {results}=await env.DB.prepare("SELECT a.*,p.name AS pet_name,p.species AS pet_species FROM applications a JOIN pets p ON p.id=a.pet_id ORDER BY a.created_at DESC LIMIT 500").all();
  return Response.json({applications:results||[]},{headers:{"Cache-Control":"no-store"}});
}
