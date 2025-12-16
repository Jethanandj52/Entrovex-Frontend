interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
  bgColorFrom: string;
  bgColorTo: string;
  textColor: string;
}

export default function ActivityItem({
  user,
  action,
  target,
  time,
  bgColorFrom,
  bgColorTo,
  textColor,
}: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div
        className={`avatar-circle bg-gradient-to-br from-${bgColorFrom} to-${bgColorTo} text-${textColor} text-sm`}
      >
        {user[0]}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{user}</span> {action}{" "}
          <span className="text-yellow-400">{target}</span>
        </p>
        <p className="text-xs text-purple-300 mt-1">{time}</p>
      </div>
    </div>
  );
}
