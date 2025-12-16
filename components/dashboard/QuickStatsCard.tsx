interface QuickStatsCardProps {
  icon: string;
  iconBGColor: string;
    iconColor: string;
  label: string;
  value: string | number;
  subtitle: string;
}

export default function QuickStatsCard({
  icon,
    iconBGColor,
  iconColor,
  label,
  value,
  subtitle,
}: QuickStatsCardProps) {
  return (
    <div className=" hover:bg-white/20! glass-effect rounded-2xl p-6  transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBGColor} rounded-xl flex items-center justify-center`}
        >
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
        <span className="text-xs text-purple-300">{label}</span>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-purple-300">{subtitle}</p>
    </div>
  );
}
