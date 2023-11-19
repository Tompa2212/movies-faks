import React from 'react';
import Image from 'next/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from './ui/Avatar';
import Icon from './ui/Icons';
import { User } from '@/types/User';

type UserAvatarProps = {
  user: Pick<User, 'firstName' | 'image'>;
} & AvatarProps;

const UserAvatar = ({
  user: { firstName, image },
  ...props
}: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{firstName}</span>
          <Icon name="User2" className="w-6 h-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
