import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { WathclistListItem } from '@/types/dto-types/WatchlistDto';
import { initials } from '@/utils/initials';

const WatchlistCardUsers = ({
  users
}: {
  users: WathclistListItem['users'];
}) => {
  return (
    <aside className="">
      <h3 className="text-lg font-semibold">Users</h3>
      <div className="flex flex-wrap items-center gap-2">
        {users.map((user) => {
          return (
            <Avatar title={user.firstName} className="shadow-md" key={user.id}>
              <AvatarImage src={user.image || undefined} alt={user.firstName} />
              <AvatarFallback className="text-sm">
                {initials(user.firstName, user.lastName || '')}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>
    </aside>
  );
};

export default WatchlistCardUsers;
