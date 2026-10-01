import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing.");

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
const testSlug = `admin-product-schema-${crypto.randomUUID()}`;

try {
  const columns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name IN ('section', 'gallery_images')
    ORDER BY column_name
  `;
  const requiredColumns = new Set(columns.map((row) => row.column_name));
  if (!requiredColumns.has("section") || !requiredColumns.has("gallery_images")) {
    throw new Error("Product taxonomy columns are missing.");
  }

  const constraints = await sql`
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
      AND conname IN (
        'products_category_check',
        'products_section_check',
        'products_section_division_check'
      )
  `;
  if (constraints.length !== 3) throw new Error("Product taxonomy constraints are incomplete.");

  const [invalid] = await sql`
    SELECT count(*)::int AS count
    FROM public.products
    WHERE
      (category = 'casting' AND section NOT IN (
        'wax-injection-machines',
        'wax-processing-conditioning',
        'wax-room-automation',
        'shelling-solutions',
        'ceramic-injectors',
        'fettling-equipment'
      ))
      OR
      (category = 'robotics' AND section NOT IN (
        'end-of-line-packaging',
        'flexible-industrial-automation'
      ))
      OR category NOT IN ('casting', 'robotics')
  `;
  if (invalid.count !== 0) throw new Error(`${invalid.count} products have invalid taxonomy.`);

  await sql.begin(async (transaction) => {
    const [row] = await transaction`
      INSERT INTO public.products (
        code,
        slug,
        title,
        category,
        section,
        gallery_images,
        published
      )
      VALUES (
        'TEST.01',
        ${testSlug},
        'Temporary Admin Product Test',
        'robotics',
        'flexible-industrial-automation',
        ${["/test/gallery-one.png", "/test/gallery-two.png"]},
        false
      )
      RETURNING category, section, gallery_images, published
    `;
    if (
      row.category !== "robotics" ||
      row.section !== "flexible-industrial-automation" ||
      row.gallery_images.length !== 2 ||
      row.published !== false
    ) {
      throw new Error("Product admin fields did not round-trip correctly.");
    }
    await transaction`DELETE FROM public.products WHERE slug = ${testSlug}`;
  });

  console.log(
    JSON.stringify(
      {
        passed: true,
        columns: [...requiredColumns].sort(),
        taxonomyConstraints: constraints.length,
        invalidProducts: invalid.count,
        saveRoundTrip: true,
      },
      null,
      2,
    ),
  );
} finally {
  await sql.end();
}
