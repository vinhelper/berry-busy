import { Activity, GripVertical, ShieldCheck, Tags } from 'lucide-react';

const features = [
  {
    icon: Tags,
    title: 'Labels and due dates that pull their weight',
    body: 'Color-code cards however your team actually thinks, and let due dates surface the work that is about to slip instead of hiding it in a list.',
  },
  {
    icon: ShieldCheck,
    title: 'Share a board without handing over the keys',
    body: 'Invite people as owners, editors, or viewers. Clients see progress; contractors edit their lane; nobody deletes a column by accident.',
  },
  {
    icon: Activity,
    title: 'A history you can actually trust',
    body: 'Every move, assignment, and comment is written to the board’s activity log — so “who changed this?” has a real answer, not a guess.',
  },
  {
    icon: GripVertical,
    title: 'Reordering that never gets in the way',
    body: 'Cards use fractional positions, so dropping one between two others is instant and never renumbers the rest of the board.',
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          Enough structure to stay organised. Not enough to slow you down.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Every feature earns its place. If it does not help you see what is
          happening, it is not here.
        </p>
      </div>

      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1.5 text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
