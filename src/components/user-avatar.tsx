import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, initials } from '@/lib/utils';

type UserAvatarProps = {
  user: { name: string; image?: string | null };
  size?: 'default' | 'sm' | 'lg';
  className?: string;
};

export function UserAvatar({
  user,
  size = 'default',
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback
        className={cn('font-medium', size === 'sm' && 'text-[10px]')}
      >
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
