import { MessageCircle, Users, Sparkles } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const stats = [
  { label: "Active rooms", value: "12", icon: Users },
  { label: "Unread", value: "4", icon: MessageCircle },
  { label: "Highlights", value: "8", icon: Sparkles },
];

const posts = [
  {
    author: "Ananya",
    role: "Teacher",
    title: "Weekly doubt-clearing starts at 7 PM",
    preview: "Bring questions from chapters 4–6. We’ll keep it to 45 minutes.",
  },
  {
    author: "Rahul",
    role: "Student",
    title: "Notes for kinematics, anyone?",
    preview: "Looking for a clean summary of projectile motion before Friday’s test.",
  },
];

const CommunityPage = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Hub"
        title="Community"
        subtitle="Rooms, updates, and questions from your class."
        action={
          <button type="button" className="btn btn-primary btn-sm rounded-xl">
            New post
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel flex items-center gap-4 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-neutral/60">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">{value}</p>
              <p className="text-xs text-neutral/50">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <article key={post.title} className="panel p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base-200 text-sm font-semibold">
                {post.author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{post.author}</p>
                <p className="text-[11px] text-neutral/45">{post.role}</p>
              </div>
            </div>
            <h2 className="text-[15px] font-semibold tracking-tight">
              {post.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral/55">
              {post.preview}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
