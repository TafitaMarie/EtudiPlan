import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "purple";
}

const colorStyles = {
  blue: "bg-blue-100/60 dark:bg-blue-950/50 text-blue-500 dark:text-blue-400",
  green: "bg-green-100/60 dark:bg-green-950/50 text-green-500 dark:text-green-400",
  orange: "bg-orange-100/60 dark:bg-orange-950/50 text-orange-500 dark:text-orange-400",
  purple: "bg-purple-100/60 dark:bg-purple-950/50 text-purple-500 dark:text-purple-400",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
