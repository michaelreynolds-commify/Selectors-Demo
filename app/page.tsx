import SingleAvatarSelectDemo from "@/components/shadcn-space/select/select-single-avatar-search";
import MultiAvatarSelectDemo from "@/components/shadcn-space/select/select-multi-avatar-search";
import AssignMessageCard from "@/components/shadcn-space/message-card/assign-message-card";

const demos = [
  {
    title: "Single select · avatars · typeahead",
    description:
      "Assign to one person. The trigger shows the chosen avatar and name; type to filter the list.",
    component: <SingleAvatarSelectDemo />,
  },
  {
    title: "Multi select · avatars · typeahead",
    description:
      "Pick several people. The closed state stacks their avatars with an N/M count instead of chips; type to filter.",
    component: <MultiAvatarSelectDemo />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/30 px-6 py-16">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Avatar selectors
          </h1>
          <p className="text-muted-foreground">
            Searchable people pickers built on Command + Popover.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {demos.map((demo) => (
            <section
              key={demo.title}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="space-y-1">
                <h2 className="text-sm font-medium">{demo.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {demo.description}
                </p>
              </div>
              {demo.component}
            </section>
          ))}
        </div>

        <section className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-sm font-medium">Assignment on a message card</h2>
            <p className="text-xs text-muted-foreground">
              The bottom-right icon is the trigger. Click it to open a searchable
              people picker; once assigned it collapses to a name pill. Shown
              unassigned (left) and assigned (right).
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <AssignMessageCard
              contact="James & Rivera Associates"
              time="8:45 AM"
              senderInitials="MA"
              message="Great news — your appointment is confirmed for Thursday, Aug 21 at 10:30 AM. Reply STOP to cancel."
              defaultAssignee="22"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
