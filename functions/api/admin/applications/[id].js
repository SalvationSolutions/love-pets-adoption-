const statuses = new Set(["reviewing","approved","declined","completed"]);
export async function onRequestPatch({ request, env, params }) {
  const expected=env.ADMIN_API_KEY, supplied=request.headers.get("Authorization")||"";
  if(!expected||supplied!==`Bearer ${expected}`) return Response.json({error:"Unauthorized"},{status:401});
  if(!env.DB) return Response.json({error:"Database is not configured"},{status:503});
  let body;try{body=await request.json()}catch{return Response.json({error:"Invalid JSON"},{status:400})}
  if(!statuses.has(body.status)) return Response.json({error:"Invalid application status"},{status:400});
  const notes=typeof body.admin_notes==="string"?body.admin_notes.slice(0,3000):"";
  const result=await env.DB.prepare("UPDATE applications SET status=?,admin_notes=?,updated_at=datetime('now') WHERE id=?").bind(body.status,notes,params.id).run();
  if(!result.meta?.changes) return Response.json({error:"Application not found"},{status:404});
  return Response.json({ok:true});
}
