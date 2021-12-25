import { Room, User as Profile } from "@prisma/client";
import Badge from "./Badge";

interface MemberListProps {
  room: Room;
  members: (Profile & { isApproved: boolean })[];
}

const MemberList = ({ room, members }: MemberListProps) => {
  return (
    <ul role="list" className="-my-5 divide-y divide-gray-200">
      {members.map((member) => (
        <li key={member.id} className="py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src={member.avatarUrl}
                alt={member.firstName}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {`${member.firstName} ${member.lastName}`}
              </p>
              <p className="text-sm text-gray-500 truncate">{member.email}</p>
            </div>
            {member.id === room.creatorId && <Badge>Admin</Badge>}
            {!member.isApproved && <Badge variant="pending">Pending</Badge>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
