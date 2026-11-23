const required = ["pet_id","applicant_name","email","phone","city","home_type","landlord_permission","household_agreement","pet_experience","care_plan","motivation"];
const limits = { applicant_name:120,email:200,phone:40,city:120,home_type:80,landlord_permission:100,household_agreement:100,pet_experience:1500,existing_pets:1000,care_plan:2000,motivation:2000 };
const clean = value => typeof value === "string" ? value.trim() : "";
export async function onRequestPost({ request, env }) {
  if (!env.DB) return Response.json({ error: "Adoption applications are temporarily unavailable." }, { status: 503 });
  let body; try { body = await request.json(); } catch { return Response.json({ error: "Please submit a valid form." }, { status: 400 }); }
  const values = Object.fromEntries(required.map(k => [k, clean(body[k])]));
  values.existing_pets = clean(body.existing_pets);
  for (const key of required) if (!values[key]) return Response.json({ error: "Please complete all required fields." }, { status: 400 });
  for (const [key,max] of Object.entries(limits)) if (values[key].length > max) return Response.json({ error: "One or more answers are too long." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  const pet = await env.DB.prepare("SELECT id FROM pets WHERE id=? AND status='available'").bind(values.pet_id).first();
  if (!pet) return Response.json({ error: "That pet is no longer available. Please refresh the page and choose another." }, { status: 409 });
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO applications (id,pet_id,applicant_name,email,phone,city,home_type,landlord_permission,household_agreement,pet_experience,existing_pets,care_plan,motivation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id,values.pet_id,values.applicant_name,values.email,values.phone,values.city,values.home_type,values.landlord_permission,values.household_agreement,values.pet_experience,values.existing_pets,values.care_plan,values.motivation).run();
  return Response.json({ ok:true, application_id:id }, { status:201 });
}
